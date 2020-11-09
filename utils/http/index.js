import store from "../../store/index";
import actionMap from "./actionMap";

// 开启websocket
function openWebsocket() {
    uni.connectSocket({
        url: 'ws://localhost:8080'
    });
    uni.onSocketOpen((res) => {
        sendSocketMsg({
            type: "connect",
            data: {
                user: store.state.user,
            }
        })
    });
    // websocket收到消息逻辑处理
    uni.onSocketMessage((res) => {
        let reply = JSON.parse(res.data);
        actionMap[reply.type](reply);
    });
    uni.onSocketError((res) => {
        console.log(res);
        console.log("websocket出错了！");
    });
    uni.onSocketClose((res) => {
        console.log(res);
        console.log("已关闭！");
    });
}

// 发送websocket消息
async function sendSocketMsg(msg) {
    return await uni.sendSocketMessage({
        data: JSON.stringify(msg)
    })
}

// 更新游戏房间内msgs
async function sendDiscussionMsg(msg) {
    // msg = { // 传进来的msg应长这样：
    //     from: "小明", // 值为username, 即发消息方。后期可考虑增加to属性，即私聊时收消息方
    //     content: "xxx", // 消息内容
    // }
    msg = {
        ...msg,
        time: new Date().getTime(),
    }
    let msgs = store.getters.currentRoom.msgs.concat(msg);
    let roomId = store.getters.currentRoom.roomId;
    return await sendSocketMsg({
        type: "updateRoom",
        roomId,
        key: "msgs",
        data: {
            msgs
        }
    });
}

// 上传录音
async function uploadAudio(filePath) {
    const option = {
        url: "http://localhost:8000/upload/audio",
        filePath,
        formData: {
            filePath,
        },
        name: "myFile",
    };
    let res = await uni.uploadFile(option);
    return res;
}

// 更新游戏中玩家信息
async function updatePlayerInfo(msg) {
    // msg = {
    //     subKey: "isAlive", // player对象的key
    //     playerName: this.player.name, // 指定玩家名字
    //     data: { isAlive: "xxx" } // 对应key的data
    // }
    let roomId = store.getters.currentRoom.roomId;
    return await sendSocketMsg({
        type: "updateGameInfo",
        key: "players",
        roomId,
        data: {
            ...msg,
        }
    })
}
// 更新游戏信息，如game.finishRecord，key即为finishRecord，data即为true或者false
async function updateGameInfo(key, data) {
    // key = "finishRecord"; // game对象的key
    // data = true; // key要改的值
    let roomId = store.getters.currentRoom.roomId;
    return await sendSocketMsg({
        type: "updateGameInfo",
        key,
        roomId,
        data: {
            [key]: data,
        }
    })
}
// 收取投票结果
async function vote(msg) {
    // msg = {
    //     from: "小明", // this.player.name, 投票人
    //     target: "小红" // 投的人的username
    // }
    let roomId = store.getters.currentRoom.roomId;
    return await sendSocketMsg({
        type: "vote",
        roomId,
        data: {
            ...msg
        }
    })
}
// 发起更新房间状态请求，等待所有玩家都完成后才更新状态
async function emitRoomState(state) {
    let roomId = store.getters.currentRoom.roomId;
    return await sendSocketMsg({
        type: "updateGameInfo",
        key: "state",
        roomId,
        data: {
            state
        }
    })
}

// 测试用的用户名称获取
async function getRandomNickname() {
    return "小明";
    // return (await uni.request({
    //     url: "http://hn216.api.yesapi.cn/?s=App.Common_Nickname.RandOne&return_data=0&need_lan=中文&app_key=CCBB84F9C20989CC3110C3EC590D4383&sign=7222FC6E5229B2FB193605D40B1EF654"
    // }))[1].data.data.nickname;
}

export default {
    openWebsocket,
    sendSocketMsg,
    sendDiscussionMsg,
    uploadAudio,
    updatePlayerInfo,
    updateGameInfo,
    vote,
    emitRoomState,
    getRandomNickname
}
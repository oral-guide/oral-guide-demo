function openWebsocket() {
    uni.connectSocket({ url: 'ws://localhost:8080' });
    uni.onSocketOpen((res) => {
        console.log(res);
        console.log("websocket已打开！");
    });
    uni.onSocketMessage((res) => {
        console.log(res);
        console.log("收到服务器信息！");
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

function sendSocketMsg(msg, cb = () => {}) {
    uni.sendSocketMessage({
        data: JSON.stringify(msg),
        success: cb,
        fail: (err) => {
            console.log(err);
        }
    })
}

async function getRandomNickname() {
    return (await uni.request({ url: "http://hn216.api.yesapi.cn/?s=App.Common_Nickname.RandOne&return_data=0&need_lan=中文&app_key=CCBB84F9C20989CC3110C3EC590D4383&sign=7222FC6E5229B2FB193605D40B1EF654" }))[1].data.data.nickname;
}

export default {
    openWebsocket,
    sendSocketMsg,
    getRandomNickname
}
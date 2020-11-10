const express = require("express");
const app = express();
const WebSocket = require('ws');
app.use(express.static("static"));
const multer = require("multer");
const path = require("path");

let https = require("https");
let fs = require("fs");
const privateKey = fs.readFileSync(path.join(__dirname, './certificate/4394053_www.humansean.com.key'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, './certificate/4394053_www.humansean.com.pem'), 'utf8');
const credentials = {
    key: privateKey,
    cert: certificate
};
const httpsServer = https.createServer(credentials, app);
var SSLPORT = 8080;
httpsServer.listen(SSLPORT, function () {
    console.log(`冲啊${SSLPORT}！`);
});


// 音频上传
var uploadAudio = multer({
    storage: multer.diskStorage({
        destination: path.join(__dirname, './static/uploads/recordings/'),
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    })
});
app.post('/upload/audio', uploadAudio.single("myFile"), function (req, res) {
    res.json({
        status: 200,
        msg: "success",
        data: {
            'url': 'https://humansean.com:8080/uploads/recordings/' + req.file.filename
        }
    })
})

// WebSocket
const wss = new WebSocket.Server({
    server: httpsServer
});

const userMap = {};
let rooms = [
    // {
    // roomId: 0,
    // name: "大佬房",
    // pswd: "",
    // seats: 8,
    // users: [{
    //         name: "小明",
    //         roomId: 0,
    //         isOwner: true
    //     },
    //     {
    //         name: "银角大王",
    //         roomId: 0,
    //         isOwner: false
    //     },
    //     {
    //         name: "山拉拉卡",
    //         roomId: 0,
    //         isOwner: false
    //     },
    //     {
    //         name: "雷伊",
    //         roomId: 0,
    //         isOwner: false
    //     },
    //     {
    //         name: "鱼雨遇",
    //         roomId: 0,
    //         isOwner: false
    //     },
    //     {
    //         name: "跟着党走",
    //         roomId: 0,
    //         isOwner: false
    //     },
    //     {
    //         name: "多喝水",
    //         roomId: 0,
    //         isOwner: false
    //     },
    //     {
    //         name: "小红",
    //         roomId: 0,
    //         isOwner: false
    //     }
    // ],
    // msgs: [{
    //         from: "小红",
    //         content: "我认为...."
    //     },
    //     {
    //         from: "小明",
    //         content: "AAAA"
    //     },
    //     {
    //         from: "跟着党走",
    //         content: "你才是"
    //     }
    // ],
    // type: "spy",
    // isPlaying: true,
    // game: {
    //     state: "preparing", // preparing, recording, playing, discussing, voting, revoting
    //     players: [{
    //             name: "小明",
    //             roomId: 0,
    //             isOwner: true,
    //             records: [],
    //             isAlive: true,
    //             isSpy: true,
    //             isSpeaking: false,
    //         },
    //         {
    //             name: "银角大王",
    //             roomId: 0,
    //             isOwner: false,
    //             records: [],
    //             isAlive: true,
    //             isSpy: false,
    //             isSpeaking: false,
    //         },
    //         {
    //             name: "山拉拉卡",
    //             roomId: 0,
    //             isOwner: false,
    //             records: [],
    //             isAlive: true,
    //             isSpy: false,
    //             isSpeaking: false,
    //         },
    //         {
    //             name: "雷伊",
    //             roomId: 0,
    //             isOwner: false,
    //             records: [],
    //             isAlive: true,
    //             isSpy: true,
    //             isSpeaking: false,
    //         },
    //         {
    //             name: "鱼雨遇",
    //             roomId: 0,
    //             isOwner: false,
    //             records: [],
    //             isAlive: true,
    //             isSpy: false,
    //             isSpeaking: false,
    //         },
    //         {
    //             name: "跟着党走",
    //             roomId: 0,
    //             isOwner: false,
    //             records: [],
    //             isAlive: true,
    //             isSpy: false,
    //             isSpeaking: false,
    //         },
    //         {
    //             name: "多喝水",
    //             roomId: 0,
    //             isOwner: false,
    //             records: [],
    //             isAlive: true,
    //             isSpy: false,
    //             isSpeaking: false,
    //         },
    //         {
    //             name: "小红",
    //             roomId: 0,
    //             isOwner: false,
    //             records: [],
    //             isAlive: true,
    //             isSpy: false,
    //             isSpeaking: false,
    //         }
    //     ],
    //     words: [],
    //     activePlayers() {
    //         return this.players.filter(player => player.isAlive).length;
    //     },
    //     activeSpies() {
    //         return this.players.filter(player => player.isAlive && player.isSpy).length;
    //     },
    //     finishCount: 0,
    //     voteResult: [],
    //     voteMsg: "",
    //     targetPlayer: ""
    // }
// }
];
wss.on("connection", ws => {
    ws.on("message", msg => {
        // 消息分发处理中心
        msg = JSON.parse(msg);
        actionMap[msg.type](msg, ws);
    })
    ws.on("close", () => {
        if (userMap[ws.user.name].user.roomId) {
            // 还在房间里，退出房间
            forceLeaveRoom(ws)
        }
        delete userMap[ws.user.name];
        // 还需考虑下用户的inRoom或inGame状态
    })
})


let actionMap = {
    // 用户上线
    connect,
    // 房间相关
    createRoom,
    enterRoom,
    leaveRoom,
    // 消息相关
    updateRoom,
    updateGameInfo,
    // 投票相关
    vote
}

// 更新相关

function updateRooms(broadcastType, target) {
    let reply = {
        type: "update",
        key: "rooms",
        data: {
            rooms
        }
    }
    switch (broadcastType) {
        case 0:
            notify(target, reply); // 此时target即单个用户websocket实例
            break;
        case 1:
            roomBroadcast(target, reply); // 此时target即对应房间
            break;
        case 2:
            broadcast(reply);
            break;
    }
}

// 用户上线
function connect(msg, ws) {
    ws.user = msg.data.user;
    userMap[msg.data.user.name] = ws;
    updateRooms(0, ws);
}

// 房间相关逻辑

function createRoom(msg) {
    // msg = {
    //     type: "createRoom",
    //     data: { name, pswd, seats, type }
    // }
    let {
        roomId,
        name,
        pswd,
        seats,
        type
    } = msg.data;
    let room = {
        roomId,
        name,
        pswd,
        seats,
        users: [],
        msgs: [],
        type,
        isPlaying: false
    }
    rooms.push(room);
    updateRooms(2);
    console.log(`房间“${room.name}”被创建了。`);
}

function enterRoom(msg) {
    // msg = {
    //     type: "enterRoom",
    //     data: { roomId, user }
    // }
    let {
        roomId,
        user
    } = msg.data;
    let room = rooms.find(room => room.roomId === roomId);
    room.users.push(user);

    if (room.users.length === room.seats) {
        // 人满了发车
        startSpyGame(room)
    }

    // 更新用户的room状态
    userMap[user.name].user.roomId = roomId;

    updateRooms(2);

    console.log(`${user.name}进入了房间“${room.name}”。目前房间内人数为${room.users.length}/${room.seats}`);
}

function leaveRoom(msg) {
    // msg = {
    //     type: "leaveRoom",
    //     data: { roomId, user }
    // }
    let {
        roomId,
        user
    } = msg.data;
    leaveHelper(roomId, user);
}

function forceLeaveRoom(ws) {
    let roomId = ws.user.roomId;
    let user = ws.user;
    leaveHelper(roomId, user);

}

function leaveHelper(roomId, user) {
    let room = rooms.find(room => room.roomId === roomId);
    if (!room) return;
    if (room.users.length === 1) {
        // 最后一个人离开当前房间，即销毁此房间
        console.log(`房间“${room.name}”没人了，被销毁了。`);
        rooms.splice(rooms.indexOf(room), 1);
    } else {
        // 用户离开房间
        room.users.splice(room.users.findIndex(u => u.name === user.name), 1);
    }
    // 更新用户的room状态
    userMap[user.name].user.roomId = 0;
    updateRooms(2);
    console.log(`${user.name}离开了房间“${room.name}”。`);
}

// 消息相关
function updateRoom(msg) {
    let room = rooms.find(room => room.roomId === msg.roomId);
    // key可以是msgs等
    room[msg.key] = msg.data[msg.key];
    updateRooms(1, room);
}
// 更新room.game的相关信息，如player.records录音数据，player.isAlive的情况等
function updateGameInfo(msg) {
    let room = rooms.find(room => room.roomId === msg.roomId);
    // msg.key可以是players等，msg.data.subKey可以是records等
    if (msg.data.subKey) {
        // 有subKey，目前唯有players存在
        let players = room.game[msg.key];
        let player = players.find(player => player.name === msg.data.playerName);
        player[msg.data.subKey] = msg.data.data[msg.data.subKey];

        if (msg.data.subKey === "records") {
            // 更新录音状态
            room.game.finishCount++;

            if (room.game.finishCount === room.game.activePlayers()) {
                // 全部录音准备完成，更改状态，开始播放
                room.game.state = "playing";
                room.game.finishCount = 0;
                updateRooms(1, room);
            }

        }
    } else {
        // 更新game的key
        if (msg.key === "state") {
            // 如果是更新state，得收集到所有玩家完成的信号才更改
            room.game.finishCount++;
            if (room.game.finishCount === room.game.activePlayers()) {
                // 全部玩家准备好，可以更改状态了
                room.game[msg.key] = msg.data[msg.key];
                room.game.finishCount = 0;
                updateRooms(1, room);
            }

        } else {
            room.game[msg.key] = msg.data[msg.key];
        }
    }

}

// 投票相关（初步逻辑：全部投好了再结算
function vote(msg) {
    let room = rooms.find(room => room.roomId === msg.roomId);
    room.game.voteResult.push(msg.data);
    if (room.game.voteResult.length === room.game.activePlayers()) {
        // 收集到所有active玩家的投票结果后
        room.game.targetPlayer = room.game.voteResult.findMostOccurence("target");
        room.game.voteResult = [];
        if (room.game.targetPlayer.length === 1) {
            // 投出一名玩家，该轮结束
            let player = room.game.players.find(player => player.name === room.game.targetPlayer[0]);
            // 更新玩家状态
            player.isAlive = false;
            // 发起继续游戏的信号or发起游戏结束的信号
            let identity = player.isSpy ? "卧底" : "平民";
            let winner = player.isSpy ? "平民" : "卧底";
            let gameEnd = !room.game.activeSpies() || (room.game.activeSpies() * 2) === room.game.activePlayers(); // 卧底没了，或卧底数等于平民数了，游戏结束
            if (gameEnd) {
                room.game.voteMsg = `得票数最高的是【${room.game.targetPlayer[0]}】，身份为${identity}，恭喜${winner}获得胜利！`;
                // 游戏结束
                room.game.state = "ending";
            } else {
                room.game.voteMsg = `得票数最高的是【${room.game.targetPlayer[0]}】，身份为${identity}，游戏继续！`;
                // 游戏继续
                room.game.state = "preparing";
            }
        } else {
            // 投出两名或以上的玩家，发起重新投票的信号
            room.game.voteMsg = `得票数最高的是【${room.game.targetPlayer.join("，")}】，重新进行投票！`;
            room.game.state = "revoting";
        }
        // GO!
        updateRooms(1, room);
    }
}

// 游戏相关
function startSpyGame(room) {
    // players是对原先users数组的每个对象扩充了isAlive, isSpy等属性的数组
    let players = room.users
        .shuffle() // 打乱顺序
        .map(user => { // 增加游戏所需属性
            return {
                ...user,
                isAlive: true,
                isSpeaking: false,
                isSpy: false,
                records: []
            }
        })
    players.setSpy(); // 设置卧底（4-6一个，7-8两个）
    room.game.players = players;
    room.game.words = [];
    // 开始游戏
    roomBroadcast(room, {
        type: "initializeGame"
    })
}

function notify(ws, reply) {
    ws.send(JSON.stringify(reply));
}

function roomBroadcast(room, reply) {
    room.users.forEach(user => {
        if (userMap[user.name]) {
            userMap[user.name].send(JSON.stringify(reply));
        }
    })
}

function broadcast(reply) {
    Object.keys(userMap).forEach(key => {
        const ws = userMap[key];
        ws.send(JSON.stringify(reply));
    })
}






// helper functions
// 随机洗牌，打乱玩家顺序用
Array.prototype.shuffle = function () {
    let arr = this.slice();
    let m = arr.length,
        t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = arr[m];
        arr[m] = arr[i];
        arr[i] = t;
    }
    return arr;
}
// 找到出现最多的元素，投票用
Array.prototype.findMostOccurence = function (key) {
    let arr = this;
    let max = 0;
    let hash = {};
    let results = [];
    arr.forEach(item => {
        if (key) item = item[key];
        if (!hash[item]) {
            hash[item] = 0;
        }
        hash[item]++;
        max = Math.max(hash[item], max);
    })
    Object.keys(hash).forEach(key => {
        if (hash[key] === max) {
            results.push(key);
        }
    })
    return results;
}
// 根据玩家人数随机设定某个玩家为卧底
Array.prototype.setSpy = function () {
    let arr = this;
    let index = Math.floor(arr.length * Math.random());
    arr[index].isSpy = true;
    if (arr.length > 6) {
        let anotherIndex = Math.floor(arr.length * Math.random());
        while (anotherIndex === index) {
            anotherIndex = Math.floor(arr.length * Math.random());
        }
        arr[anotherIndex].isSpy = true;
    }
}
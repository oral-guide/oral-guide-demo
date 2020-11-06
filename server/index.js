const express = require("express");
const app = express();
const WebSocket = require('ws');
app.use(express.static("static"));
const multer = require("multer");
const path = require("path");

app.listen(8000, () => {
    console.log("冲啊8000！");
})

// 音频上传
var uploadAudio = multer({
    storage: multer.diskStorage({
        destination: path.join(__dirname, './static/uploads/music/'),
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
            'url': 'http://localhost:8080/uploads/music/' + req.file.filename
        }
    })
})

// WebSocket
const wss = new WebSocket.Server({
    port: 8080
});

const userMap = {};
let rooms = [];
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
    connect,
    createRoom,
    enterRoom,
    leaveRoom,
}

// 更新相关

function updateRooms(isBroadcast, target) {
    let reply = {
        type: "update",
        key: "rooms",
        data: {
            rooms
        }
    }
    if (isBroadcast) {
        broadcast(reply);
    } else {
        notify(target, reply);
    }
}

// 用户上线
function connect(msg, ws) {
    ws.user = msg.data.user;
    userMap[msg.data.user.name] = ws;
    updateRooms(false, ws);
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
    updateRooms(true);
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

    updateRooms(true);

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
    userMap[user.name].user.roomId = roomId;
    updateRooms(true);
    console.log(`${user.name}离开了房间“${room.name}”。`);
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
                isSpy: false
            }
        })
    players.setSpy(); // 设置卧底（4-6一个，7-8两个）
    roomBroadcast(room, {
        type: "initializeGame",
        data: {
            words: null, // TODO @心瑶：在这里注入数据
            players,
        }
    })
}

function notify(ws, reply) {
    ws.send(JSON.stringify(reply));
}

function roomBroadcast(room, reply) {
    room.users.forEach(user => {
        userMap[user.name].send(JSON.stringify(reply));
    })
}

function broadcast(reply) {
    Object.keys(userMap).forEach(key => {
        const ws = userMap[key];
        ws.send(JSON.stringify(reply));
    })
}






// helper functions
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
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
    // 发送当前聊天列表
    console.log("新用户来啦！");

    ws.on("message", msg => {
        // 消息分发处理中心
        msg = JSON.parse(msg);
        console.log(msg);
        actionMap[msg.type](msg, ws);
    })
    ws.on("close", () => {
        if (userMap[ws.user.name].user.room) {
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
    console.log(rooms);
}

function connect(msg, ws) {
    ws.user = msg.data.user;
    userMap[msg.data.user.name] = ws;
    updateRooms(false, ws);
}

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

    // 更新用户的room状态
    userMap[user.name].user.room = roomId;

    updateRooms(true);
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
    let {
        room
    } = ws.user;
    let user = ws.user;
    leaveHelper(room, user);

}

function leaveHelper(roomId, user) {
    let room = rooms.find(room => room.roomId === roomId);
    if (room.users.length === 1) {
        // 最后一个人离开当前房间，即销毁此房间
        rooms.splice(rooms.indexOf(room), 1);
    } else {
        // 用户离开房间
        room.users.splice(room.users.findIndex(u => u.name === user.name), 1);
    }
    // 更新用户的room状态
    userMap[user.name].user.room = roomId;
    updateRooms(true);
}

function notify(ws, reply) {
    ws.send(JSON.stringify(reply));
}

function roomBroadcast(target, reply) {
    target.forEach(id => {
        userMap[id].send(JSON.stringify(reply));
    })
}

function broadcast(reply) {
    Object.keys(userMap).forEach(key => {
        const ws = userMap[key];
        ws.send(JSON.stringify(reply));
    })
}
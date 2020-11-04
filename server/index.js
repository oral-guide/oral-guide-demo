// const express = require("express");
// const app = express();
const WebSocket = require('ws');

// WebSocket
const wss = new WebSocket.Server({ port: 8080 });

const userMap = {};
const msgs = [];
let rooms = [];
wss.on("connection", ws => {
    // 发送当前聊天列表
    ws.on("message", msg => {
        // 消息分发处理中心
        msg = JSON.parse(msg);
        let reply;
        switch (msg.type) {
            // 新用户连接
            case "connect":
                ws.userId = msg.userId;
                ws.username = msg.username;
                userMap[msg.userId] = ws;
                msgs.push({
                    userId: 1,
                    username: "系统",
                    content: msg.username + "上线了。",
                    time: msg.time
                })
                reply = {
                    type: "user-change",
                    msgs,
                    userMap
                }
                broadcast(JSON.stringify(reply));
                break;
            case "message":
                msgs.push({
                    userId: msg.userId,
                    username: msg.username,
                    content: msg.content,
                    time: msg.time,
                })
                reply = {
                    type: "message",
                    msgs
                }
                broadcast(JSON.stringify(reply));
                break;
            case "private":
                reply = {
                    type: "private",
                    from: msg.userId,
                    to: msg.target,
                    msg: {
                        userId: msg.userId,
                        username: msg.username,
                        content: msg.content,
                        time: msg.time
                    }
                }
                notify([msg.userId, msg.target], JSON.stringify(reply));

            default:
                break;
        }
    })
    ws.on("close", () => {
        delete userMap[ws.userId];
        msgs.push({
            userId: 1,
            username: "系统",
            content: ws.username + "下线了。",
            time: new Date().getTime()
        })
        let reply = {
            type: "user-change",
            msgs,
            userMap
        }
        broadcast(JSON.stringify(reply));
    })
})

function notify(target, msg) {
    target.forEach(id => {
        userMap[id].send(msg);
    })
}

function broadcast(msg) {
    Object.keys(userMap).forEach(key => {
        const ws = userMap[key];
        ws.send(msg);
    })
}
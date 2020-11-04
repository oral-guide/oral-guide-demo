import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        ws: null,
        msg: "hhh"
    },
    mutations: {
        setWs(state, ws) {
            state.ws = ws;
        }
    },
    actions: {
        setWs({ commit, state }, ws) {
            ws.onopen = () => {
              // 连接事件
              let currentTime = new Date().getTime();
              let msg = {
                type: "connect",
                user: state.user,
                time: currentTime
              };
              ws.send(JSON.stringify(msg));
            };
            ws.onmessage = msg => {
                console.log(msg);
              // 消息集散中心
            //   const reply = JSON.parse(msg.data);
            //   switch (reply.type) {
            //     case "user-change":
            //       commit("setUserMap", reply.userMap);
            //       commit("setMsgs", reply.msgs);
            //       break;
            //     case "message":
            //       commit("setMsgs", reply.msgs);
            //       break;
            //     case "private":
            //       // 收到消息
            //       // if (reply.to === state.userId) {
            //       //     if (!this.privateMsgs[reply.from]) {
            //       //         this.$set(this.privateMsgs, reply.from, []);
            //       //     }
            //       //     this.privateMsgs[reply.from].push(reply.msg);
            //       // }
            //       break;
            //     case "rooms":
            //       commit("setRooms", reply.rooms);
            //       break;
            //     default:
            //       break;
            //   }
            };
            commit("setWs", ws);
        }
    }
})
export default store;
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);



const store = new Vuex.Store({
    state: {
        user: {
            name: "",
            roomId: 0,
            isOwner: false,
            canLeave: true
        },
        rooms: [],
        // 游戏逻辑，得房间里面开始游戏后才用到
        gameSpy: null,
        role: null
    },
    mutations: {
        setUsername(state, name) {
            state.user.name = name;
        },
        setUserRoom(state, roomId) {
            state.user.roomId = roomId;
        },
        setUserRole(state, role) {
            state.user.isOwner = role;
        },
        setUserPower(state, power) {
            state.user.canLeave = power;
        },
        setRooms(state, rooms) {
            state.rooms = rooms;
        }
    },
    actions: {
    }
})
export default store;
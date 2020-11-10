import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);



const store = new Vuex.Store({
    state: {
        user: {
            name: "",
            roomId: 0,
            isOwner: false,
        },
        rooms: [
            // 测试房间已在server里面写死，直接就会获取到
        ],
        ws: ""
    },
    getters: {
        currentRoom: state => {
            return state.rooms.find(room => room.roomId === state.user.roomId);
        },
        game: (state, getters) => {
            return getters.currentRoom ? getters.currentRoom.game : null;
        },
        gameState: (state, getters) => {
            return getters.game ? getters.game.state : "";
        },
        players: (state, getters) => {
            return getters.game ? getters.game.players : [];
        },
        player: (state, getters) => {
            return getters.players.find(player => player.name === state.user.name);
        },
        word: (state, getters) => {
            if (!getters.player || !getters.game.words.length) return null;
            return getters.player.isSpy ? getters.game.words[1] : getters.game.words[0];
        },
        msgs:(state,getters)=>{
            return getters.currentRoom? getters.currentRoom.msgs:null;
        }
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
        setRoomState(state, val) {
            let room = state.rooms.find(room => room.roomId === state.user.roomId);
            room.game.state = val;
            console.log("roomId: " + state.user.roomId);
            console.log("val: " + room.game.state);
        },
    },
    actions: {
    }
})
export default store;
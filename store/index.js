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
        rooms: [],
        // 游戏逻辑，得房间里面开始游戏后才用到
        gameSpy: null,
        words: [],
        players: []
    },
    getters: {
        player: state => {
            return state.players.find(player => player.name === state.user.name);
        },
        word: (state, getters) => {
            if (!getters.player || !state.words.length) return null;
            return getters.player.isSpy ? state.words[1] : state.words[0];
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
        setRooms(state, rooms) {
            state.rooms = rooms;
        }
    },
    actions: {
    }
})
export default store;
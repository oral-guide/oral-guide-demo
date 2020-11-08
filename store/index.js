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
            // 以下内容已在server里面写死，直接就会获取到
            // {
            //     roomId: 0,
            //     name: "大佬房",
            //     pswd: "",
            //     seats: 8,
            //     users: [
            //         {
            //             name: "小明",
            //             roomId: 0,
            //             isOwner: true
            //         },
            //         {
            //             name: "银角大王",
            //             roomId: 0,
            //             isOwner: false
            //         },
            //         {
            //             name: "山拉拉卡",
            //             roomId: 0,
            //             isOwner: false
            //         },
            //         {
            //             name: "雷伊",
            //             roomId: 0,
            //             isOwner: false
            //         },
            //         {
            //             name: "鱼雨遇",
            //             roomId: 0,
            //             isOwner: false
            //         },
            //         {
            //             name: "跟着党走",
            //             roomId: 0,
            //             isOwner: false
            //         },
            //         {
            //             name: "多喝水",
            //             roomId: 0,
            //             isOwner: false
            //         },
            //         {
            //             name: "小红",
            //             roomId: 0,
            //             isOwner: false
            //         }
            //     ],
            //     msgs: [],
            //     type: "spy",
            //     isPlaying: true
            // }
        ],
    },
    getters: {
        currentRoom: state => {
            return state.rooms.find(room => room.roomId === state.user.roomId);
        },
        game: (state, getters) => {
            return getters.currentRoom ? getters.currentRoom.game : null;
        },
        players: (state, getters) => {
            return getters.game ? getters.game.players : [];
        },
        player: (state, getters) => {
            console.log("players", state.rooms);
            return getters.players.find(player => player.name === state.user.name);
        },
        word: (state, getters) => {
            if (!getters.player || !getters.game.words.length) return null;
            return getters.player.isSpy ? getters.game.words[1] : getters.game.words[0];
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
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);



const store = new Vuex.Store({
    state: {
        user: {
            name: "",
            room: 0
        },
        rooms: []
    },
    mutations: {
        setUsername(state, name) {
            state.user.name = name;
        },
        setUserRoom(state, roomId) {
            state.user.room = roomId;
        },
        setRooms(state, rooms) {
            state.rooms = rooms;
        }
    },
    actions: {
    }
})
export default store;
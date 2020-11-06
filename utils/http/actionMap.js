import store from "../../store/index";
// function capitalize(str) {
//     return str[0].toUpperCase() + str.slice(1);
// }
function update(reply) {
    store.state[reply.key] = reply.data[reply.key];
}
function initializeGame(reply) {
    store.state.players = reply.data.players;
    store.state.words = reply.data.words;
}
export default {
    update,
}
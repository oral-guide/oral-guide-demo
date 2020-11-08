import store from "../../store/index";
// function capitalize(str) {
//     return str[0].toUpperCase() + str.slice(1);
// }
function update(reply) {
    console.log(reply.data[reply.key]);
    store.state[reply.key] = reply.data[reply.key];
    console.log(store.state[reply.key]);
}
function initializeGame() {
    // 游戏开始，执行页面跳转即可
    
}
export default {
    update,
    initializeGame,
}
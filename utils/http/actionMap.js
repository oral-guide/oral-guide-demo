import store from "../../store/index";
// function capitalize(str) {
//     return str[0].toUpperCase() + str.slice(1);
// }
function update(reply) {
    store.state[reply.key] = reply.data[reply.key];
}

function initializeGame() {
    // 游戏开始，执行页面跳转即可
    uni.navigateTo({
        url: "../game/index",
    });
}

export default {
    update,
    initializeGame
}
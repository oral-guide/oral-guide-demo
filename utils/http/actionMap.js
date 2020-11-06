import store from "../../store/index";
// function capitalize(str) {
//     return str[0].toUpperCase() + str.slice(1);
// }
function update(reply) {
    store.state[reply.key] = reply.data[reply.key];
}
export default {
    update,
}
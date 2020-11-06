import store from "../../store/index";
// function capitalize(str) {
//     return str[0].toUpperCase() + str.slice(1);
// }
function update(reply) {
    console.log(store);
    store.state[reply.key] = reply.data[reply.key];
    console.log(store.state);
    // store._mutations[`set${capitalize(reply.key)}`](reply.data[reply.keys]);
}
export default {
    update,
}
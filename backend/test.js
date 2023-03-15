let hello = {};
const newHello = {
    say: "bellooooo"
}
setTimeout(() => {
    Object.assign(hello, newHello)
}, 1000);
module.exports = hello
// connect to the socket
let socket = io('localhost:3001');
socket.on('message', (msg) => {
    const messages = document.createElement('li');
    messages.innerHTML = msg;
    document.querySelector('ul').appendChild(messages);
})

document.querySelector('button').onclick = () => {
    const message = document.querySelector('input').value;
    socket.emit('message', message);
    document.querySelector('input').value = '';
}
const express = require("express")
const app = express()
const { connectDatabase } = require('./dbConnection');
const userRoutes = require('./routes/user');
const carRoutes = require('./routes/car');


// Connect to the database
connectDatabase()
    .then(() => {
        app.use('/', userRoutes);
        app.use('/', carRoutes);
        app.set('view engine', 'ejs');
        app.set('views', __dirname + '/views');
        app.use(express.static('public'));

        // Start the server
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Failed to connect to the database:', error);
        process.exit(1);
    })
    .catch(error => {
        console.error('An unexpected error occurred:', error);
        process.exit(1);
    });


app.get('/', function (req, res) {
    res.render('index');
});

app.get('/chat', function (req, res) {
    // socket
    let http = require('http').createServer(app);
    let io = require('socket.io')(http, { cors: { origin: '*' } });
    io.on('connection', (socket) => {

        console.log('a user connected');
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
        socket.on('message', (msg) => {
            console.log('message: ' + msg);
            io.emit('message', `${socket.id.substr(0, 2)} said "${msg}"`);
        });
    });

    http.listen(3001, () => {
        console.log('Listening for socket connection on port: 3001');
    });

    res.render('chat');
});

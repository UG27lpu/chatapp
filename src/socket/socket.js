const { Server } = require("socket.io");

let io;
const onlineUsers = new Map();

function initSocket(server) {
    io = new Server(server, { cors: { origin: "*" } });

    io.on("connection", (socket) => {
        socket.on("join", (userId) => {
            onlineUsers.set(userId, socket.id);
        });
        socket.on("disconnect", () => {
            for (const [key, value] of onlineUsers.entries()) {
                if (value === socket.id) onlineUsers.delete(key);
            }
        });
    });
}

function getIO() {
    return io;

}

module.exports = initSocket;
module.exports.getIO = getIO;
module.exports.onlineUsers = onlineUsers;
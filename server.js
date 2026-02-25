require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./src/config/db");
const chatRoutes = require("./src/routes/chat.routes");
const errorMiddleware = require("./src/middleware/error.middleware");
const initSocket = require("./src/socket/socket");

const app = express();
const server = http.createServer(app);
initSocket(server);

// middleware
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.static("public"));
app.use(morgan("dev"));

// routes
app.use("/api/chat", chatRoutes);

// health
app.get("/", (req, res) => res.send("Chat API Running"));

// error middleware
app.use(errorMiddleware);

//DB + server start
connectDB();
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));




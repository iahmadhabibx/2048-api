const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

require("./connection");

const room = require("./routes/room");
app.use("/room", room);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Litening to port: ${PORT}`);
});
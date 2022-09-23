const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Room Schema
const roomSchema = new mongoose.Schema({
    roomId: String,
    name: String,
    code: String,
    players: Array,
    leader: Object,
    createdBy: Object,
    createdAt: Date
});

// Room Model
const Room = mongoose.model('Room', roomSchema);

module.exports = { Room }
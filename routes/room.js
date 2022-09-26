const express = require("express");
const { Room } = require("../Schemas");
const Router = express.Router();

Router.post("/", async (req, res, next) => {
    try {
        const { players, leader, code, createdBy } = req.body;
        const roomId = `room-${createdBy.name}`;
        let room = await Room.findOne({ roomId });
        if (room) return res.status(409).send({message: "Room Already exists"})
        else {
            const createdAt = new Date();
            const room = new Room({ roomId, createdAt, code, players, leader, createdBy });
            const doc = await room.save();
            res.status(200).send(doc);
        }
    } catch (error) {
        next(error);
    }
});

Router.post("/checkRoom", async (req, res, next) => {
    try {
        const { id } = req.body;
        let room = await Room.findOne({ roomId: id });
        if (!room._id) {
            return res.status(500).json("Couln't find room with this ID");
        } else {
            res.status(200).send(room);
        }
    } catch (error) {
        next(error);
    }
});

Router.post("/join", async (req, res, next) => {
    try {
        const { player, roomId, code } = req.body;
        let room = await Room.find({ _id: roomId, code });
        if (!room || !room.length) return res.status(500).send("Code is invalid");
        else {
            const { players } = room[0];
            let addedPlayer = players.some(p => p.name === player.name);
            if (addedPlayer) return res.status(500).send({ error: "Please use a different name" });
            else {
                players.push(player);
                const updatedRoom = await Room.findOneAndUpdate({ _id: room[0]._id }, {
                    $set: { players }
                }, { new: true });
                res.status(200).send(updatedRoom);
            }
        }

    } catch (error) {
        next(error);
    }
});

Router.post("/removePlayer", async (req, res, next) => {
    try {
        const { roomId, player } = req.body;
        let room = await Room.findById(roomId);
        if (!room) {
            return res.status(500).send("Couln't find room with this ID");
        } else {
            room.players.map(p => p.id !== player.id);
            const updatedRoom = await Room.findByIdAndUpdate(room._id, {
                $set: { players: room.players }
            }, { new: true });
            res.status(200).send(updatedRoom);
        }
    } catch (error) {
        next(error);
    }
});

Router.post("/updateHighScore", async (req, res, next) => {
    try {
        const { roomId, gamePlayer } = req.body;
        let room = await Room.findById(roomId);
        if (!room) {
            return res.status(500).send("Couln't find room with this ID");
        } else {
            const { players } = room;
            const updatePlayer = players.find(p => p.name === gamePlayer.name);
            updatePlayer.highScore = gamePlayer.highScore;

            players.sort((a, b) => Number(b.highScore) - Number(a.highScore))

            let newLeader = { highScore: "0" };
            players.forEach(player => {
                if (Number(player.highScore) > Number(newLeader.highScore))
                    newLeader = player;
            })
            const updatedRoom = await Room.findByIdAndUpdate(room._id, {
                $set: { leader: newLeader, players }
            }, { new: true });
            res.status(200).send(updatedRoom);
        }
    } catch (error) {
        next(error);
    }
});

module.exports = Router;
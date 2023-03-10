import express from "express";
import { createRoom, deleteRoom, getRoom, getRooms, updateRoom, updateRoomAvailability } from "../controllers/roomController.js";
import { verifyAuth } from "../middlewares/verifyAuth.js";

const router = express.Router();
//CREATE
router.post("/:hotelid", verifyAuth, createRoom);

//UPDATE
router.put("/availability/:id", updateRoomAvailability);

router.put("/:id", verifyAuth, updateRoom);

//DELETE
router.delete("/:id/:hotelid", verifyAuth, deleteRoom);

//GET
router.get("/:id", getRoom);

//GET ALL
router.get("/", getRooms);

export default router;

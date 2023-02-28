
import express from "express";
import { countByCity, countByType, createHotel, deleteHotel, getHotel, getHotelRooms, getHotels, updateHotel } from "../controllers/hotelController.js";

import { verifyAuth } from "../middlewares/verifyAuth.js";

const router = express.Router();

//CREATE
router.post("/", verifyAuth, createHotel);

//UPDATE
router.put("/:id", verifyAuth, updateHotel);

//DELETE
router.delete("/:id", verifyAuth, deleteHotel);

//GET
router.get("/find/:id", getHotel);

//GET ALL
router.get("/", getHotels);
router.get("/countByCity", countByCity);
router.get("/countByType", countByType);
router.get("/room/:id", getHotelRooms);

export default router;

import nodemailer from "nodemailer";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

export const createRoom = async (req, res, next) => {
  
    const hotelId = req.params.hotelid;
    const newRoom = new Room(req.body);

    try {
        const savedRoom = await newRoom.save();
        try {
            await Hotel.findByIdAndUpdate(hotelId, {
                $push: { rooms: savedRoom._id },
            });
        } catch (err) {
            next(err);
        }
        res.status(200).json(savedRoom);
    } catch (err) {
        next(err);
    }
};

export const updateRoom = async (req, res, next) => {
    try {
        const updatedRoom = await Room.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedRoom);
    } catch (err) {
        next(err);
    }
};

export const updateRoomAvailability = async (req, res, next) => {

    const { bookingInfo } = req.body;

     const roomList = bookingInfo?.hotelRoomNumbers[0]?.map((item) => `<span>${item?.number}</span>`).join("");
    
    console.log(bookingInfo?.hotelRoomNumbers);
    
    try {
        await Room.updateOne(
            { "roomNumbers._id": req.params.id },
            {
                $push: {
                    "roomNumbers.$.unavailableDates": req.body.dates,
                },
            }
        );


        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL,
          to: bookingInfo?.email,
          subject: "Hotel Reservation Info",
          html: `<h1>Congratulation ${bookingInfo?.name}! You successfully reserve the room.</h1> 
          <h4>Hotel Name : ${bookingInfo?.hotelName}</h4>
          <h4>Hotel Address : ${bookingInfo?.hotelAddress}</h4>
          <h4>
            Rooms Numbers: ${roomList}
          </h4>
          <h4>Total No. of Days : ${bookingInfo?.totalDays}</h4>
          <h4>Total Price : ${bookingInfo?.totaPrice}</h4>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("Error" + error);
          } else {
            console.log("Email sent:" + info.response);
            res.status(201).json({ status: 201, info });
          }
        });


        res.status(200).json("Room status has been updated.");

    } catch (err) {
        next(err);
    }
};

export const deleteRoom = async (req, res, next) => {
    const hotelId = req.params.hotelid;
    try {
        await Room.findByIdAndDelete(req.params.id);
        try {
            await Hotel.findByIdAndUpdate(hotelId, {
                $pull: { rooms: req.params.id },
            });
        } catch (err) {
            next(err);
        }
        res.status(200).json("Room has been deleted.");
    } catch (err) {
        next(err);
    }
};

export const getRoom = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id);
        res.status(200).json(room);
    } catch (err) {
        next(err);
    }
};

export const getRooms = async (req, res, next) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (err) {
        next(err);
    }
};

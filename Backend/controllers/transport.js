import express from "express";
import Transport from "../models/Transport.js";

const router = express.Router();

// Create width
router.post("/create-transport", async (req, res, next) => {
    try {
        const transportDoc = await Transport.create(req.body);

        res.status(201).json({
            message: "Create Successfully",
            success: true,
            transportDoc,
        });
    } catch (error) {
        res.json({
            message : "transport not be empty",
            success: false,
            error: error.message,
        }).status(404);
    }
});


// Get all widths
router.get("/get-all-transport", async (req, res, next) => {
    try {
        const transports = await Transport.find({});

        res.status(200).json({
            success: true,
            transports,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Delete width
router.delete("/delete-transport/:id", async (req, res, next) => {
   
    try {
        const transportId = req.params.id;
        console.log(transportId)
     
        const transport = await Transport.findByIdAndDelete(transportId);
        if (!transport) {
            return res.status(404).json({
                success: false,
                error: "transport not found with this id",
            });
        }

        res.status(200).json({
            success: true,
            message: "transport deleted successfully!",
            transport,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Update width
router.put("/update-transport/:id", async (req, res, next) => {
    try {
        const transportId = req.params.id;

        const transport = await Transport.findByIdAndUpdate(
            transportId,
            req.body,
            { new: true } // Add this option to return the updated document
        );

        if (!transport) {
            return res.status(404).json({
                success: false,
                error: "transport not found with this id",
            });
        }

        res.status(200).json({
            success: true,
            message: "transport updated successfully!",
            transport,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

export default router;

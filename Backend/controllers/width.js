import express from "express";
import Width from "../models/WIdth.js";

const router = express.Router();

// Create width
router.post("/create-width", async (req, res, next) => {
    try {
        const widthDoc = await Width.create(req.body);

        res.status(201).json({
            message: "Create Successfully",
            success: true,
            widthDoc,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            error: error.message,
        });
    }
});


// Get all widths
router.get("/get-all-width", async (req, res, next) => {
    try {
        const widths = await Width.find({});

        res.status(200).json({
            success: true,
            widths,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Delete width
router.delete("/delete-width/:id", async (req, res, next) => {
    try {
        const widthId = req.params.id;

        const width = await Width.findByIdAndDelete(widthId);

        if (!width) {
            return res.status(404).json({
                success: false,
                error: "width not found with this id",
            });
        }

        res.status(200).json({
            success: true,
            message: "width deleted successfully!",
            width,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Update width
router.put("/update-width/:id", async (req, res, next) => {
    console.log('calleddddddddddddddddddddddddddddddddd')
    try {
        const widthId = req.params.id;

        const width = await Width.findByIdAndUpdate(widthId, req.body,{ new: true });

        if (!width) {
            return res.status(404).json({
                success: false,
                error: "width not found with this id",
            });
        }
        console.log('Updated width:', width); // Log the updated width
        res.status(200).json({
            success: true,
            message: "width updated successfully!",
            width,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

export default router;

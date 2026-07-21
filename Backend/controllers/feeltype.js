import express from "express";
import FeelType from "../models/FeelType.js";

const router = express.Router();

// Create feeltype
router.post("/create-feeltype", async (req, res, next) => {
    try {
        const feeltypeDoc = await FeelType.create(req.body);

        res.status(201).json({
            message: "Create Successfully",
            success: true,
            feeltypeDoc,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            error: error.message,
        });
    }
});


// Get all feeltypes
router.get("/get-all-feeltype", async (req, res, next) => {
    try {
        const feeltypes = await FeelType.find({});

        res.status(200).json({
            success: true,
            feeltypes,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Delete feeltype
router.delete("/delete-feeltype/:id", async (req, res, next) => {
    try {
        const feeltypeId = req.params.id;

        const feeltype = await FeelType.findByIdAndDelete(feeltypeId);

        if (!feeltype) {
            return res.status(404).json({
                success: false,
                error: "feeltype not found with this id",
            });
        }

        res.status(200).json({
            success: true,
            message: "feeltype deleted successfully!",
            feeltype,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Update feeltype
router.put("/update-feeltype/:id", async (req, res, next) => {
    try {
        const feeltypeId = req.params.id;


        const feeltype = await FeelType.findByIdAndUpdate(feeltypeId, req.body,{ new: true });

        if (!feeltype) {
            return res.status(404).json({
                success: false,
                error: "feeltype not found with this id",
            });
        }
        res.status(200).json({
            success: true,
            message: "feeltype updated successfully!",
            feeltype,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

export default router;

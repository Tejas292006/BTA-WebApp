import express from "express";
import FinishType from "../models/FinishType.js";

const router = express.Router();

// Create finishtype
router.post("/create-finishtype", async (req, res, next) => {
    try {
        const finishtypeDoc = await FinishType.create(req.body);

        res.status(201).json({
            message: "Create Successfully",
            success: true,
            finishtypeDoc,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            error: error.message,
        });
    }
});


// Get all finishtypes
router.get("/get-all-finishtype", async (req, res, next) => {
    try {
        const finishtypes = await FinishType.find({});

        res.status(200).json({
            success: true,
            finishtypes,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Delete finishtype
router.delete("/delete-finishtype/:id", async (req, res, next) => {
    try {
        const finishtypeId = req.params.id;

        const finishtype = await FinishType.findByIdAndDelete(finishtypeId);

        if (!finishtype) {
            return res.status(404).json({
                success: false,
                error: "finishtype not found with this id",
            });
        }

        res.status(200).json({
            success: true,
            message: "finishtype deleted successfully!",
            finishtype,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Update finishtype
router.put("/update-finishtype/:id", async (req, res, next) => {
    try {
        const finishtypeId = req.params.id;


        const finishtype = await FinishType.findByIdAndUpdate(finishtypeId, req.body,{ new: true });

        if (!finishtype) {
            return res.status(404).json({
                success: false,
                error: "finishtype not found with this id",
            });
        }
        res.status(200).json({
            success: true,
            message: "finishtype updated successfully!",
            finishtype,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

export default router;

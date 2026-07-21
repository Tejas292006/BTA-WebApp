import express from "express";
import Weave from "../models/Weave.js";

const router = express.Router();

// Create weave
router.post("/create-weave", async (req, res, next) => {
    try {
        const weaveDoc = await Weave.create(req.body);

        res.status(201).json({
            message: "Create Successfully",
            success: true,
            weaveDoc,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            error: error.message,
        });
    }
});


// Get all weaves
router.get("/get-all-weave", async (req, res, next) => {
    try {
        const weaves = await Weave.find({});

        res.status(200).json({
            success: true,
            weaves,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Delete weave
router.delete("/delete-weave/:id", async (req, res, next) => {
    try {
        const weaveId = req.params.id;

        const weave = await Weave.findByIdAndDelete(weaveId);

        if (!weave) {
            return res.status(404).json({
                success: false,
                error: "weave not found with this id",
            });
        }

        res.status(200).json({
            success: true,
            message: "weave deleted successfully!",
            weave,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Update weave
router.put("/update-weave/:id", async (req, res, next) => {
    try {
        const weaveId = req.params.id;
        const weave = await Weave.findByIdAndUpdate(
            weaveId,
            req.body,
            { new: true } // Add this option to return the updated document
        );
     
        if (!weave) {
            return res.status(404).json({
                success: false,
                error: "weave name not found with this id",
            });
        }

        res.json({
            success: true,
            message: "weave updated successfully!",
            weave,
        }).status(200);
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

export default router;

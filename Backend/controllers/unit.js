import express from "express";
import Unit from "../models/Unit.js";

const router = express.Router();

// Create width
router.post("/create-unit", async (req, res, next) => {
    try {
        const unitDoc = await Unit.create(req.body);

        res.status(201).json({
            message: "Create Successfully",
            success: true,
            unitDoc,
        });
    } catch (error) {
        res.json({
            message : "unit not be empty",
            success: false,
            error: error.message,
        }).status(404);
    }
});


// Get all widths
router.get("/get-all-unit", async (req, res, next) => {
    try {
        const units = await Unit.find({});

        res.status(200).json({
            success: true,
            units,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Delete width
router.delete("/delete-unit/:id", async (req, res, next) => {
   
    try {
        const unitId = req.params.id;
        console.log(unitId)
     
        const unit = await Unit.findByIdAndDelete(unitId);
        if (!unit) {
            return res.status(404).json({
                success: false,
                error: "unit not found with this id",
            });
        }

        res.status(200).json({
            success: true,
            message: "unit deleted successfully!",
            unit,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Update width
router.put("/update-unit/:id", async (req, res, next) => {
    try {
        const unitId = req.params.id;

        const unit = await Unit.findByIdAndUpdate(
            unitId,
            req.body,
            { new: true } // Add this option to return the updated document
        );

        if (!unit) {
            return res.status(404).json({
                success: false,
                error: "unit not found with this id",
            });
        }

        res.status(200).json({
            success: true,
            message: "unit updated successfully!",
            unit,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

export default router;

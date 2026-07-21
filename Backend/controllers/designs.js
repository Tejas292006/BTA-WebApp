import express from "express";
import Design from "../models/Design.js";

const router = express.Router();

// Create design
router.post("/create-design", async (req, res, next) => {
    try {
        const designDoc = await Design.create(req.body);

        res.status(201).json({
            message: "Create Successfully",
            success: true,
            designDoc,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            error: error.message,
        });
    }
});


// Get all designs
router.get("/get-all-design", async (req, res, next) => {
    try {
        const designs = await Design.find({});

        res.status(200).json({
            success: true,
            designs,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Delete design
router.delete("/delete-design/:id", async (req, res, next) => {
    try {
        const designId = req.params.id;

        const design = await Design.findByIdAndDelete(designId);

        if (!design) {
            return res.status(404).json({
                success: false,
                error: "design not found with this id",
            });
        }

        res.status(200).json({
            success: true,
            message: "design deleted successfully!",
            design,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Update design
router.put("/update-design/:id", async (req, res, next) => {
    try {
        const designId = req.params.id;


        const design = await Design.findByIdAndUpdate(designId, req.body,{ new: true });

        if (!design) {
            return res.status(404).json({
                success: false,
                error: "design not found with this id",
            });
        }
        res.status(200).json({
            success: true,
            message: "design updated successfully!",
            design,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

export default router;

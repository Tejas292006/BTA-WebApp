import express from "express";
import Cut from "../models/Cut.js";

const router = express.Router();

// Create width
router.post("/create-cut", async (req, res, next) => {
    try {
        const cutDoc = new Cut(req.body);
        await cutDoc.save();
        console.log(req.body, 'hiiiiiiiiiiiiiiiii')
        res.status(201).json({
            message: "Create Successfully",
            success: true,
            cutDoc,
        });
    } catch (error) {
        res.status(404).json({
            message: "cut name not be empty",
            success: false,
            error: error.message,
        });
    }
});


// Get all widths
router.get("/get-all-cuts", async (req, res, next) => {
    try {
        const cuts = await Cut.find({}).populate('ref');;

        res.status(200).json({
            success: true,
            cuts,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Delete width
router.delete("/delete-cut/:id", async (req, res, next) => {
   
    try {
        const cutId = req.params.id;
        console.log(cutId)
     
        const cut = await Cut.findByIdAndDelete(cutId);
        if (!cut) {
            return res.status(404).json({
                success: false,
                error: "cut not found with this id",
            });
        }

        res.status(200).json({
            success: true,
            message: "cut deleted successfully!",
            cut,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Update width
router.put("/update-cut/:id", async (req, res, next) => {
    try {
        const cutId = req.params.id;
        
        const cut = await Cut.findByIdAndUpdate(
            cutId,
            req.body,
            { new: true } // Add this option to return the updated document
        );

        if (!cut) {
            return res.status(404).json({
                success: false,
                error: "cutname not found with this id",
            });
        }

        res.status(200).json({
            success: true,
            message: "cut updated successfully!",
            cut,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

export default router;

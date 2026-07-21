import express from "express";
import Attribute from "../models/Attribute.js";

const router = express.Router();

// Create width
router.post("/create-attribute", async (req, res, next) => {
    try {
        const attributeDoc = await Attribute.create(req.body);

        res.status(201).json({
            message: "Create Successfully",
            success: true,
            attributeDoc,
        });
    } catch (error) {
        res.json({
            message : "attribute not be empty",
            success: false,
            error: error.message,
        }).status(404);
    }
});


// Get all widths
router.get("/get-all-attribute", async (req, res, next) => {
    try {
        const attributes = await Attribute.find({});

        res.status(200).json({
            success: true,
            attributes,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Delete width
router.delete("/delete-attribute/:id", async (req, res, next) => {
   
    try {
        const attributeId = req.params.id;
        console.log(attributeId)
     
        const attribute = await Attribute.findByIdAndDelete(attributeId);
        if (!attribute) {
            return res.status(404).json({
                success: false,
                error: "attribute not found with this id",
            });
        }

        res.status(200).json({
            success: true,
            message: "attribute deleted successfully!",
            attribute,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Update width
router.put("/update-attribute/:id", async (req, res, next) => {
    try {
        const attributeId = req.params.id;

        const attribute = await Attribute.findByIdAndUpdate(
            attributeId,
            req.body,
            { new: true } // Add this option to return the updated document
        );

        if (!attribute) {
            return res.status(404).json({
                success: false,
                error: "attribute not found with this id",
            });
        }

        res.status(200).json({
            success: true,
            message: "attribute updated successfully!",
            attribute,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

export default router;

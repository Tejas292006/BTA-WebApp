import express from "express";
import AttributeValue from "../models/AttributeValue.js";

const router = express.Router();

// Create attributeValue
router.post("/create-attributeValue", async (req, res, next) => {
    try {
        console.log(req.body)
        const attributeValueDoc = await AttributeValue.create(req.body)

        res.status(201).json({
            message: "Create Successfully",
            success: true,
            attributeValueDoc,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            error: error.message,
        });
    }
});


// Get all attributeValues
router.get("/get-all-attributeValue", async (req, res, next) => {
    try {
        const attributeValues = await AttributeValue.find({}).populate('attributeRef');
        
        res.json({
            success: true,
            attributeValues,
        }).status(200);
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});
// Delete attributeValue
router.delete("/delete-attributeValue/:id", async (req, res, next) => {
    try {
        const attributeValueId = req.params.id;

        const attributeValue = await AttributeValue.findByIdAndDelete(attributeValueId);

        if (!attributeValue) {
            return res.status(404).json({
                success: false,
                error: "attributeValue not found with this id",
            });
        }

        res.status(200).json({
            success: true,
            message: "attributeValue deleted successfully!",
            attributeValue,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Update attributeValue
router.put("/update-attributeValue/:id", async (req, res, next) => {
    try {
        const attributeValueId = req.params.id;


        const attributeValue = await AttributeValue.findByIdAndUpdate(attributeValueId, req.body,{ new: true });

        if (!attributeValue) {
            return res.status(404).json({
                success: false,
                error: "attributeValue not found with this id",
            });
        }
        res.status(200).json({
            success: true,
            message: "attributeValue updated successfully!",
            attributeValue,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

export default router;

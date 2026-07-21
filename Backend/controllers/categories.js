import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

// Create category
router.post("/create-category", async (req, res, next) => {
    try {
        const categoryDoc = await Category.create(req.body);

        res.status(201).json({
            message: "Create Successfully",
            success: true,
            categoryDoc,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            error: error.message,
        });
    }
});


// Get all categorys
router.get("/get-all-category", async (req, res, next) => {
    try {
        const categories = await Category.find({});

        res.status(200).json({
            success: true,
            categories,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Delete category
router.delete("/delete-category/:id", async (req, res, next) => {
    try {
        const categoryId = req.params.id;

        const category = await Category.findByIdAndDelete(categoryId);

        if (!category) {
            return res.status(404).json({
                success: false,
                error: "category not found with this id",
            });
        }

        res.status(200).json({
            success: true,
            message: "category deleted successfully!",
            category,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Update category
router.put("/update-category/:id", async (req, res, next) => {
    try {
        const categoryId = req.params.id;


        const category = await Category.findByIdAndUpdate(categoryId, req.body,{ new: true });

        if (!category) {
            return res.status(404).json({
                success: false,
                error: "category not found with this id",
            });
        }
        res.status(200).json({
            success: true,
            message: "category updated successfully!",
            category,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

export default router;

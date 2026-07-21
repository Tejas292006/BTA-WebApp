import express from "express";
import prisma from "../configs/prismaClient.js";

const router = express.Router();

// Create category
router.post("/create-category", async (req, res) => {
    try {
        const { name, verified } = req.body;
        const category = await prisma.category.create({
            data: { name, verified: verified ?? false },
        });
        res.status(201).json({ message: "Created Successfully", success: true, category });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get all categories
router.get("/get-all-category", async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({ success: true, categories });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete category
router.delete("/delete-category/:id", async (req, res) => {
    try {
        const category = await prisma.category.delete({
            where: { id: req.params.id },
        });
        res.status(200).json({ success: true, message: "Category deleted successfully!", category });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update category
router.put("/update-category/:id", async (req, res) => {
    try {
        const { name, verified } = req.body;
        const category = await prisma.category.update({
            where: { id: req.params.id },
            data: { name, verified },
        });
        res.status(200).json({ success: true, message: "Category updated successfully!", category });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;

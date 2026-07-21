import express from "express";
import prisma from "../configs/prismaClient.js";

const router = express.Router();

// Create quality
router.post("/create-quality", async (req, res) => {
    try {
        const { name, categoryId, verified } = req.body;
        const quality = await prisma.quality.create({
            data: { name, categoryId: categoryId || null, verified: verified ?? false },
        });
        res.status(201).json({ message: "Created Successfully", success: true, quality });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get all qualities
router.get("/get-all-quality", async (req, res) => {
    try {
        const qualities = await prisma.quality.findMany({
            include: { category: true },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({ success: true, qualities });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete quality
router.delete("/delete-quality/:id", async (req, res) => {
    try {
        const quality = await prisma.quality.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: "Quality deleted successfully!", quality });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update quality
router.put("/update-quality/:id", async (req, res) => {
    try {
        const { name, categoryId, verified } = req.body;
        const quality = await prisma.quality.update({
            where: { id: req.params.id },
            data: { name, categoryId: categoryId || null, verified },
        });
        res.status(200).json({ success: true, message: "Quality updated successfully!", quality });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;

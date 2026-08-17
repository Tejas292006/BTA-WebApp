import express from "express";
import prisma from "../configs/prismaClient.js";

const router = express.Router();

// Create width
router.post("/create-width", async (req, res) => {
    try {
        const { name, categoryId, verified } = req.body;
        const width = await prisma.width.create({
            data: { name, categoryId: categoryId || null, verified: verified ?? false },
        });
        res.status(201).json({ message: "Created Successfully", success: true, width, widthDoc: width });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get all widths
router.get("/get-all-width", async (req, res) => {
    try {
        const widths = await prisma.width.findMany({
            include: { category: true },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({ success: true, widths });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete width
router.delete("/delete-width/:id", async (req, res) => {
    try {
        const width = await prisma.width.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: "Width deleted successfully!", width });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update width
router.put("/update-width/:id", async (req, res) => {
    try {
        const { name, categoryId, verified } = req.body;
        const width = await prisma.width.update({
            where: { id: req.params.id },
            data: { name, categoryId: categoryId || null, verified },
        });
        res.status(200).json({ success: true, message: "Width updated successfully!", width, widthDoc: width });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;

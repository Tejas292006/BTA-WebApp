import express from "express";
import prisma from "../configs/prismaClient.js";

const router = express.Router();

// Create weave
router.post("/create-weave", async (req, res) => {
    try {
        const { name, categoryId, verified } = req.body;
        const weave = await prisma.weave.create({
            data: { name, categoryId: categoryId || null, verified: verified ?? false },
        });
        res.status(201).json({ message: "Created Successfully", success: true, weave });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get all weaves
router.get("/get-all-weave", async (req, res) => {
    try {
        const weaves = await prisma.weave.findMany({
            include: { category: true },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({ success: true, weaves });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete weave
router.delete("/delete-weave/:id", async (req, res) => {
    try {
        const weave = await prisma.weave.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: "Weave deleted successfully!", weave });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update weave
router.put("/update-weave/:id", async (req, res) => {
    try {
        const { name, categoryId, verified } = req.body;
        const weave = await prisma.weave.update({
            where: { id: req.params.id },
            data: { name, categoryId: categoryId || null, verified },
        });
        res.status(200).json({ success: true, message: "Weave updated successfully!", weave });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;

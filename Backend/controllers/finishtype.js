import express from "express";
import prisma from "../configs/prismaClient.js";

const router = express.Router();

// Create finishtype
router.post("/create-finishtype", async (req, res) => {
    try {
        const { name, categoryId, verified } = req.body;
        const finishtype = await prisma.finishType.create({
            data: { name, categoryId: categoryId || null, verified: verified ?? false },
        });
        res.status(201).json({ message: "Created Successfully", success: true, finishtype, finishtypeDoc: finishtype });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get all finishtypes
router.get("/get-all-finishtype", async (req, res) => {
    try {
        const finishtypes = await prisma.finishType.findMany({
            include: { category: true },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({ success: true, finishtypes });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete finishtype
router.delete("/delete-finishtype/:id", async (req, res) => {
    try {
        const finishtype = await prisma.finishType.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: "FinishType deleted successfully!", finishtype });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update finishtype
router.put("/update-finishtype/:id", async (req, res) => {
    try {
        const { name, categoryId, verified } = req.body;
        const finishtype = await prisma.finishType.update({
            where: { id: req.params.id },
            data: { name, categoryId: categoryId || null, verified },
        });
        res.status(200).json({ success: true, message: "FinishType updated successfully!", finishtype, finishtypeDoc: finishtype });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;

import express from "express";
import prisma from "../configs/prismaClient.js";

const router = express.Router();

// Create feeltype
router.post("/create-feeltype", async (req, res) => {
    try {
        const { name, categoryId, verified } = req.body;
        const feeltype = await prisma.feelType.create({
            data: { name, categoryId: categoryId || null, verified: verified ?? false },
        });
        res.status(201).json({ message: "Created Successfully", success: true, feeltype, feeltypeDoc: feeltype });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get all feeltypes
router.get("/get-all-feeltype", async (req, res) => {
    try {
        const feeltypes = await prisma.feelType.findMany({
            include: { category: true },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({ success: true, feeltypes });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete feeltype
router.delete("/delete-feeltype/:id", async (req, res) => {
    try {
        const feeltype = await prisma.feelType.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: "FeelType deleted successfully!", feeltype });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update feeltype
router.put("/update-feeltype/:id", async (req, res) => {
    try {
        const { name, categoryId, verified } = req.body;
        const feeltype = await prisma.feelType.update({
            where: { id: req.params.id },
            data: { name, categoryId: categoryId || null, verified },
        });
        res.status(200).json({ success: true, message: "FeelType updated successfully!", feeltype, feeltypeDoc: feeltype });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;

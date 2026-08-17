import express from "express";
import prisma from "../configs/prismaClient.js";

const router = express.Router();

// Create cut
router.post("/create-cut", async (req, res) => {
    try {
        const { name, categoryId, isNameNumerical } = req.body;
        const cut = await prisma.cut.create({
            data: {
                name,
                categoryId: categoryId || null,
                isNameNumerical: isNameNumerical ?? false,
            },
        });
        res.status(201).json({ message: "Created Successfully", success: true, cut, cutDoc: cut });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get all cuts
router.get("/get-all-cut", async (req, res) => {
    try {
        const cuts = await prisma.cut.findMany({
            include: { category: true },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({ success: true, cuts });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete cut
router.delete("/delete-cut/:id", async (req, res) => {
    try {
        const cut = await prisma.cut.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: "Cut deleted successfully!", cut });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update cut
router.put("/update-cut/:id", async (req, res) => {
    try {
        const { name, categoryId, isNameNumerical } = req.body;
        const cut = await prisma.cut.update({
            where: { id: req.params.id },
            data: { name, categoryId: categoryId || null, isNameNumerical },
        });
        res.status(200).json({ success: true, message: "Cut updated successfully!", cut, cutDoc: cut });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;

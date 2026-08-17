import express from "express";
import prisma from "../configs/prismaClient.js";

const router = express.Router();

// Create unit
router.post("/create-unit", async (req, res) => {
    try {
        const { name, verified } = req.body;
        const unit = await prisma.unit.create({
            data: { name, verified: verified ?? false },
        });
        res.status(201).json({ message: "Created Successfully", success: true, unit, unitDoc: unit });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get all units
router.get("/get-all-unit", async (req, res) => {
    try {
        const units = await prisma.unit.findMany({ orderBy: { createdAt: "desc" } });
        res.status(200).json({ success: true, units });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete unit
router.delete("/delete-unit/:id", async (req, res) => {
    try {
        const unit = await prisma.unit.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: "Unit deleted successfully!", unit });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update unit
router.put("/update-unit/:id", async (req, res) => {
    try {
        const { name, verified } = req.body;
        const unit = await prisma.unit.update({
            where: { id: req.params.id },
            data: { name, verified },
        });
        res.status(200).json({ success: true, message: "Unit updated successfully!", unit, unitDoc: unit });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;

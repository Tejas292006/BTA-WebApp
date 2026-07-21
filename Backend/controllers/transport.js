import express from "express";
import prisma from "../configs/prismaClient.js";

const router = express.Router();

// Create transport
router.post("/create-transport", async (req, res) => {
    try {
        const { name, verified } = req.body;
        if (!name || name.trim().length === 0) {
            return res.status(400).json({ success: false, error: "Transport name cannot be empty" });
        }
        const transport = await prisma.transport.create({
            data: { name: name.trim(), verified: verified ?? false },
        });
        res.status(201).json({ message: "Created Successfully", success: true, transport });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get all transports
router.get("/get-all-transport", async (req, res) => {
    try {
        const transports = await prisma.transport.findMany({ orderBy: { createdAt: "desc" } });
        res.status(200).json({ success: true, transports });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete transport
router.delete("/delete-transport/:id", async (req, res) => {
    try {
        const transport = await prisma.transport.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: "Transport deleted successfully!", transport });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update transport
router.put("/update-transport/:id", async (req, res) => {
    try {
        const { name, verified } = req.body;
        const transport = await prisma.transport.update({
            where: { id: req.params.id },
            data: { name, verified },
        });
        res.status(200).json({ success: true, message: "Transport updated successfully!", transport });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;

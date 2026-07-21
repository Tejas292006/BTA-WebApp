import express from "express";
import prisma from "../configs/prismaClient.js";

const router = express.Router();

// Create attribute
router.post("/create-attribute", async (req, res) => {
    try {
        const { name, verified } = req.body;
        if (!name || name.trim().length === 0) {
            return res.status(400).json({ success: false, error: "Attribute name cannot be empty" });
        }
        const attribute = await prisma.attribute.create({
            data: { name: name.trim(), verified: verified ?? false },
        });
        res.status(201).json({ message: "Created Successfully", success: true, attribute });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get all attributes
router.get("/get-all-attribute", async (req, res) => {
    try {
        const attributes = await prisma.attribute.findMany({ orderBy: { createdAt: "desc" } });
        res.status(200).json({ success: true, attributes });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete attribute
router.delete("/delete-attribute/:id", async (req, res) => {
    try {
        const attribute = await prisma.attribute.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: "Attribute deleted successfully!", attribute });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update attribute
router.put("/update-attribute/:id", async (req, res) => {
    try {
        const { name, verified } = req.body;
        const attribute = await prisma.attribute.update({
            where: { id: req.params.id },
            data: { name, verified },
        });
        res.status(200).json({ success: true, message: "Attribute updated successfully!", attribute });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;

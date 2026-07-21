import express from "express";
import prisma from "../configs/prismaClient.js";

const router = express.Router();

// Create attributeValue
router.post("/create-attributevalue", async (req, res) => {
    try {
        const { attributeId, valuesCombo, verified } = req.body;
        const attributeValue = await prisma.attributeValue.create({
            data: {
                attributeId: attributeId || null,
                valuesCombo: valuesCombo ?? [],
                verified: verified ?? false,
            },
        });
        res.status(201).json({ message: "Created Successfully", success: true, attributeValue });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get all attributeValues
router.get("/get-all-attributevalue", async (req, res) => {
    try {
        const attributeValues = await prisma.attributeValue.findMany({
            include: { attribute: true },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({ success: true, attributeValues });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete attributeValue
router.delete("/delete-attributevalue/:id", async (req, res) => {
    try {
        const attributeValue = await prisma.attributeValue.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: "AttributeValue deleted successfully!", attributeValue });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update attributeValue
router.put("/update-attributevalue/:id", async (req, res) => {
    try {
        const { attributeId, valuesCombo, verified } = req.body;
        const attributeValue = await prisma.attributeValue.update({
            where: { id: req.params.id },
            data: { attributeId: attributeId || null, valuesCombo, verified },
        });
        res.status(200).json({ success: true, message: "AttributeValue updated successfully!", attributeValue });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;

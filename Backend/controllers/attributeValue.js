import express from "express";
import prisma from "../configs/prismaClient.js";

const router = express.Router();

// Create attributeValue
router.post("/create-attributevalue", async (req, res) => {
    try {
        const { attributeId, attributeRef, valuesCombo, verified } = req.body;
        const attributeValue = await prisma.attributeValue.create({
            data: {
                attributeId: attributeId || attributeRef || null,
                valuesCombo: valuesCombo ?? [],
                verified: verified ?? false,
            },
            include: { attribute: true },
        });
        res.status(201).json({ message: "Created Successfully", success: true, attributeValue, attributeValueDoc: attributeValue });
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
        res.status(200).json({ success: true, message: "AttributeValue deleted successfully!", attributeValue, attributeValueDoc: attributeValue });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update attributeValue
router.put("/update-attributevalue/:id", async (req, res) => {
    try {
        const { attributeId, attributeRef, valuesCombo, verified } = req.body;
        const attributeValue = await prisma.attributeValue.update({
            where: { id: req.params.id },
            data: { attributeId: attributeId || attributeRef || null, valuesCombo, verified },
            include: { attribute: true },
        });
        res.status(200).json({ success: true, message: "AttributeValue updated successfully!", attributeValue, attributeValueDoc: attributeValue });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;

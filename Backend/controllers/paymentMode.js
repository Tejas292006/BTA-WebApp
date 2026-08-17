import express from "express";
import prisma from "../configs/prismaClient.js";

const router = express.Router();

// Create paymentMode
router.post("/create-paymentmode", async (req, res) => {
    try {
        const { name, verified } = req.body;
        if (!name || name.trim().length === 0) {
            return res.status(400).json({ success: false, error: "PaymentMode name cannot be empty" });
        }
        const paymentMode = await prisma.paymentMode.create({
            data: { name: name.trim(), verified: verified ?? false },
        });
        res.status(201).json({ message: "Created Successfully", success: true, paymentMode, paymentmodeDoc: paymentMode });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get all paymentModes
router.get("/get-all-paymentmode", async (req, res) => {
    try {
        const paymentModes = await prisma.paymentMode.findMany({ orderBy: { createdAt: "desc" } });
        res.status(200).json({ success: true, paymentModes });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete paymentMode
router.delete("/delete-paymentmode/:id", async (req, res) => {
    try {
        const paymentMode = await prisma.paymentMode.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: "PaymentMode deleted successfully!", paymentMode });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update paymentMode
router.put("/update-paymentmode/:id", async (req, res) => {
    try {
        const { name, verified } = req.body;
        const paymentMode = await prisma.paymentMode.update({
            where: { id: req.params.id },
            data: { name, verified },
        });
        res.status(200).json({ success: true, message: "PaymentMode updated successfully!", paymentMode, paymentmodeDoc: paymentMode });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;

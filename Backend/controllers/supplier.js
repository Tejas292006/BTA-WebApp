import express from "express";
import prisma from "../configs/prismaClient.js";

const router = express.Router();

// Create supplier
router.post("/create-supplier", async (req, res) => {
    try {
        const { name, brand, address, experienced, verified, avatar } = req.body;
        const supplierDoc = await prisma.supplier.create({
            data: {
                name,
                brand: brand || null,
                address: address || null,
                experienced: experienced ?? false,
                verified: verified ?? false,
                avatar: avatar || undefined,
            },
        });
        res.status(201).json({ message: "Created Successfully", success: true, supplierDoc });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get all suppliers
router.get("/get-all-supplier", async (req, res) => {
    try {
        const suppliers = await prisma.supplier.findMany({ orderBy: { createdAt: "desc" } });
        res.status(200).json({ success: true, suppliers });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete supplier
router.delete("/delete-supplier/:id", async (req, res) => {
    try {
        const supplier = await prisma.supplier.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: "Supplier deleted successfully!", supplier });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update supplier
router.put("/update-supplier/:id", async (req, res) => {
    try {
        const { name, brand, address, experienced, verified, avatar } = req.body;
        const supplier = await prisma.supplier.update({
            where: { id: req.params.id },
            data: { name, brand, address, experienced, verified, avatar },
        });
        res.status(200).json({ success: true, message: "Supplier updated successfully!", supplier });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;

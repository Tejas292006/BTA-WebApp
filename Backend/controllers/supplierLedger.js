import express from "express";
import prisma from "../configs/prismaClient.js";

const router = express.Router();

// Get all supplier ledger entries (optionally filter by supplierId)
router.get("/get-supplier-ledger", async (req, res) => {
    try {
        const { supplierId } = req.query;
        const supplierLedgers = await prisma.supplierLedger.findMany({
            where: supplierId ? { supplierId } : {},
            include: { supplier: true, invoice: true, payment: true },
            orderBy: { createdAt: "asc" },
        });
        res.status(200).json({ success: true, supplierLedgers });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;

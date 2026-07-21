import express from "express";
import prisma from "../configs/prismaClient.js";

const router = express.Router();

// Get all customer ledger entries (optionally filter by customerId)
router.get("/get-customer-ledger", async (req, res) => {
    try {
        const { customerId } = req.query;
        const customerLedgers = await prisma.customerLedger.findMany({
            where: customerId ? { customerId } : {},
            include: { customer: true, invoice: true, payment: true },
            orderBy: { createdAt: "asc" },
        });
        res.status(200).json({ success: true, customerLedgers });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;

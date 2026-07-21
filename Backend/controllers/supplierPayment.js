import express from "express";
import { v4 as uuidv4 } from 'uuid';
import prisma from "../configs/prismaClient.js";

const router = express.Router();

// Create supplier payment (also creates supplier ledger entries)
router.post("/create-supplierpayment", async (req, res) => {
    try {
        const {
            adjustments,
            customerRef,
            supplierRef,
            newReference,
            paymentDate,
            amountEntered,
            paymentMode,
            chequeNumber,
        } = req.body;

        const supplierpaymentDoc = await prisma.supplierPayment.create({
            data: {
                customerId: customerRef,
                supplierId: supplierRef,
                paymentDate: new Date(paymentDate),
                amountEntered,
                paymentMode,
                chequeNumber: chequeNumber || null,
                adjustments: adjustments ?? [],
                newReference: newReference || null,
            },
        });

        for (const adjustment of adjustments) {
            const { invoiceId, adjust } = adjustment;
            await prisma.supplierLedger.create({
                data: {
                    supplierId: supplierRef,
                    paymentId: supplierpaymentDoc.id,
                    invoiceId: invoiceId || null,
                    amount: adjust,
                    transactionType: 'payment',
                    debit: adjust,
                    credit: 0,
                    balance: -adjust,
                },
            });
        }

        if (newReference && newReference.adjust > 0) {
            await prisma.supplierLedger.create({
                data: {
                    supplierId: supplierRef,
                    paymentId: supplierpaymentDoc.id,
                    amount: newReference.adjust,
                    transactionType: 'payment',
                    debit: newReference.adjust,
                    credit: 0,
                    balance: -newReference.adjust,
                },
            });
        }

        res.status(201).json({ message: "Created Successfully", success: true, supplierpaymentDoc });
    } catch (error) {
        res.status(400).json({ message: "Error creating supplier payment", success: false, error: error.message });
    }
});

// Get all supplier payments
router.get("/get-all-supplierpayments", async (req, res) => {
    try {
        const supplierpayments = await prisma.supplierPayment.findMany({
            include: { customer: true, supplier: true },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({ success: true, supplierpayments });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete supplier payment
router.delete("/delete-supplierpayment/:id", async (req, res) => {
    try {
        const supplierpayment = await prisma.supplierPayment.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: "Supplier payment deleted successfully!", supplierpayment });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update supplier payment
router.put("/update-supplierpayment/:id", async (req, res) => {
    try {
        const {
            customerRef,
            supplierRef,
            paymentDate,
            amountEntered,
            paymentMode,
            chequeNumber,
            adjustments,
            newReference,
        } = req.body;

        const supplierpayment = await prisma.supplierPayment.update({
            where: { id: req.params.id },
            data: {
                customerId: customerRef,
                supplierId: supplierRef,
                paymentDate: paymentDate ? new Date(paymentDate) : undefined,
                amountEntered,
                paymentMode,
                chequeNumber,
                adjustments,
                newReference,
            },
        });
        res.status(200).json({ success: true, message: "Supplier payment updated successfully!", supplierpayment });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;

import express from "express";
import { v4 as uuidv4 } from 'uuid';
import prisma from "../configs/prismaClient.js";

const router = express.Router();

// Create customer payment (also creates ledger entries)
router.post("/create-customerpayment", async (req, res) => {
    try {
        const {
            whomToPay,
            adjustments,
            customerRef,
            supplierRef,
            newReference,
            paymentDate,
            amountEntered,
            paymentMode,
            chequeNumber,
        } = req.body;

        const customerpaymentDoc = await prisma.customerPayment.create({
            data: {
                customerId: customerRef,
                supplierId: supplierRef,
                paymentDate: new Date(paymentDate),
                amountEntered,
                paymentMode,
                whomToPay,
                chequeNumber: chequeNumber || null,
                adjustments: adjustments ?? [],
                newReference: newReference || null,
            },
        });

        if (whomToPay === 'supplier') {
            for (const adjustment of adjustments) {
                const { invoiceId, adjust } = adjustment;

                await prisma.customerLedger.create({
                    data: {
                        customerId: customerRef,
                        paymentId: customerpaymentDoc.id,
                        invoiceId: invoiceId || null,
                        amount: adjust,
                        transactionType: 'payment',
                        credit: adjust,
                        debit: 0,
                        balance: adjust,
                    },
                });

                await prisma.supplierLedger.create({
                    data: {
                        supplierId: supplierRef,
                        paymentId: customerpaymentDoc.id,
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
                const uniqueRef = uuidv4();
                await prisma.customerLedger.create({
                    data: {
                        customerId: customerRef,
                        paymentId: customerpaymentDoc.id,
                        advancePaymentRef: uniqueRef,
                        amount: newReference.adjust,
                        transactionType: 'payment',
                        credit: newReference.adjust,
                        debit: 0,
                        balance: newReference.adjust,
                    },
                });
                await prisma.supplierLedger.create({
                    data: {
                        supplierId: supplierRef,
                        paymentId: customerpaymentDoc.id,
                        amount: newReference.adjust,
                        transactionType: 'payment',
                        debit: newReference.adjust,
                        credit: 0,
                        balance: -newReference.adjust,
                    },
                });
            }
        } else if (whomToPay === 'self') {
            for (const adjustment of adjustments) {
                const { invoiceId, adjust } = adjustment;
                await prisma.customerLedger.create({
                    data: {
                        customerId: customerRef,
                        paymentId: customerpaymentDoc.id,
                        invoiceId: invoiceId || null,
                        amount: adjust,
                        transactionType: 'payment',
                        credit: adjust,
                        debit: 0,
                        balance: adjust,
                    },
                });
            }

            if (newReference && newReference.adjust > 0) {
                const uniqueRef = uuidv4();
                await prisma.customerLedger.create({
                    data: {
                        customerId: customerRef,
                        paymentId: customerpaymentDoc.id,
                        advancePaymentRef: uniqueRef,
                        amount: newReference.adjust,
                        transactionType: 'payment',
                        credit: newReference.adjust,
                        debit: 0,
                        balance: newReference.adjust,
                    },
                });
            }
        }

        res.status(201).json({ message: "Created Successfully", success: true, customerpaymentDoc });
    } catch (error) {
        res.status(400).json({ message: "Error creating customer payment", success: false, error: error.message });
    }
});

// Get all customer payments
router.get("/get-all-customerpayments", async (req, res) => {
    try {
        const customerpayments = await prisma.customerPayment.findMany({
            include: { customer: true, supplier: true },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({ success: true, customerpayments });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete customer payment
router.delete("/delete-customerpayment/:id", async (req, res) => {
    try {
        const customerpayment = await prisma.customerPayment.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: "Customer payment deleted successfully!", customerpayment });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update customer payment
router.put("/update-customerpayment/:id", async (req, res) => {
    try {
        const {
            customerRef,
            supplierRef,
            paymentDate,
            amountEntered,
            paymentMode,
            whomToPay,
            chequeNumber,
            adjustments,
            newReference,
        } = req.body;

        const customerpayment = await prisma.customerPayment.update({
            where: { id: req.params.id },
            data: {
                customerId: customerRef,
                supplierId: supplierRef,
                paymentDate: paymentDate ? new Date(paymentDate) : undefined,
                amountEntered,
                paymentMode,
                whomToPay,
                chequeNumber,
                adjustments,
                newReference,
            },
        });
        res.status(200).json({ success: true, message: "Customer payment updated successfully!", customerpayment });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;

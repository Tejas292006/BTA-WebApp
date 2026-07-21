import express from "express";
import prisma from "../configs/prismaClient.js";

const router = express.Router();

// Create invoice (also creates customer & supplier ledger entries)
router.post("/create-invoice", async (req, res) => {
    try {
        const {
            challanRefs,
            supplierId,
            customerId,
            products,
            grandTotal,
            discount,
            gst,
            otherExpenses,
            totalBillingAmount,
            currentTotal,
            isCleared,
            isPaidToSupplier,
            invoiceDate,
            invoiceNo,
            balance,
        } = req.body;

        const invoiceDoc = await prisma.invoice.create({
            data: {
                challanRefs: challanRefs ?? [],
                supplierId: supplierId || null,
                customerId: customerId || null,
                products: products ?? [],
                grandTotal: grandTotal ?? null,
                discount: discount ?? null,
                gst: gst ?? null,
                otherExpenses: otherExpenses ?? null,
                totalBillingAmount: totalBillingAmount ?? null,
                currentTotal: currentTotal ?? null,
                isCleared: isCleared ?? false,
                isPaidToSupplier: isPaidToSupplier ?? false,
                invoiceDate: invoiceDate || null,
                invoiceNo: invoiceNo || null,
                balance: balance ?? 0,
            },
        });

        // Create customer ledger entry
        if (customerId) {
            await prisma.customerLedger.create({
                data: {
                    customerId,
                    invoiceId: invoiceDoc.id,
                    transactionType: 'invoice',
                    amount: grandTotal || 0,
                    debit: grandTotal || 0,
                    credit: 0,
                    balance: -(grandTotal || 0),
                },
            });
        }

        // Create supplier ledger entry
        if (supplierId) {
            await prisma.supplierLedger.create({
                data: {
                    supplierId,
                    invoiceId: invoiceDoc.id,
                    transactionType: 'invoice',
                    amount: grandTotal || 0,
                    credit: grandTotal || 0,
                    debit: 0,
                    balance: grandTotal || 0,
                },
            });
        }

        res.status(201).json({ message: "Created Successfully", success: true, invoiceDoc });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get single invoice by ID
router.get("/get-invoice/:id", async (req, res) => {
    try {
        const invoice = await prisma.invoice.findUnique({
            where: { id: req.params.id },
            include: { supplier: true, customer: true },
        });
        if (!invoice) {
            return res.status(404).json({ success: false, error: "Invoice not found with this ID" });
        }
        res.status(200).json({ success: true, invoice });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get all invoices
router.get("/get-all-invoice", async (req, res) => {
    try {
        const invoices = await prisma.invoice.findMany({
            include: { supplier: true, customer: true },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({ success: true, invoices });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Process customer payment — update invoice currentTotal/isCleared
router.post("/process-payment", async (req, res) => {
    try {
        const { invoiceAdjustments } = req.body;

        const updatedInvoices = await Promise.all(
            invoiceAdjustments.map(async ({ invoiceId, remainingAmount }) => {
                const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
                if (!invoice) throw new Error(`Invoice not found: ${invoiceId}`);

                const newCurrentTotal = Math.max(remainingAmount, 0);
                return prisma.invoice.update({
                    where: { id: invoiceId },
                    data: {
                        currentTotal: newCurrentTotal,
                        isCleared: newCurrentTotal === 0,
                    },
                });
            })
        );

        res.status(200).json({ success: true, message: "Invoices updated successfully!", updatedInvoices });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Process supplier payment — update invoice currentTotal/isPaidToSupplier
router.post("/process-supplier-payment", async (req, res) => {
    try {
        const { invoiceAdjustments } = req.body;

        const updatedInvoices = await Promise.all(
            invoiceAdjustments.map(async ({ invoiceId, remainingAmount }) => {
                const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
                if (!invoice) throw new Error(`Invoice not found: ${invoiceId}`);

                const newCurrentTotal = Math.max(remainingAmount, 0);
                return prisma.invoice.update({
                    where: { id: invoiceId },
                    data: {
                        currentTotal: newCurrentTotal,
                        isPaidToSupplier: newCurrentTotal === 0,
                    },
                });
            })
        );

        res.status(200).json({ success: true, message: "Invoices updated successfully!", updatedInvoices });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete invoice
router.delete("/delete-invoice/:id", async (req, res) => {
    try {
        const invoice = await prisma.invoice.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: "Invoice deleted successfully!", invoice });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update invoice
router.put("/update-invoice/:id", async (req, res) => {
    try {
        const {
            challanRefs,
            supplierId,
            customerId,
            products,
            grandTotal,
            discount,
            gst,
            otherExpenses,
            totalBillingAmount,
            currentTotal,
            isCleared,
            isPaidToSupplier,
            invoiceDate,
            invoiceNo,
            balance,
        } = req.body;

        const invoice = await prisma.invoice.update({
            where: { id: req.params.id },
            data: {
                challanRefs,
                supplierId: supplierId || null,
                customerId: customerId || null,
                products,
                grandTotal,
                discount,
                gst,
                otherExpenses,
                totalBillingAmount,
                currentTotal,
                isCleared,
                isPaidToSupplier,
                invoiceDate,
                invoiceNo,
                balance,
            },
        });

        res.status(200).json({ success: true, message: "Invoice updated successfully!", invoice });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;

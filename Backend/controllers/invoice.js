import express from "express";
import prisma from "../configs/prismaClient.js";

const router = express.Router();

// Helper to extract clean string ID or null
const toCleanId = (val) => {
    if (!val) return null;
    if (typeof val === "object") return val.id || null;
    if (typeof val === "string") {
        const trimmed = val.trim();
        return trimmed.length > 0 ? trimmed : null;
    }
    return String(val);
};

// Create invoice (also creates customer & supplier ledger entries)
router.post("/create-invoice", async (req, res) => {
    try {
        const {
            challanRefs: challanRefsBody,
            supplierId: supplierIdBody,
            customerId: customerIdBody,
            supplierRef,
            customerRef,
            challanRef,
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

        const rawChallanRefs = challanRefsBody || challanRef || [];
        const challanRefs = Array.isArray(rawChallanRefs)
            ? rawChallanRefs.map(r => typeof r === "object" ? r?.id : r).filter(Boolean)
            : (rawChallanRefs ? [typeof rawChallanRefs === "object" ? rawChallanRefs?.id : rawChallanRefs] : []);

        const supplierId = toCleanId(supplierIdBody || supplierRef);
        const customerId = toCleanId(customerIdBody || customerRef);

        const safeGrandTotal = grandTotal != null && grandTotal !== "" ? Number(grandTotal) : null;
        const safeDiscount = discount != null && discount !== "" ? Number(discount) : null;
        const safeGst = gst != null && gst !== "" ? Number(gst) : null;
        const safeOtherExpenses = otherExpenses != null && otherExpenses !== "" ? Number(otherExpenses) : null;
        const safeTotalBilling = totalBillingAmount != null && totalBillingAmount !== "" ? Number(totalBillingAmount) : null;
        const safeCurrentTotal = currentTotal != null && currentTotal !== "" ? Number(currentTotal) : safeGrandTotal;
        const safeBalance = balance != null && balance !== "" ? Number(balance) : 0;
        const safeInvoiceNo = invoiceNo ? String(invoiceNo) : `INV-${Date.now()}`;

        const invoiceDoc = await prisma.invoice.create({
            data: {
                challanRefs,
                supplierId: supplierId || null,
                customerId: customerId || null,
                products: products ?? [],
                grandTotal: safeGrandTotal,
                discount: safeDiscount,
                gst: safeGst,
                otherExpenses: safeOtherExpenses,
                totalBillingAmount: safeTotalBilling,
                currentTotal: safeCurrentTotal,
                isCleared: isCleared ?? false,
                isPaidToSupplier: isPaidToSupplier ?? false,
                invoiceDate: invoiceDate || new Date().toISOString().slice(0, 10),
                invoiceNo: safeInvoiceNo,
                balance: safeBalance,
            },
            include: { supplier: true, customer: true },
        });

        // Create customer ledger entry
        if (customerId) {
            await prisma.customerLedger.create({
                data: {
                    customerId,
                    invoiceId: invoiceDoc.id,
                    transactionType: 'invoice',
                    amount: safeGrandTotal || 0,
                    debit: safeGrandTotal || 0,
                    credit: 0,
                    balance: -(safeGrandTotal || 0),
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
                    amount: safeGrandTotal || 0,
                    credit: safeGrandTotal || 0,
                    debit: 0,
                    balance: safeGrandTotal || 0,
                },
            });
        }

        res.status(201).json({ message: "Created Successfully", success: true, invoiceDoc });
    } catch (error) {
        console.error("Error creating invoice:", error);
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

        // Look up related challans referenced in challanRefs
        let challans = [];
        if (Array.isArray(invoice.challanRefs) && invoice.challanRefs.length > 0) {
            const rawChallanIds = invoice.challanRefs.map(r => typeof r === 'object' ? r?.id : r).filter(Boolean);
            challans = await prisma.challan.findMany({
                where: { id: { in: rawChallanIds } },
                include: { customer: true, supplier: true },
            });
            if (challans.length === 0) {
                challans = await prisma.quickChallan.findMany({
                    where: { id: { in: rawChallanIds } },
                    include: { customer: true, supplier: true },
                });
            }
        }

        const invoiceWithChallan = {
            ...invoice,
            challanRef: challans[0] || null,
            challans,
        };

        res.status(200).json({ success: true, invoice: invoiceWithChallan });
    } catch (error) {
        console.error("Error getting invoice:", error);
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
            challanRefs: challanRefsBody,
            supplierId: supplierIdBody,
            customerId: customerIdBody,
            supplierRef,
            customerRef,
            challanRef,
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

        const challanRefs = challanRefsBody || challanRef || [];
        const supplierId = supplierIdBody || supplierRef || null;
        const customerId = customerIdBody || customerRef || null;

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

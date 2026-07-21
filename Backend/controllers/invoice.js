import express from "express";
import Invoice from "../models/InvoiceModel.js";
import CustomerLedger from "../models/CustomerLedger.js";
import SupplierLedger from "../models/SupplierLedger.js";

const router = express.Router();

// Create invoice
router.post("/create-invoice", async (req, res, next) => {
    try {
        const { customerRef, supplierRef, grandTotal } = req.body;

        const invoiceDoc = await Invoice.create(req.body);


        const customerLedgerEntry = new CustomerLedger({
            customerRef,
            invoiceRef: invoiceDoc._id,
            transactionType: 'invoice',
            amount: grandTotal,
        });
        await customerLedgerEntry.save();

        const supplierLedgerEntry = new SupplierLedger({
            supplierRef,
            invoiceRef: invoiceDoc._id,
            transactionType: 'invoice',
            amount: grandTotal,
        });
        await supplierLedgerEntry.save();

        res.status(201).json({
            message: "Created Successfully",
            success: true,
            invoiceDoc,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

router.get("/get-invoice/:id", async (req, res, next) => {
    try {
        const invoiceId = req.params.id;

        const invoice = await Invoice.findById(invoiceId).populate('challanRef').populate('supplierRef');

        if (!invoice) {
            return res.status(404).json({
                success: false,
                error: "Invoice not found with this ID",
            });
        }

        res.status(200).json({
            success: true,
            invoice,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Get all invoices
router.get("/get-all-invoice", async (req, res, next) => {
    try {
        // const invoices = await Invoice.find({ isCleared: false });;
        const invoices = await Invoice.find({});

        res.status(200).json({
            success: true,
            invoices,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

router.post("/process-payment", async (req, res, next) => {
    try {
        const { invoiceAdjustments } = req.body; // Array of objects containing invoiceId and adjustment amount

        const updatePromises = invoiceAdjustments.map(async (adjustment) => {
            const { invoiceId, remainingAmount } = adjustment;

            const invoice = await Invoice.findById(invoiceId);
            if (!invoice) {
                throw new Error(`Invoice not found with ID ${invoiceId}`);
            }

            console.log(remainingAmount)
            console.log(invoiceId)

            let newCurrentTotal = remainingAmount;
            newCurrentTotal = Math.max(newCurrentTotal, 0); // Ensure total doesn't go below zero

            return Invoice.findByIdAndUpdate(
                invoiceId,
                {
                    currentTotal: newCurrentTotal,
                    isCleared: newCurrentTotal === 0,
                },
                { new: true }
            );
        });

        // Execute all updates
        const updatedInvoices = await Promise.all(updatePromises);

        res.status(200).json({
            success: true,
            message: "Invoices updated successfully!",
            updatedInvoices,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});
router.post("/process-supplier-payment", async (req, res, next) => {
    try {
        const { invoiceAdjustments } = req.body; // Array of objects containing invoiceId and adjustment amount

        const updatePromises = invoiceAdjustments.map(async (adjustment) => {
            const { invoiceId, remainingAmount } = adjustment;

            const invoice = await Invoice.findById(invoiceId);
            if (!invoice) {
                throw new Error(`Invoice not found with ID ${invoiceId}`);
            }

            console.log(remainingAmount)
            console.log(invoiceId)

            let newCurrentTotal = remainingAmount;
            newCurrentTotal = Math.max(newCurrentTotal, 0); // Ensure total doesn't go below zero

            return Invoice.findByIdAndUpdate(
                invoiceId,
                {
                    currentTotal: newCurrentTotal,
                    // isCleared: newCurrentTotal === 0,
                    isPaidToSupplier: newCurrentTotal === 0
                },
                { new: true }
            );
        });

        // Execute all updates
        const updatedInvoices = await Promise.all(updatePromises);

        res.status(200).json({
            success: true,
            message: "Invoices updated successfully!",
            updatedInvoices,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Delete invoice
router.delete("/delete-invoice/:id", async (req, res, next) => {
    try {
        const invoiceId = req.params.id;

        const invoice = await Invoice.findByIdAndDelete(invoiceId);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                error: "invoice not found with this id",
            });
        }

        res.status(200).json({
            success: true,
            message: "invoice deleted successfully!",
            invoice,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Update invoice
router.put("/update-invoice/:id", async (req, res, next) => {
    try {
        const invoiceId = req.params.id;

        const invoice = await Invoice.findByIdAndUpdate(invoiceId, req.body, { new: true });

        if (!invoice) {
            return res.status(404).json({
                success: false,
                error: "invoice not found with this id",
            });
        }

        res.status(200).json({
            success: true,
            message: "invoice updated successfully!",
            invoice,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

export default router;

import express from "express";
import Supplierpayment from "../models/SupplierPaymentModel.js"
import CustomerLedger from "../models/CustomerLedger.js";
import SupplierLedger from "../models/SupplierLedger.js";
const router = express.Router();


// Create width
router.post("/create-supplierpayment", async (req, res, next) => {
    try {

        const { whomToPay, adjustments, customerRef, supplierRef, newReference, paymentDate, amountEntered } = req.body;
        const supplierpaymentDoc = await Supplierpayment.create(req.body);

        for (const adjustment of adjustments) {
            const { invoiceId, adjust } = adjustment;

            // Create a new entry in SupplierLedger
            const supplierLedgerEntry = new SupplierLedger({
                supplierRef,
                paymentRef: supplierpaymentDoc._id,
                invoiceRef: invoiceId,
                amount: adjust,
                transactionType: 'payment',
                debit: adjust,
                balance: 0 // Will be updated by pre-save hook
            });
            await supplierLedgerEntry.save();
        }

        // Handle advance payment (newReference) entry after all invoices have been added
        if (newReference && newReference.adjust > 0) {
            const uniqueInvoiceRef = uuidv4(); // Generate a unique ID for advance payment
            console.log(uniqueInvoiceRef, '::::::::::::');

            // Create a similar entry in SupplierLedger for the advance payment
            await SupplierLedger.create({
                supplierRef,
                paymentRef: supplierpaymentDoc._id,
                advancePaymentRef: uniqueInvoiceRef, // Use the unique ID in advancePaymentRef
                amount: newReference.adjust,
                transactionType: 'payment',
                debit: newReference.adjust,
                balance: 0 // Will be updated by pre-save hook
            });
        }


        res.status(201).json({
            message: "Create Successfully",
            success: true,
            supplierpaymentDoc,
        });
    } catch (error) {
        res.json({
            message: "supplierpayment not be empty",
            success: false,
            error: error.message,
        }).status(404);
    }
});


// Get all widths
router.get("/get-all-supplierpayments", async (req, res, next) => {
    try {
        const supplierpayments = await Supplierpayment.find({});

        res.status(200).json({
            success: true,
            supplierpayments,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Delete width
router.delete("/delete-supplierpayment/:id", async (req, res, next) => {

    try {
        const supplierpaymentId = req.params.id;
        console.log(supplierpaymentId)

        const supplierpayment = await Supplierpayment.findByIdAndDelete(supplierpaymentId);
        if (!supplierpayment) {
            return res.status(404).json({
                success: false,
                error: "supplierpayment not found with this id",
            });
        }

        res.status(200).json({
            success: true,
            message: "supplierpayment deleted successfully!",
            supplierpayment,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Update width
router.put("/update-supplierpayment/:id", async (req, res, next) => {
    try {
        const supplierpaymentId = req.params.id;

        const supplierpayment = await Supplierpayment.findByIdAndUpdate(
            supplierpaymentId,
            req.body,
            { new: true } // Add this option to return the updated document
        );

        if (!supplierpayment) {
            return res.status(404).json({
                success: false,
                error: "supplierpayment not found with this id",
            });
        }

        res.status(200).json({
            success: true,
            message: "supplierpayment updated successfully!",
            supplierpayment,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

export default router;

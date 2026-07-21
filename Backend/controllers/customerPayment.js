import express from "express";
import { v4 as uuidv4 } from 'uuid';
import Customerpayment from "../models/CustomerPaymentModel.js"
import CustomerLedger from "../models/CustomerLedger.js";
import SupplierLedger from "../models/SupplierLedger.js";

const router = express.Router();

// Create width
router.post("/create-customerpayment", async (req, res, next) => {
    try {
        const { whomToPay, adjustments, customerRef, supplierRef, newReference, paymentDate, amountEntered } = req.body;
        const customerpaymentDoc = await Customerpayment.create(req.body);

        if (whomToPay === 'supplier') {
            // Process adjustments and update both customer and supplier ledgers
            for (const adjustment of adjustments) {
                const { invoiceId, adjust } = adjustment;

                // Create a new entry in CustomerLedger
                const customerLedgerEntry = new CustomerLedger({
                    customerRef,
                    paymentRef: customerpaymentDoc._id,
                    invoiceRef: invoiceId,
                    amount: adjust,
                    transactionType: 'payment',
                    credit: adjust,
                    balance: 0 // Will be updated by pre-save hook
                });

                // Create a new entry in SupplierLedger
                const supplierLedgerEntry = new SupplierLedger({
                    supplierRef,
                    paymentRef: customerpaymentDoc._id,
                    invoiceRef: invoiceId,
                    amount: adjust,
                    transactionType: 'payment',
                    debit: adjust,
                    balance: 0 // Will be updated by pre-save hook
                });

                // Save both ledger entries
                await customerLedgerEntry.save();
                await supplierLedgerEntry.save();

                console.log(customerLedgerEntry, "customerrr")
                console.log(supplierLedgerEntry, "supplierrrr")
            }

            // Handle advance payment (newReference) entry after all invoices have been added
            if (newReference && newReference.adjust > 0) {
                const uniqueInvoiceRef = uuidv4(); // Generate a unique ID for advance payment
                console.log(uniqueInvoiceRef, '::::::::::::');

                // Create an entry in CustomerLedger for the advance payment
                await CustomerLedger.create({
                    customerRef,
                    paymentRef: customerpaymentDoc._id,
                    advancePaymentRef: uniqueInvoiceRef, // Use the unique ID in advancePaymentRef
                    amount: newReference.adjust,
                    transactionType: 'payment',
                    credit: newReference.adjust,
                    balance: 0 // Will be updated by pre-save hook
                });

                // Create a similar entry in SupplierLedger for the advance payment
                await SupplierLedger.create({
                    supplierRef,
                    paymentRef: customerpaymentDoc._id,
                    advancePaymentRef: uniqueInvoiceRef, // Use the unique ID in advancePaymentRef
                    amount: newReference.adjust,
                    transactionType: 'payment',
                    debit: newReference.adjust,
                    balance: 0 // Will be updated by pre-save hook
                });
            }

        } else if (whomToPay === 'self') {
            // make changes in customer ledger only

            for (const adjustment of adjustments) {
                const { invoiceId, adjust } = adjustment;

                // Create a new entry in CustomerLedger
                const customerLedgerEntry = new CustomerLedger({
                    customerRef,
                    paymentRef: customerpaymentDoc._id,
                    invoiceRef: invoiceId,
                    amount: adjust,
                    transactionType: 'payment',
                    credit: adjust,
                    balance: 0 // Will be updated by pre-save hook
                });

                // Save both ledger entries
                await customerLedgerEntry.save();
            }

            // Handle advance payment (newReference) entry after all invoices have been added
            if (newReference && newReference.adjust > 0) {
                const uniqueInvoiceRef = uuidv4(); // Generate a unique ID for advance payment
                console.log(uniqueInvoiceRef, '::::::::::::');

                // Create an entry in CustomerLedger for the advance payment
                await CustomerLedger.create({
                    customerRef,
                    paymentRef: customerpaymentDoc._id,
                    advancePaymentRef: uniqueInvoiceRef, // Use the unique ID in advancePaymentRef
                    amount: newReference.adjust,
                    transactionType: 'payment',
                    credit: newReference.adjust,
                    balance: 0 // Will be updated by pre-save hook
                });
            }
        }

        res.status(201).json({
            message: "Create Successfully",
            success: true,
            customerpaymentDoc,
        });
    } catch (error) {
        res.json({
            message: "customerpayment not be empty",
            success: false,
            error: error.message,
        }).status(404);
    }
});


// Get all widths
router.get("/get-all-customerpayments", async (req, res, next) => {
    try {
        const customerpayments = await Customerpayment.find({});

        res.status(200).json({
            success: true,
            customerpayments,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Delete width
router.delete("/delete-customerpayment/:id", async (req, res, next) => {

    try {
        const customerpaymentId = req.params.id;
        console.log(customerpaymentId)

        const customerpayment = await Customerpayment.findByIdAndDelete(customerpaymentId);
        if (!customerpayment) {
            return res.status(404).json({
                success: false,
                error: "customerpayment not found with this id",
            });
        }

        res.status(200).json({
            success: true,
            message: "customerpayment deleted successfully!",
            customerpayment,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Update width
router.put("/update-customerpayment/:id", async (req, res, next) => {
    try {
        const customerpaymentId = req.params.id;

        const customerpayment = await Customerpayment.findByIdAndUpdate(
            customerpaymentId,
            req.body,
            { new: true } // Add this option to return the updated document
        );

        if (!customerpayment) {
            return res.status(404).json({
                success: false,
                error: "customerpayment not found with this id",
            });
        }

        res.status(200).json({
            success: true,
            message: "customerpayment updated successfully!",
            customerpayment,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

export default router;

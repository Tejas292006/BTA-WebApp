import express from "express";
import Customer from "../models/Customer.js";


const router = express.Router();

// Create width
router.post("/create-customer", async (req, res, next) => {
    try {
        const customerDoc = new Customer(req.body);
        await customerDoc.save();
        console.log(req.body, 'hiiiiiiiiiiiiiiiii')
        res.status(201).json({
            message: "Create Successfully",
            success: true,
            customerDoc,
        });
    } catch (error) {
        res.status(404).json({
            message: "customer name not be empty",
            success: false,
            error: error.message,
        });
    }
});


// Get all widths
router.get("/get-all-customers", async (req, res, next) => {
    try {
        const customers = await Customer.find({});

        res.status(200).json({
            success: true,
            customers,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});


router.post("/update-supplier-balance", async (req, res) => {
    try {
        const { updatedBalance,customerId, supplierId, invoiceAdjustments } = req.body;

        // Fetch the customer document
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Initialize or find the supplier balance entry
        let supplierBalance = customer.supplierBalances.find(
            balance => balance.supplier.toString() === supplierId
        );

        if (!supplierBalance) {
            supplierBalance = {
                supplier: supplierId,
                balance: 0,
                discount: 0,
                interest: 0,
            };
            customer.supplierBalances.push(supplierBalance);
        }

        // Calculate the new balance, total discount, and total interest
        let totalDiscount = 0;
        let totalInterest = 0;
        let totalRemaining = 0;

        invoiceAdjustments.forEach(adjustment => {
            totalDiscount += adjustment.discount || 0;
            totalInterest += adjustment.interest || 0;
            totalRemaining += adjustment.remaining || 0;
        });

        // Update the supplier balance fields
        supplierBalance.balance = updatedBalance;
        supplierBalance.discount += totalDiscount;
        supplierBalance.interest += totalInterest;

        // Save the customer document
        await customer.save();

        res.status(200).json({
            success: true,
            message: "Supplier balance updated successfully!",
            customer,
        });
    } catch (error) {
        console.error('Error updating supplier balance:', error);
        res.status(500).json({ message: 'Error updating supplier balance' });
    }
});

router.post('/initialize-balance', async (req, res) => {
    try {
        const { customerId, supplierId } = req.body;

        const customer = await Customer.findById(customerId);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const existingBalance = customer.supplierBalances.find(
            (sb) => sb.supplier.toString() === supplierId
        );

        if (!existingBalance) {
            customer.supplierBalances.push({
                supplier: supplierId,
                balance: 0,
                discount: 0,
                interest: 0,
            });

            await customer.save();
        }

        res.status(200).json(customer);
    } catch (error) {
        console.error('Error initializing balance:', error);
        res.status(500).json({ message: 'Error initializing balance' });
    }
});



// Delete width
router.delete("/delete-customer/:id", async (req, res, next) => {
   
    try {
        const customerId = req.params.id;
        console.log(customerId)
     
        const customer = await Customer.findByIdAndDelete(customerId);
        if (!customer) {
            return res.status(404).json({
                success: false,
                error: "customer not found with this id",
            });
        }

        res.status(200).json({
            success: true,
            message: "customer deleted successfully!",
            customer,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Update width
router.put("/update-customer/:id", async (req, res, next) => {
    try {
        const customerId = req.params.id;

        const customer = await Customer.findByIdAndUpdate(
            customerId,
            req.body,
            { new: true } // Add this option to return the updated document
        );

        if (!customer) {
            return res.status(404).json({
                success: false,
                error: "customername not found with this id",
            });
        }

        res.status(200).json({
            success: true,
            message: "customer updated successfully!",
            customer,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

export default router;

import express from "express";
import prisma from "../configs/prismaClient.js";

const router = express.Router();

// Create customer
router.post("/create-customer", async (req, res) => {
    try {
        const { name, companyName, supplierBalances } = req.body;
        const customerDoc = await prisma.customer.create({
            data: {
                name,
                companyName,
                supplierBalances: supplierBalances ?? [],
            },
        });
        res.status(201).json({ message: "Created Successfully", success: true, customerDoc });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message, message: "Customer name must not be empty" });
    }
});

// Get all customers
router.get("/get-all-customers", async (req, res) => {
    try {
        const customers = await prisma.customer.findMany({ orderBy: { createdAt: "desc" } });
        res.status(200).json({ success: true, customers });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update supplier balance inside customer (supplierBalances is JSON column)
router.post("/update-supplier-balance", async (req, res) => {
    try {
        const { updatedBalance, customerId, supplierId, invoiceAdjustments } = req.body;

        const customer = await prisma.customer.findUnique({ where: { id: customerId } });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        let supplierBalances = Array.isArray(customer.supplierBalances) ? customer.supplierBalances : [];

        let supplierBalance = supplierBalances.find(b => b.supplier === supplierId);

        let totalDiscount = 0;
        let totalInterest = 0;
        invoiceAdjustments.forEach(adj => {
            totalDiscount += adj.discount || 0;
            totalInterest += adj.interest || 0;
        });

        if (supplierBalance) {
            supplierBalance.balance = updatedBalance;
            supplierBalance.discount = (supplierBalance.discount || 0) + totalDiscount;
            supplierBalance.interest = (supplierBalance.interest || 0) + totalInterest;
        } else {
            supplierBalances.push({
                supplier: supplierId,
                balance: updatedBalance,
                discount: totalDiscount,
                interest: totalInterest,
            });
        }

        const updatedCustomer = await prisma.customer.update({
            where: { id: customerId },
            data: { supplierBalances },
        });

        res.status(200).json({ success: true, message: "Supplier balance updated successfully!", customer: updatedCustomer });
    } catch (error) {
        console.error("Error updating supplier balance:", error);
        res.status(500).json({ message: "Error updating supplier balance" });
    }
});

// Initialize balance for a supplier inside customer
router.post("/initialize-balance", async (req, res) => {
    try {
        const { customerId, supplierId } = req.body;

        const customer = await prisma.customer.findUnique({ where: { id: customerId } });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        let supplierBalances = Array.isArray(customer.supplierBalances) ? customer.supplierBalances : [];

        const exists = supplierBalances.find(b => b.supplier === supplierId);
        if (!exists) {
            supplierBalances.push({ supplier: supplierId, balance: 0, discount: 0, interest: 0 });
            const updatedCustomer = await prisma.customer.update({
                where: { id: customerId },
                data: { supplierBalances },
            });
            return res.status(200).json(updatedCustomer);
        }

        res.status(200).json(customer);
    } catch (error) {
        console.error("Error initializing balance:", error);
        res.status(500).json({ message: "Error initializing balance" });
    }
});

// Delete customer
router.delete("/delete-customer/:id", async (req, res) => {
    try {
        const customer = await prisma.customer.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: "Customer deleted successfully!", customer });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update customer
router.put("/update-customer/:id", async (req, res) => {
    try {
        const { name, companyName, supplierBalances } = req.body;
        const customer = await prisma.customer.update({
            where: { id: req.params.id },
            data: { name, companyName, supplierBalances },
        });
        res.status(200).json({ success: true, message: "Customer updated successfully!", customer });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;

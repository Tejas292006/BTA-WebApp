import express from "express";
import prisma from "../configs/prismaClient.js";

const router = express.Router();

// Create challan
router.post("/create-challan", async (req, res) => {
    try {
        const {
            products,
            supplierId: supplierIdBody,
            customerId: customerIdBody,
            supplier,
            customer,
            challanNo,
            totalBill,
            challanDate,
            challanType,
            type,
            verified,
            overallremarks,
        } = req.body;

        const supplierId = supplierIdBody || supplier || null;
        const customerId = customerIdBody || customer || null;

        const challanDoc = await prisma.challan.create({
            data: {
                products: products ?? [],
                supplierId: supplierId || null,
                customerId: customerId || null,
                challanNo,
                totalBill,
                challanDate: new Date(challanDate),
                challanType: challanType || "main",
                type: type || null,
                verified: verified ?? false,
                overallremarks: overallremarks || null,
            },
            include: { customer: true, supplier: true },
        });

        res.status(201).json({ message: "Created Successfully", success: true, challanDoc });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get all challans
router.get("/get-all-challan", async (req, res) => {
    try {
        const challans = await prisma.challan.findMany({
            include: { customer: true, supplier: true },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({ success: true, challans });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete challan
router.delete("/delete-challan/:id", async (req, res) => {
    try {
        const challan = await prisma.challan.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: "Challan deleted successfully!", challan });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update challan
router.put("/update-challan/:id", async (req, res) => {
    try {
        const {
            products,
            supplierId: supplierIdBody,
            customerId: customerIdBody,
            supplier,
            customer,
            challanNo,
            totalBill,
            challanDate,
            challanType,
            type,
            verified,
            overallremarks,
        } = req.body;

        const supplierId = supplierIdBody || supplier || null;
        const customerId = customerIdBody || customer || null;

        const challan = await prisma.challan.update({
            where: { id: req.params.id },
            data: {
                products,
                supplierId: supplierId || null,
                customerId: customerId || null,
                challanNo,
                totalBill,
                challanDate: challanDate ? new Date(challanDate) : undefined,
                challanType,
                type,
                verified,
                overallremarks,
            },
            include: { customer: true, supplier: true },
        });

        res.status(200).json({ success: true, message: "Challan updated successfully!", challan });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update isProductDispatchedByInvoice for a product inside challan's JSON products array
router.put("/update-challan-products/:id", async (req, res) => {
    try {
        const { productId, isProductDispatchedByInvoice } = req.body;

        const challan = await prisma.challan.findUnique({ where: { id: req.params.id } });
        if (!challan) {
            return res.status(404).json({ success: false, error: "Challan not found" });
        }

        const products = Array.isArray(challan.products) ? challan.products : [];
        let productFound = false;

        const updatedProducts = products.map(product => {
            if (product.product === productId || product._id === productId) {
                productFound = true;
                return { ...product, isProductDispatchedByInvoice };
            }
            return product;
        });

        if (!productFound) {
            return res.status(404).json({ success: false, error: "Product not found in challan" });
        }

        await prisma.challan.update({
            where: { id: req.params.id },
            data: { products: updatedProducts },
        });

        res.status(200).json({ success: true, message: "Challan dispatched successfully!" });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update due for a product inside challan's JSON products array
router.put("/update-due-products/:id", async (req, res) => {
    try {
        const { productId, due } = req.body;

        const challan = await prisma.challan.findUnique({ where: { id: req.params.id } });
        if (!challan) {
            return res.status(404).json({ success: false, error: "Challan not found" });
        }

        const products = Array.isArray(challan.products) ? challan.products : [];
        let productFound = false;

        const updatedProducts = products.map(product => {
            if (product.product === productId || product._id === productId) {
                productFound = true;
                return { ...product, due };
            }
            return product;
        });

        if (!productFound) {
            return res.status(404).json({ success: false, error: "Product not found in challan" });
        }

        await prisma.challan.update({
            where: { id: req.params.id },
            data: { products: updatedProducts },
        });

        res.status(200).json({ success: true, message: "Challan due updated successfully!" });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;

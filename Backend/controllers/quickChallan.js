import express from "express";
import prisma from "../configs/prismaClient.js";

const router = express.Router();

// Create quickchallan
router.post("/create-quickchallan", async (req, res) => {
    try {
        const {
            products,
            supplierId: supplierIdBody,
            customerId: customerIdBody,
            supplier,
            customer,
            quickchallanNo,
            challanChartImages,
            quickchallanDate,
            challanType,
            type,
            verified,
            overallremarks,
        } = req.body;

        const supplierId = supplierIdBody || supplier || null;
        const customerId = customerIdBody || customer || null;

        const quickchallanDoc = await prisma.quickChallan.create({
            data: {
                products: products ?? [],
                supplierId: supplierId || null,
                customerId: customerId || null,
                quickchallanNo,
                challanChartImages: challanChartImages ?? [],
                quickchallanDate: new Date(quickchallanDate),
                challanType: challanType || "quick",
                type: type || null,
                verified: verified ?? false,
                overallremarks: overallremarks || null,
            },
            include: { customer: true, supplier: true },
        });

        res.status(201).json({ message: "Created Successfully", success: true, quickchallanDoc });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get all quickchallans
router.get("/get-all-quickchallan", async (req, res) => {
    try {
        const quickchallans = await prisma.quickChallan.findMany({
            include: { customer: true, supplier: true },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({ success: true, quickchallans });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete quickchallan
router.delete("/delete-quickchallan/:id", async (req, res) => {
    try {
        const quickchallan = await prisma.quickChallan.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: "QuickChallan deleted successfully!", quickchallan });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update quickchallan
router.put("/update-quickchallan/:id", async (req, res) => {
    try {
        const {
            products,
            supplierId: supplierIdBody,
            customerId: customerIdBody,
            supplier,
            customer,
            quickchallanNo,
            challanChartImages,
            quickchallanDate,
            challanType,
            type,
            verified,
            overallremarks,
        } = req.body;

        const supplierId = supplierIdBody || supplier || null;
        const customerId = customerIdBody || customer || null;

        const quickchallan = await prisma.quickChallan.update({
            where: { id: req.params.id },
            data: {
                products,
                supplierId: supplierId || null,
                customerId: customerId || null,
                quickchallanNo,
                challanChartImages,
                quickchallanDate: quickchallanDate ? new Date(quickchallanDate) : undefined,
                challanType,
                type,
                verified,
                overallremarks,
            },
            include: { customer: true, supplier: true },
        });

        res.status(200).json({ success: true, message: "QuickChallan updated successfully!", quickchallan });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update isProductDispatchedByInvoice for a product inside quickchallan products JSON
router.put("/update-quick-challan-products/:id", async (req, res) => {
    try {
        const { productId, isProductDispatchedByInvoice } = req.body;

        const quickchallan = await prisma.quickChallan.findUnique({ where: { id: req.params.id } });
        if (!quickchallan) {
            return res.status(404).json({ success: false, error: "QuickChallan not found" });
        }

        const products = Array.isArray(quickchallan.products) ? quickchallan.products : [];
        let productFound = false;

        const updatedProducts = products.map(product => {
            if (product.product === productId || product._id === productId) {
                productFound = true;
                return { ...product, isProductDispatchedByInvoice };
            }
            return product;
        });

        if (!productFound) {
            return res.status(404).json({ success: false, error: "Product not found in quickchallan" });
        }

        await prisma.quickChallan.update({
            where: { id: req.params.id },
            data: { products: updatedProducts },
        });

        res.status(200).json({ success: true, message: "QuickChallan dispatched successfully!" });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update due for a product inside quickchallan products JSON
router.put("/update-quick-due-products/:id", async (req, res) => {
    try {
        const { productId, due } = req.body;

        const quickchallan = await prisma.quickChallan.findUnique({ where: { id: req.params.id } });
        if (!quickchallan) {
            return res.status(404).json({ success: false, error: "QuickChallan not found" });
        }

        const products = Array.isArray(quickchallan.products) ? quickchallan.products : [];
        let productFound = false;

        const updatedProducts = products.map(product => {
            if (product.product === productId || product._id === productId) {
                productFound = true;
                return { ...product, due };
            }
            return product;
        });

        if (!productFound) {
            return res.status(404).json({ success: false, error: "Product not found in quickchallan" });
        }

        await prisma.quickChallan.update({
            where: { id: req.params.id },
            data: { products: updatedProducts },
        });

        res.status(200).json({ success: true, message: "QuickChallan due updated successfully!" });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;

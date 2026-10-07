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

        const supplierId = toCleanId(supplierIdBody || supplier);
        const customerId = toCleanId(customerIdBody || customer);
        const safeChallanNo = quickchallanNo ? String(quickchallanNo) : `QC-${Date.now()}`;
        const parsedDate = quickchallanDate ? new Date(quickchallanDate) : new Date();
        const safeDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

        const quickchallanDoc = await prisma.quickChallan.create({
            data: {
                products: products ?? [],
                supplierId: supplierId || null,
                customerId: customerId || null,
                quickchallanNo: safeChallanNo,
                challanChartImages: challanChartImages ?? [],
                quickchallanDate: safeDate,
                challanType: challanType || "quick",
                type: type || null,
                verified: verified ?? false,
                overallremarks: overallremarks || null,
            },
            include: { customer: true, supplier: true },
        });

        res.status(201).json({ message: "Created Successfully", success: true, quickchallanDoc });
    } catch (error) {
        console.error("Error creating quickchallan:", error);
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

        const supplierId = toCleanId(supplierIdBody || supplier);
        const customerId = toCleanId(customerIdBody || customer);
        let safeDate = undefined;
        if (quickchallanDate) {
            const parsed = new Date(quickchallanDate);
            if (!isNaN(parsed.getTime())) safeDate = parsed;
        }

        const quickchallan = await prisma.quickChallan.update({
            where: { id: req.params.id },
            data: {
                products: products !== undefined ? products : undefined,
                supplierId: supplierId || null,
                customerId: customerId || null,
                quickchallanNo: quickchallanNo !== undefined ? String(quickchallanNo) : undefined,
                challanChartImages: challanChartImages !== undefined ? challanChartImages : undefined,
                quickchallanDate: safeDate,
                challanType: challanType !== undefined ? challanType : undefined,
                type: type !== undefined ? type : undefined,
                verified: verified !== undefined ? verified : undefined,
                overallremarks: overallremarks !== undefined ? overallremarks : undefined,
            },
            include: { customer: true, supplier: true },
        });

        res.status(200).json({ success: true, message: "QuickChallan updated successfully!", quickchallan });
    } catch (error) {
        console.error("Error updating quickchallan:", error);
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

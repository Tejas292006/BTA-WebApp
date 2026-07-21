import express from 'express';
import prisma from '../configs/prismaClient.js';
import cloudinary from "../configs/cloudinaryConfig.js";
import upload from '../middlewares/multer.js';

const router = express.Router();

// Create a new product
router.post('/create-product', async (req, res) => {
    try {
        const {
            supplierId,
            productName,
            categoryId,
            productAttributes,
            productColorChartData,
            pricePerUnit,
        } = req.body;

        const product = await prisma.product.create({
            data: {
                supplierId: supplierId || null,
                productName,
                categoryId: categoryId || null,
                productAttributes: productAttributes ?? [],
                productColorChartData: productColorChartData ?? [],
                pricePerUnitMagnitude: pricePerUnit?.magnitude ?? 0,
                pricePerUnitId: pricePerUnit?.unit || null,
            },
        });
        res.status(201).json({ success: true, message: 'Product created successfully', product });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to create product', error: error.message });
    }
});

// Upload product color chart image
router.post('/upload-product-chart', upload.single('color-chart-product'), async (req, res) => {
    cloudinary.uploader.upload(req.file.path, { folder: "color-chart-product" }, (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error uploading image" });
        }
        res.status(200).json({ success: true, message: "Image uploaded successfully!", url: result.secure_url });
    });
});

// Upload challan chart image
router.post('/upload-challan-chart', upload.single('color-chart-challan'), async (req, res) => {
    cloudinary.uploader.upload(req.file.path, { folder: "color-chart-challan" }, (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error uploading image" });
        }
        res.status(200).json({ success: true, message: "Image uploaded successfully!", url: result.secure_url });
    });
});

// Get all products
router.get('/get-all-products', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                supplier: true,
                category: true,
                pricePerUnit: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({ success: true, message: 'Products retrieved successfully', products });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve products', error: error.message });
    }
});

// Get a specific product by ID
router.get('/get-product-by-id/:id', async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: req.params.id },
            include: { supplier: true, category: true, pricePerUnit: true },
        });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, message: 'Product retrieved successfully', product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve product', error: error.message });
    }
});

// Update a specific product by ID
router.patch('/edit-product/:id', async (req, res) => {
    try {
        const {
            supplierId,
            productName,
            categoryId,
            productAttributes,
            productColorChartData,
            pricePerUnit,
        } = req.body;

        const product = await prisma.product.update({
            where: { id: req.params.id },
            data: {
                supplierId: supplierId || null,
                productName,
                categoryId: categoryId || null,
                productAttributes,
                productColorChartData,
                pricePerUnitMagnitude: pricePerUnit?.magnitude,
                pricePerUnitId: pricePerUnit?.unit || null,
            },
        });
        res.status(200).json({ success: true, message: 'Product updated successfully', product });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to update product', error: error.message });
    }
});

// Delete a specific product by ID
router.delete('/delete-product/:id', async (req, res) => {
    try {
        const product = await prisma.product.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: 'Product deleted successfully', product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete product', error: error.message });
    }
});

export default router;

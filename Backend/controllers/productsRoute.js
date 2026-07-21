import express from 'express';
import Product from '../models/ProductModel.js'; // Adjust the path as needed
import cloudinary from "../configs/cloudinaryConfig.js";
import upload from '../middlewares/multer.js';

const router = express.Router();

// Create a new product
router.post('/create-product', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to create product',
            error: error.message,
        });
    }
});

// Upload img of a new product color chart
router.post('/upload-product-chart', upload.single('color-chart-product'), async (req, res) => {
    cloudinary.uploader.upload(req.file.path, {
        folder: "color-chart-product",
    }, function (err, result) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Error"
            })
        }

        res.status(200).json({
            success: true,
            message: "Your Image Uploaded Successfully!",
            url: result.secure_url
        })
    })
});
// Upload img of a new product color chart
router.post('/upload-challan-chart', upload.single('color-chart-challan'), async (req, res) => {
    cloudinary.uploader.upload(req.file.path, {
        folder: "color-chart-challan",
    }, function (err, result) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Error"
            })
        }

        res.status(200).json({
            success: true,
            message: "Your Image Uploaded Successfully!",
            url: result.secure_url
        })
    })
});

// Get all products
router.get('/get-all-products', async (req, res) => {
    try {
        const products = await Product.find()
            .populate('supplierName')
            .populate('category')
            .populate('pricePerUnit.unit') // Ensure correct path here
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'Products retrieved successfully',
            products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve products',
            error: error.message,
        });
    }
});

// Get a specific product by ID
router.get('/get-product-by-id/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Product retrieved successfully',
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve product',
            error: error.message,
        });
    }
});

// Update a specific product by ID
router.patch('/edit-product/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to update product',
            error: error.message,
        });
    }
});

// Delete a specific product by ID
router.delete('/delete-product/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }
        res.status(204).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete product',
            error: error.message,
        });
    }
});

export default router;

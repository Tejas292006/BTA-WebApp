import express from "express";
import Challan from "../models/ChallanModel.js";

const router = express.Router();

// Create challan
router.post("/create-challan", async (req, res, next) => {
    try {

        console.log(req.body, 'challan')
        const challanDoc = await Challan.create(req.body);

        res.status(201).json({
            message: "Created Successfully",
            success: true,
            challanDoc,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Get all challans
router.get("/get-all-challan", async (req, res, next) => {
    try {
        const challans = await Challan.find({}).populate([
            { path: 'customer' },
            { path: 'supplier' },
            {
                path: 'products',
                populate: [
                    { path: 'product' },
                    { path: 'cut' }
                ]
            }
        ]);

        res.status(200).json({
            success: true,
            challans,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Delete challan
router.delete("/delete-challan/:id", async (req, res, next) => {
    try {
        const challanId = req.params.id;

        const challan = await Challan.findByIdAndDelete(challanId);

        if (!challan) {
            return res.status(404).json({
                success: false,
                error: "Challan not found with this id",
            });
        }

        res.status(200).json({
            success: true,
            message: "Challan deleted successfully!",
            challan,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Update challan
router.put("/update-challan/:id", async (req, res, next) => {
    try {
        const challanId = req.params.id;

        const challan = await Challan.findByIdAndUpdate(challanId, req.body, { new: true });

        if (!challan) {
            return res.status(404).json({
                success: false,
                error: "Challan not found with this id",
            });
        }

        res.status(200).json({
            success: true,
            message: "Challan updated successfully!",
            challan,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});
router.put("/update-challan-products/:id", async (req, res, next) => {
    try {
        const challanId = req.params.id;
        const { productId, isProductDispatchedByInvoice } = req.body;


        const challanProductUpdated = await Challan.findById(challanId);
        if (!challanProductUpdated) {
            return res.status(404).json({
                success: false,
                error: "Challan not found with this id",
            });
        }

        let productFound = false;

        challanProductUpdated?.products.map(product => {
            if (product.product == productId) {
                product.isProductDispatchedByInvoice = isProductDispatchedByInvoice;
                productFound = true;
            }
        })


        if (!productFound) {
            return res.status(404).json({
                success: false,
                error: "Product not found with this id",
            });
        }

        console.log(challanProductUpdated, "uddated")

        await challanProductUpdated.save();


        res.status(200).json({
            success: true,
            message: "Challan Dispatch successfully!"
        });

        // yha update ka logic likhna h 
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});
router.put("/update-due-products/:id", async (req, res, next) => {
    try {
        const challanId = req.params.id;
        const { productId, due } = req.body;
        console.log(`Product Id : ${productId} and DUE : ${due}`);

        const challanProductUpdated = await Challan.findById(challanId);
        if (!challanProductUpdated) {
            return res.status(404).json({
                success: false,
                error: "Challan not found with this id",
            });
        }

        let productFound = false;
        challanProductUpdated.products.forEach(product => {
            if (product.product == productId) {
                console.log("IN for " + product.product);
                product.due = due;
                productFound = true;
            }
        });

        if (!productFound) {
            return res.status(404).json({
                success: false,
                error: "Product not found with this id",
            });
        }

        await challanProductUpdated.save();
        res.status(200).json({
            success: true,
            message: "Challan updated successfully!",
            challan,
        });

        // yha update ka logic likhna h 
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

export default router;

import express from "express";
import Supplier from "../models/SupplierModel.js";

const router = express.Router();

// Create supplier
router.post("/create-supplier", async (req, res, next) => {
    try {
        const supplierDoc = await Supplier.create(req.body);

        res.status(201).json({
            message: "Create Successfully",
            success: true,
            supplierDoc,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            error: error.message,
        });
    }
});


// Get all suppliers
router.get("/get-all-supplier", async (req, res, next) => {
    try {
        const suppliers = await Supplier.find({});

        res.status(200).json({
            success: true,
            suppliers,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Delete supplier
router.delete("/delete-supplier/:id", async (req, res, next) => {
    try {
        const supplierId = req.params.id;

        const supplier = await Supplier.findByIdAndDelete(supplierId);

        if (!supplier) {
            return res.status(404).json({
                success: false,
                error: "supplier not found with this id",
            });
        }

        res.status(200).json({
            success: true,
            message: "supplier deleted successfully!",
            supplier,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Update supplier
router.put("/update-supplier/:id", async (req, res, next) => {
    try {
        const supplierId = req.params.id;

        const supplier = await Supplier.findByIdAndUpdate(supplierId , req.body , {new : true});

        console.log('Updated Supplier:', supplier);

        if (!supplier) {
            return res.status(404).json({
                success: false,
                error: "supplier not found with this id",
            });
        }
        res.status(200).json({
            success: true,
            message: "supplier updated successfully!",
            supplier,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

export default router;

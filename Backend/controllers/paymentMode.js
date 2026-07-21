import express from "express";
import PaymentMode from "../models/PaymentMode.js";

const router = express.Router();

// Create width
router.post("/create-paymentmode", async (req, res, next) => {
    try {
        const paymentmodeDoc = await PaymentMode.create(req.body);

        res.status(201).json({
            message: "Create Successfully",
            success: true,
            paymentmodeDoc,
        });
    } catch (error) {
        res.json({
            message : "paymentmode not be empty",
            success: false,
            error: error.message,
        }).status(404);
    }
});


// Get all widths
router.get("/get-all-paymentmode", async (req, res, next) => {
    try {
        const paymentmodes = await PaymentMode.find({});

        res.status(200).json({
            success: true,
            paymentmodes,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Delete width
router.delete("/delete-paymentmode/:id", async (req, res, next) => {
   
    try {
        const paymentmodeId = req.params.id;
        console.log(paymentmodeId)
     
        const paymentmode = await PaymentMode.findByIdAndDelete(paymentmodeId);
        if (!paymentmode) {
            return res.status(404).json({
                success: false,
                error: "paymentmode not found with this id",
            });
        }

        res.status(200).json({
            success: true,
            message: "paymentmode deleted successfully!",
            paymentmode,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// Update width
router.put("/update-paymentmode/:id", async (req, res, next) => {
    try {
        const paymentmodeId = req.params.id;

        const paymentmode = await PaymentMode.findByIdAndUpdate(
            paymentmodeId,
            req.body,
            { new: true } // Add this option to return the updated document
        );

        if (!paymentmode) {
            return res.status(404).json({
                success: false,
                error: "paymentmode not found with this id",
            });
        }

        res.status(200).json({
            success: true,
            message: "paymentmode updated successfully!",
            paymentmode,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

export default router;

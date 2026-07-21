import SupplierLedger from "../models/SupplierLedger.js";
import express from "express";

const router = express.Router();

router.get("/get-all-supplierledgers", async (req, res, next) => {
    try {
        const supplierledgers = await SupplierLedger.find({});

        res.status(200).json({
            success: true,
            supplierledgers,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});
export default router;

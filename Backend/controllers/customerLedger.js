import CustomerLedger from "../models/CustomerLedger.js";
import express from "express";

const router = express.Router();

router.get("/get-all-customerledgers", async (req, res, next) => {
    try {
        const customerledgers = await CustomerLedger.find({});

        res.status(200).json({
            success: true,
            customerledgers,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});
export default router;

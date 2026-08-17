import express from "express";
import prisma from "../configs/prismaClient.js";

const router = express.Router();

// Create design
router.post("/create-design", async (req, res) => {
    try {
        const { name, categoryId, verified } = req.body;
        const design = await prisma.design.create({
            data: { name, categoryId: categoryId || null, verified: verified ?? false },
        });
        res.status(201).json({ message: "Created Successfully", success: true, design, designDoc: design });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get all designs
router.get("/get-all-design", async (req, res) => {
    try {
        const designs = await prisma.design.findMany({
            include: { category: true },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({ success: true, designs });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete design
router.delete("/delete-design/:id", async (req, res) => {
    try {
        const design = await prisma.design.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: "Design deleted successfully!", design });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update design
router.put("/update-design/:id", async (req, res) => {
    try {
        const { name, categoryId, verified } = req.body;
        const design = await prisma.design.update({
            where: { id: req.params.id },
            data: { name, categoryId: categoryId || null, verified },
        });
        res.status(200).json({ success: true, message: "Design updated successfully!", design, designDoc: design });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;

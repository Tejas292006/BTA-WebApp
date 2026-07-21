import mongoose from "mongoose";

const { model, models, Schema } = mongoose;

const ProductSchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,

    },
    due: {
        type: Number,
        default : 0
    },
    cut: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cut",
        required: true,
    },
    remarkDesc: {
        type: String,
    },
    qtyPcs: {
        type: String,
        // required: true,
    },
    qtyMtr: {
        type: Number,
        // required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    challanChartImages: [{
        src: {
            type: String,
        }
    }],
    isProductDispatchedByInvoice: {
        type: Boolean,
        default: false,
    },
    rate: {
        type: Number,
        required: true,
    },
    overall: {
        type: Number,
        required: true,
    },
});

const ChallanSchema = new Schema({
    products: [ProductSchema],
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "suppliers",
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
    },
    challanNo: {
        type: String,
        required: true,
    },
    totalBill: {
        type: String,
        required: true,
    },
    challanDate: {
        type: Date,
        required: true,
    },
    challanType: {
        type: String,
        default: "main"
    },
    type: {
        type: String,
        enum: ["supplier", "product"],
    },
    verified: {
        type: Boolean,
        default: false,
    },
    overallremarks: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

const Challan = models?.Challan || model('Challan', ChallanSchema);

export default Challan;

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
    isProductDispatchedByInvoice: {
        type: Boolean,
        default: false,
    },
    bales: {
        type: String,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});

const QuickChallanSchema = new Schema({
    products: [ProductSchema],
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "suppliers",
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
    },
    quickchallanNo: {
        type: String,
        required: true,
    },
    challanChartImages: [{
        src: {
            type: String,
        }
    }],
    // totalBill: {
    //     type: String,
    //     required: true,
    // },
    quickchallanDate: {
        type: Date,
        required: true,
    },
    challanType: {
        type: String,
        default: "quick"
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
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

const QuickChallan = models?.QuickChallan || model('QuickChallan', QuickChallanSchema);

export default QuickChallan;

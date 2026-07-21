import mongoose from "mongoose";

const { model, models, Schema } = mongoose;


const InvoiceSchema = new Schema({
    challanRef: [{
        type: Schema.Types.ObjectId,
        ref: "Challan",
        required: [true, "please provide name"]
    }],
    supplierRef: {
        type: Schema.Types.ObjectId,
        ref: "suppliers",
    },
    customerRef: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
    },
    products: [
        {
            product: {
                type: String,
                required: [true, "please provide name"]
            },
            id: {
                type: Schema.Types.ObjectId,
                ref: "Product",
            },
            challanId: {
                type: Schema.Types.ObjectId,
                ref: "Challan",
            },
            cut: {
                type: String || Number,
                required: true,
            },
            unit: {
                type: String || Number,
            },
            challanType: {
                type: String || Number,
            },
            qtyPcs: {
                type: String || Number,
            },
            qtyMtr: {
                type: String || Number,
            },
            bales: {
                type: String || Number,
            },
            received_bales: {
                type: String || Number,
            },
            received_mtr: {
                type: String || Number,
            },
            received_pcs: {
                type: String || Number,
            },
            due: {
                type: Number,
                default: 0,
            },
            rate: {
                type: Number,

            },
            total: {
                type: Number,
            },
            markAsCompleted: {
                type: Boolean,
                default: false
            },
            isBeingDispatchedInInvoice: {
                type: Boolean,
                default: false
            },
        },
    ],
    grandTotal: {
        type: Number,
    },
    discount : {
        type: Number,
    },
    gst : {
        type: Number,
    },
    otherExpenses : {
        type: Number,
    },
    totalBillingAmount : {
        type: Number,
    },
    currentTotal: {
        type: Number,
        // required: true,
        default: null
    },
    isCleared: {
        type: Boolean,
        default: false
    },
    isPaidToSupplier: {
        type: Boolean,
        default: false
    },
    invoiceDate: {
        type: String,
    },
    invoiceNo: {
        type: String,
    },
    balance : {
        type : Number,
        default : 0
    },
    // grandTotal: {
    //     type: Number,
    // },
    createdAt: {
        type: Date,
        default: Date.now(),
    },

})

const Invoice = models?.Invoices || model('invoices', InvoiceSchema);

export default Invoice; // Change this line to use default export

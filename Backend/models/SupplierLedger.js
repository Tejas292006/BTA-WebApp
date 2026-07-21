import mongoose from "mongoose";

const { model, models, Schema } = mongoose;

const supplierLedgerSchema = new Schema({
    supplierRef: {
        type: Schema.Types.ObjectId,
        ref: "suppliers",
    },

    paymentRef: {
        type: Schema.Types.ObjectId,
        ref: "Payment",
    },
    invoiceRef: {
        type: Schema.Types.ObjectId,
        ref: "invoices",
    },
    amount: {
        type: Number,
        required: true,
    },
    transactionType: {
        type: String,
        enum: ["invoice", "payment"],
        required: true
    },
    credit: {
        type: Number,
        default: 0
    },
    debit: {
        type: Number,
        default: 0
    },

    balance: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
})

supplierLedgerSchema.pre('save', function (next) {
    if (this.transactionType === "invoice") {
        this.credit = this.amount;
        this.balance = this.balance + this.amount;
    } else if (this.transactionType === "payment") {
        this.debit = this.amount;
        this.balance -= this.amount;
    }
    next();
});

const SupplierLedger = models?.SupplierLedger || model('SupplierLedger', supplierLedgerSchema);

export default SupplierLedger; // Change this line to use default export

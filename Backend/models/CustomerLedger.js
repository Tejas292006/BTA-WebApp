import mongoose from "mongoose";

const { model, models, Schema } = mongoose;

const customerLedgerSchema = new Schema({
    customerRef: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
    },

    paymentRef: {
        type: Schema.Types.ObjectId,
        ref: "Payment",
    },
    invoiceRef: {
        type: Schema.Types.ObjectId,
        ref: "invoices",
    },
    advancePaymentRef: {
        type: String, // New field to store the UUID
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

customerLedgerSchema.pre('save', function (next) {
    if (this.transactionType === "invoice") {
        this.debit = this.amount;
        this.balance = this.balance - this.amount;
    } else if (this.transactionType === "payment") {
        this.credit = this.amount;
        this.balance += this.amount;
    }
    next();
});

const CustomerLedger = models?.CustomerLedger || model('CustomerLedger', customerLedgerSchema);

export default CustomerLedger; // Change this line to use default export

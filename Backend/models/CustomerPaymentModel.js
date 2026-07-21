import mongoose, { Mongoose } from 'mongoose';

const CustomerPaymentSchema = new mongoose.Schema({

    customerRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    supplierRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'suppliers',
        required: true
    },
    paymentDate: {
        type: Date,
        required: true
    },
    amountEntered: {
        type: Number,
        required: true
    },
    paymentMode: {
        type: String,
        required: true
    },
    whomToPay: {
        type: String,
        enum: ['supplier', 'self'],
        required: true
    },
    chequeNumber: {
        type: String
    },
    adjustments: [{
        invoiceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'invoices',
            required: true
        },
        invoiceNo: String,
        adjust: Number,
        discount: Number,
        interest: Number,
        remaining: Number,
        balance : {
            type : Number,
            default: 0
        },
        whomToPay: {
            type: String,
            enum: ['supplier', 'self'],
            required: true
        },
    }],
    newReference: {
        currentBalance: Number,
        adjust: Number,
        newBalance: Number
    }

}, { timestamps: true });

const CustomerPayment = mongoose.model('CustomerPayment', CustomerPaymentSchema);

export default CustomerPayment;
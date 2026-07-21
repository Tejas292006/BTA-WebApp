import mongoose from "mongoose";

const { model, models, Schema } = mongoose;


const SupplierSchema = new Schema({
    name: {
        type: String,
        required: [true, "please provide name"]
    },
    brand: {
        type: String,
    },
    address: {
        type: String,
    },
    experienced: {
        type: Boolean,
        default: false,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    avatar: {
        type: String,
        default: "https://i.pinimg.com/564x/05/4c/b1/054cb148f9a8ef419b55166e0ce4dd64.jpg"
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },

})

const Supplier = models?.Suppliers || model('suppliers', SupplierSchema);

export default Supplier; // Change this line to use default export

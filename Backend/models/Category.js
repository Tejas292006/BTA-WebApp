import mongoose from "mongoose";

const { model, models, Schema } = mongoose;

const CategorySchema = new Schema({
    name: {
        type: String,
        required: [true, "please provide name"]
    },
    verified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },

})

const Category = models?.Categories || model('categories', CategorySchema);

export default Category; // Change this line to use default export

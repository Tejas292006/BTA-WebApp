import mongoose, { Mongoose } from "mongoose";

const { model, models, Schema } = mongoose;


const QualitySchema = new Schema({
    name: {
        type: String,
        required: [true, "please provide name"]
    },
    ref: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories' // The model this ObjectId refers to
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

const Quality = models?.Qualities || model('qualities', QualitySchema);

export default Quality; // Change this line to use default export

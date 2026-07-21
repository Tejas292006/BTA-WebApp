import mongoose from "mongoose";

const { model, models, Schema } = mongoose;


const CutSchema = new Schema({
    name: {
        type: String,
        required: [true, "cut not be empty"],
        minlength : [1,"mininum 1 character required"],
        validate: {
            validator:(value)=> {
              // Custom validator to check if the value is not an empty string
              return value.trim().length > 0;
            },
            message: 'Username cannot be an empty string'
          },
    },
    ref: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories' // The model this ObjectId refers to
    },
   
    isNameNumerical: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },

})

const Cut = models?.Cuts || model('Cut', CutSchema);

export default Cut; // Change this line to use default export

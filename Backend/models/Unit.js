import mongoose from "mongoose";

const { model, models, Schema } = mongoose;


const UnitSchema = new Schema({
    name: {
        type: String,
        required: [true, "unit not be empty"],
        minlength : [1,"mininum 1 character required"],
        validate: {
            validator:(value)=> {
              // Custom validator to check if the value is not an empty string
              return value.trim().length > 0;
            },
            message: 'Username cannot be an empty string'
          },
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

const Unit = models?.Units || model('Unit', UnitSchema);

export default Unit; // Change this line to use default export

import mongoose from "mongoose";

const { model, models, Schema } = mongoose;


const PaymentModeSchema = new Schema({
    name: {
        type: String,
        required: [true, "PaymentMode not be empty"],
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

const PaymentMode = models?.PaymentModes || model('PaymentMode', PaymentModeSchema);

export default PaymentMode; // Change this line to use default export

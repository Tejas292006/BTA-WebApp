import mongoose from "mongoose";

const { model, models, Schema } = mongoose;


const supplierBalanceSchema = new Schema({
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier', // Assuming you have a Supplier model
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  interest: {
    type: Number,
    default: 0
  }
});



const customerSchema = new Schema({
  name: {
    type: String,
    required: [true, "Customer not be empty"],
    minlength: [1, "mininum 1 character required"],
    validate: {
      validator: (value) => {
        // Custom validator to check if the value is not an empty string
        return value.trim().length > 0;
      },
      message: 'customer name cannot be an empty string'
    },
  },
  companyName: {
    type: String,
    required: [true, "company not be empty"],
    minlength: [1, "mininum 1 character required"],
    validate: {
      validator: (value) => {
        // Custom validator to check if the value is not an empty string
        return value.trim().length > 0;
      },
      message: 'company name cannot be an empty string'
    },
  },
  // ref: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'categories' // The model this ObjectId refers to
  // },

  // verified: {
  //     type: Boolean,
  //     default: false,
  // },
  supplierBalances: [supplierBalanceSchema],

  createdAt: {
    type: Date,
    default: Date.now(),
  },

})

const Customer = models?.Customers || model('Customer', customerSchema);

export default Customer; // Change this line to use default export

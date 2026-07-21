import mongoose from "mongoose";

const { model, models, Schema } = mongoose;


const AttributeValueSchema = new Schema({
   
        attributeRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Attribute' // The model this ObjectId refers to
        },
       valuesCombo : [{
          category : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'categories' // The model this ObjectId refers to
          },
          attributeValue : {
            type : String,
          },
          isNameNumerical: {
            type: Boolean,
            default: false,
          }
}],

    verified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },

})

const AttributeValue = models?.AttributeValues || model('AttributeValues', AttributeValueSchema);

export default AttributeValue; // Change this line to use default export

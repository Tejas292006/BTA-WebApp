// Backend - Product Model Schema
import mongoose from 'mongoose';
const { model, models, Schema } = mongoose;

const productSchema = new Schema({
    supplierName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "suppliers"
    },
    productName: {
        type: String,
        required: true
    },
 
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
        required: true
    },

    productAttributes: [
        {
            attrType : {
                // type : mongoose.Schema.Types.ObjectId,
                // required : true,
                // ref : "attributes"
                type : String,
                required : true,
            },
            attrValue : {
                type : String,
                // required : true
            },
        }
    ],
    productColorChartData : [
        {
            src : {
                type : String,
                required : true,
            }
        }
    ],

    pricePerUnit: {
        magnitude: {
            type: Number,
            required: true
        },
        unit: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Unit",
            required: true
        }
    },

});

const Product = models?.Product || model('Product', productSchema);

export default Product;

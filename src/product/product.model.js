import mongoose from 'mongoose';

const ProductSchema = mongoose.Schema({
    nameProduct:{
        type: String,
        required: [true, 'The name is required']
    },
    description:{
        type: String,
        required: [true, 'The description is required']
    },
    price:{
        type: Number,
        required: [true, 'The price is required']
    },
    category:{
        type: String,
        required: [true, 'The category is required']
    },
    stock:{
        type: Number,
        required: [true, 'The stock is required when creating a product']
    },
    totalSales:{
        type: Number
    },
    estado:{
        type: Boolean,
        default: true
    }
});

ProductSchema.methods.toJSON = function(){
    const{ __v, _id, ...product} = this.toObject();
    product.product_id = _id;
    return product;
};

export default mongoose.model('Product', ProductSchema);
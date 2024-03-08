import mongoose from 'mongoose';

const FacturaSchema = mongoose.Schema({
    date:{
        type: String,
        default: "0/0/0"
    },
    carritoCompra: [{
        product: {
            type: Schema.ObjectId,
            ref: 'Product',
            required: true
        },
        howManyProducts: {
            type: Number,
            required: true
        },
        subtotal: {
            type: Number,
            required: true  
        }
    }],
    userId:{
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
});

FacturaSchema.methods.toJSON = function(){
    const{ __v, _id, ...factura} = this.toObject();
    factura.FACTURA_id = _id;
    return factura;
};

export default mongoose.model('Factura', FacturaSchema);
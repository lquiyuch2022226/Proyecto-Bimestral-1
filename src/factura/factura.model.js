import mongoose from 'mongoose';

const FacturaSchema = mongoose.Schema({
    carritoWithProducts: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }
});

FacturaSchema.methods.toJSON = function(){
    const{ __v, _id, ...factura} = this.toObject();
    factura.FACTURA_id = _id;
    return factura;
};

export default mongoose.model('Factura', FacturaSchema);
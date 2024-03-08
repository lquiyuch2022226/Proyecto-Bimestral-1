import Factura from './factura.model.js';
import User from '../user/user.model.js';
import Product from '../product/product.model.js';
import { stockSuficiente } from '../helpers/db-validators.js';

export const agregarProductoAlCarrito = async (req, res) => {
    try {
        const { productName, howManyProducts } = req.body;
        const userId = req.usuario._id;

        const product = await Product.findOne({ nameProduct: productName });

        if (!product.estado) {
            res.status(400).json({
                msg: 'This product was deleted :('
            });
        }

        const validacionDeSuficienteStock = await stockSuficiente(productName, howManyProducts);

        if(!validacionDeSuficienteStock){
            return res.status(400).json({
                msg: `We don't have enough products to sell you. We only have | ${ product.stock } | products in stock.`
            });
        }

        let carrito = await Factura.findOne({ userId });

        if (!carrito) {
            const newCarrito = new Factura({
                carritoWithProducts: [{
                    product: product._id,
                    howManyProducts,
                    subtotal: product.price * howManyProducts
                }],
                userId
            });

            await newCarrito.save();
            carrito = newCarrito;
        } else {
            carrito.carritoWithProducts.push({
                product: product._id,
                howManyProducts,
                subtotal: product.price * howManyProducts
            });

            await carrito.save();
        }

        res.status(200).json({
            carrito
        });
    } catch (error) {
        console.log(error)
    }
}
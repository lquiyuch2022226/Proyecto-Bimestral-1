import Factura from './factura.model.js';
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

        if (!carrito || carrito.estado === "false") {
            console.log(!carrito.estado)
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
            const existingProductIndex = carrito.carritoWithProducts.findIndex(item => item.product.toString() === product._id.toString());
            if (existingProductIndex !== -1) {

                const totalHowManyProducts = carrito.carritoWithProducts[existingProductIndex].howManyProducts + parseInt(howManyProducts);
                const validacionDeSuficienteStockDespues = await stockSuficiente(productName, totalHowManyProducts);

                if (!validacionDeSuficienteStockDespues) {
                    return res.status(400).json({
                        msg: `We don't have enough products to sell you. We only have | ${product.stock} | products in stock.`
                    });
                }

                carrito.carritoWithProducts[existingProductIndex].howManyProducts += parseInt(howManyProducts);
                carrito.carritoWithProducts[existingProductIndex].subtotal += parseInt(howManyProducts) * product.price;
            } else {
                carrito.carritoWithProducts.push({
                    product: product._id,
                    howManyProducts,
                    subtotal: product.price * howManyProducts
                });
            }

            await carrito.save();
        }

        res.status(200).json({
            carrito
        });
    } catch (error) {
        console.log(error)
    }
}

export const facturasGet = async (req, res) => {
    const { limite, desde } = req.query;
    const userId = req.usuario._id;
    const query = { userId: userId, estado: true};

    const [total, facturas] = await Promise.all([
        Factura.countDocuments(query),
        Factura.find(query)
            .populate({
                path: 'carritoWithProducts.product',
                select: 'nameProduct price -_id'
            })
            .select('-estado')
            .select('-date')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        facturas
    });
}


export const pagarProductos = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.usuario._id;

        const carrito = await Factura.findById(id).populate('carritoWithProducts.product');

        for (const item of carrito.carritoWithProducts) {
            const product = item.product;
            const cantidadComprada = item.howManyProducts;

            product.stock -= cantidadComprada;
            product.totalSales += cantidadComprada;
            await product.save();
        }

        carrito.estado = 'false';
        await carrito.save();

        res.status(200).json({
            msg: 'Payment successful. Stock updated and sales recorded',
            carrito
        });

    } catch (error) {
        console.log(error)
        res.status(400).json( {error} );
    }
}

export const facturasGetByUser = async (req, res) => {
    const { limite, desde } = req.query;
    const userId = req.usuario._id;
    const query = { userId: userId, estado: false};

    const [total, facturas] = await Promise.all([
        Factura.countDocuments(query),
        Factura.find(query)
            .populate({
                path: 'carritoWithProducts.product',
                select: 'nameProduct price -_id'
            })
            .select('-estado')
            .select('-date')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        facturas
    });
}
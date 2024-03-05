import User from '../user/user.model.js';
import Product from './product.model.js';
import jwt from 'jsonwebtoken';

export const productPost = async (req, res) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const user = await User.findById(uid);

    if(user.role !== "ADMIN_ROLE"){
        return  res.status(400).json({
            msg: "You can't CREATE this PRODUCT because you aren't an ADMIN"
        });
    }

    const {nameProduct, description, price, category, stock} = req.body;
    const product = new Product( {nameProduct, description, price: parseInt(price), category, stock: parseInt(stock)} );

    await product.save();

    res.status(200).json({
        product
    });
}

export const productsGet = async (req, res) => {
    const {limite, desde} = req.query;
    const query = {estado: true};

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        products
    });
}

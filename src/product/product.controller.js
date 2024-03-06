import Product from './product.model.js';
import Category from '../category/category.model.js';

export const productPost = async (req, res) => {
    const {nameProduct, description, price, category, stock} = req.body;

    const categoryFound = await Category.findOne({ nameCategory: category });

    const product = new Product( {nameProduct, description, price: parseInt(price), category: categoryFound._id, stock: parseInt(stock)} );

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

import Product from './product.model.js';
import Category from '../category/category.model.js';

export const productPost = async (req, res) => {
    const { nameProduct, description, price, category, stock } = req.body;

    const categoryFound = await Category.findOne({ nameCategory: category });

    const product = new Product({ nameProduct, description, price: parseInt(price), category: categoryFound._id, stock: parseInt(stock), totalSales: 0 });

    await product.save();

    res.status(200).json({
        product
    });
}

export const productsGet = async (req, res) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate({
                path: 'category',
                select: 'nameCategory description -_id'
            })
            .select('-estado')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        products
    });
}

export const productGetByName = async (req, res) => {
    const { name } = req.params;
    const product = await Product.findOne({ nameProduct: name });

    if (!product.estado) {
        res.status(400).json({
            msg: 'This product was deleted :('
        });
    }

    res.status(200).json({
        product
    });
}

export const productPut = async (req, res) => {
    const { name } = req.params;
    const { _id, estado, category, ...resto } = req.body;

    const producto = await Product.findOne({ nameProduct: name });

    if (!producto.estado) {
        return res.status(400).json({
            msg: "This PRODUCT don't exists because was deleted",
        });
    }

    const productoActualizado = await Product.findByIdAndUpdate(producto._id, resto, { new: true });

    res.status(200).json({
        msg: 'This PRODUCT was UPDATED:',
        productoActualizado
    });
}

export const productDelete = async (req, res) => {
    const { name } = req.params;

    const producto = await Product.findOne({ nameProduct: name });

    if (!producto.estado) {
        return res.status(400).json({
            msg: "This PRODUCT don't exists because was deleted",
        });
    }

    const productoEliminado = await Product.findByIdAndUpdate(producto._id, { estado: false });

    const usuarioAutenticado = req.usuario;

    res.status(200).json({
        msg: 'This PRODUCT was DELETED:',
        productoEliminado,
        usuarioAutenticado
    });
}


export const productsInventory = async (req, res) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .select('-description')
            .select('-estado')
            .select('-category')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        products
    });
}

export const productsOutOfStock = async (req, res) => {
    const { limite, desde } = req.query;
    const query = { estado: true, stock: 0 };

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate({
                path: 'category',
                select: 'nameCategory description -_id'
            })
            .select('-estado')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        products
    });
}

export const productsMostSelled = async (req, res) => {
    const { limite, desde } = req.query;
    const query = { estado: true, totalSales: { $ne: 0 } };

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate({
                path: 'category',
                select: 'nameCategory description -_id'
            })
            .select('-estado')
            .sort({ totalSales: 1 })
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        products
    });
};

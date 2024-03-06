import User from '../user/user.model.js';
import Category from './category.model.js';
import jwt from 'jsonwebtoken';

export const categoryPost = async (req, res) => {
    const {nameCategory, description} = req.body;
    const category = new Category( {nameCategory, description} );

    await category.save();

    res.status(200).json({
        category
    });
}

export const categoriesGet = async (req, res) => {
    const {limite, desde} = req.query;
    const query = {estado: true};

    const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        categories
    });
}

export const categoryPut = async (req, res = response) =>{
    const { id } = req.params;
    const {_id, estado, ...resto } = req.body;

    const categoriaActualizado = await Category.findByIdAndUpdate(id, resto, { new: true });

    res.status(200).json({
        msg: 'This CATEGORY was UPDATED:',
        categoriaActualizado
    });

}


export const categoryDelete = async (req, res) => {
    const {id} = req.params;
    const category = await Category.findByIdAndUpdate(id, {nameCategory: "Default Product", description: "A default product", estado: false});
    const usuarioAutenticado = req.usuario;

    res.status(200).json({
        msg: 'This CATEGORY was DELETED:',
        category,
        usuarioAutenticado
    });
}
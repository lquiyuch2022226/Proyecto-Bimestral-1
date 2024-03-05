import User from '../user/user.model.js';
import Category from './category.model.js';
import jwt from 'jsonwebtoken';

export const categoryPost = async (req, res) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const user = await User.findById(uid);

    if(user.role !== "ADMIN_ROLE"){
        return  res.status(400).json({
            msg: "You can't CREATE this CATEGORY because you aren't an ADMIN"
        });
    }

    const {nameCategory, description} = req.body;
    const category = new Category( {nameCategory, description} );

    await category.save();

    res.status(200).json({
        category
    });
}

export const categoriesGet = async (req, res) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const user = await User.findById(uid);

    if(user.role !== "ADMIN_ROLE"){
        return  res.status(400).json({
            msg: "You can't GET these CATEGORIES because you aren't an ADMIN"
        });
    }

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
    const { role: authUser } = req.user;
    const user = await User.findById(uid);

    if(authUser !== "ADMIN_ROLE"){
        return res.status(400).json({
            msg: "You can't DELETE this user because you aren't a ADMIN"
        });
    }

    const { id } = req.params;
    const {_id, estado, ...resto } = req.body;

    const categoriaActualizado = await Category.findByIdAndUpdate(id, resto, { new: true });

    res.status(200).json({
        msg: 'This category was UPDATED:',
        categoriaActualizado
    });

}


export const categoryDelete = async (req, res) => {
    const { role: authUser } = req.user;
    const user = await User.findById(uid);

    if(authUser !== "ADMIN_ROLE"){
        return res.status(400).json({
            msg: "You can't DELETE this user because you aren't a ADMIN"
        });
    }

    const {id} = req.params;
    const category = await Category.findByIdAndUpdate(id, {estado: false});
    const usuarioAutenticado = req.usuario;

    res.status(200).json({
        msg: 'This user was DELETED:',
        usuario,
        usuarioAutenticado
    });
}
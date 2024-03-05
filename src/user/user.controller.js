import bcryptjs from 'bcryptjs';
import User from './user.model.js';
import jwt from 'jsonwebtoken';
import { response } from 'express';

export const usuarioPost = async (req, res) => {
    console.log(req.body, 'xd');
    const {nombre, correo, password, role} = req.body;
    const usuario = new User( {nombre, correo, password, role} );
   
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save();

    res.status(200).json({
        usuario
    });
}

export const usuariosGet = async (req, res = response) => {
    const {limite, desde} = req.query;
    const query = {estado: true};

    const [total, usuarios] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        usuarios
    });
}

export const getUsuarioById = async (req, res) => {
    const {id} = req.params;
    const usuario = await User.findOne({_id: id});

    res.status(200).json({
        usuario
    });
}

export const putUsuarios = async (req, res = response) =>{
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    const user = await User.findById(uid);

    if(user.role !== "ADMIN_ROLE"){
        return  res.status(400).json({
            msg: "You can't EDIT this user because you aren't a ADMIN"
        });
    }

    const { id } = req.params;
    const {_id, password, google, correo, ...resto } = req.body;

    if(password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuarioActualizado = await User.findByIdAndUpdate(id, resto, { new: true });

    res.status(200).json({
        msg: 'El siguiente usuario fue actualizado:',
        usuarioActualizado
    });

}

export const usuariosDelete = async (req, res) => {

    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    const user = await User.findById(uid);

    if(user.role !== "ADMIN_ROLE"){
        return res.status(400).json({
            msg: "You can't DELETE this user because you aren't a ADMIN"
        });
    }

    const {id} = req.params;
    const usuario = await User.findByIdAndUpdate(id, {estado: false});
    const usuarioAutenticado = req.usuario;

    res.status(200).json({
        msg: 'El siguiente usuario fue ELIMINADO:',
        usuario,
        usuarioAutenticado
    });
}
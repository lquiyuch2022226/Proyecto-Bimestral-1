import bcryptjs from 'bcryptjs';
import User from './user.model.js';
import { response } from 'express';

export const usuarioPost = async (req, res) => {
    const {nombre, correo, password} = req.body;
    const usuario = new User( {nombre, correo, password} );
   
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
    const { id } = req.params;
    const {_id, password, google, correo, ...resto } = req.body;

    if(password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuarioActualizado = await User.findByIdAndUpdate(id, resto, { new: true });

    res.status(200).json({
        msg: 'This user was UPDATED:',
        usuarioActualizado
    });

}

export const usuariosDelete = async (req, res) => {
    const {id} = req.params;
    const usuario = await User.findByIdAndUpdate(id, {estado: false});
    const usuarioAutenticado = req.usuario;

    res.status(200).json({
        msg: 'This user was DELETED:',
        usuario,
        usuarioAutenticado
    });
}
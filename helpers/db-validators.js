const Role = require('../models/role');
const Usuario = require('../models/usuario');

const existenteEmail = async (correo = '') => {
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){
        throw new Error(`El correo ${ correo } ya está registrado`);
    }
}

const existeUsuarioById = async (id = '') => {
    const existeUsuario = await Usuario.findOne({id});
    if(existeUsuario){
        throw new Error(`El usuario con el ${ id } no existe`)
    }
}

module.exports = {
    esRoleValido,
    existenteEmail,
    existeUsuarioById
}
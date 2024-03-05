import User from '../user/user.model.js';

export const esRoleValido = async (role = '') => {
    if (role !== "ADMIN_ROLE" && role !== "CLIENT_ROLE"){
        throw new Error(`This role is invalid, try another one`);
    }
}

export const existenteEmail = async (correo = '') => {
    const existeEmail = await User.findOne({correo});
    if(existeEmail){
        throw new Error(`The email: ${ correo } is already in use`);
    }
}

export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await User.findById(id);
    if(!existeUsuario){
        throw new Error(`A user with this iD: ${ id } don't exists in database`);
    }
}
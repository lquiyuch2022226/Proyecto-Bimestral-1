import User from '../user/user.model.js';
import Product from '../product/product.model.js';

export const esRoleValido = async (role = '') => {
    if (role !== "ADMIN_ROLE" && role !== "CLIENT_ROLE"){
        throw new Error(`This role is invalid, try another one`);
    }
}

export const esRoleAdmin = async (role = '') => {
    if (role !== "ADMIN_ROLE"){
        throw new Error(`You can't do this action because you aren't a ADMIN`);
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

export const existeProducto = async (nameProduct ='') =>{
    const existeProducto = await Product.findOne({nameProduct});
    if(existeProducto){
        throw new Error(`A product with this name: ${nameProduct} is already in use`);
    }
}
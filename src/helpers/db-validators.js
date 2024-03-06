import User from '../user/user.model.js';
import Product from '../product/product.model.js';
import Category from '../category/category.model.js';

// VALIDACION DE ROLE
export const esRoleValido = async (role = '') => {
    if (role !== "ADMIN_ROLE" && role !== "CLIENT_ROLE"){
        throw new Error(`This role is invalid, try another one`);
    }
}

//EXISTE POR ALGUN ATRIBUTO

//user
export const existenteEmail = async (correo = '') => {
    const existeEmail = await User.findOne({correo});
    if(existeEmail){
        throw new Error(`The email: | ${ correo } | is already in use`);
    }
}

//producto
export const existeProducto = async (nameProduct ='') =>{
    const existeProducto = await Product.findOne({nameProduct});
    if(existeProducto){
        throw new Error(`A product with this name: | ${nameProduct} | is already in use, try with other name`);
    }
}

export const asignarCategoria = async (nameCategory ='') =>{
    const existeCategoria = await Category.findOne({nameCategory});
    if(!existeCategoria){
        throw new Error(`This category: | ${nameCategory} | don't exist in database, try other name of category`);
    }
}


//categoria
export const existeCategoriaByName = async (nameCategory ='') =>{
    const existeCategoria = await Category.findOne({nameCategory});
    if(existeCategoria){
        throw new Error(`A product with this name: | ${nameCategory} | is already in use, try with other name`);
    }
}

// EXISTE POR ID
export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await User.findById(id);
    if(!existeUsuario){
        throw new Error(`A user with this iD: | ${ id } | don't exists in database`);
    }
}

export const existeCategoriaById = async (id = '') =>{
    const existeCategoria = await Category.findById(id);
    if(!existeCategoria){
        throw new Error(`A category with this ID: | ${ id } | don't exists in database`);
    }
}


//VALIDACION STOCK, PRICE and totalSales
export const stockPositivo = async (stock = '')=>{
    if(stock < 0){
        throw new Error(`The stock can't be negative, plis change it`);
    }
}

export const pricePositivo = async (price = '')=>{
    if(price < 0){
        throw new Error(`The price can't be negative, plis change it`);
    }
}

import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { existeProducto } from '../helpers/db-validators.js';

import{ 
    productPost,
    productsGet
} from '../product/product.controller.js'

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        check('nameProduct', 'The name of the product is required').not().isEmpty(),
        check('nameProduct').custom(existeProducto),
        check('description', 'The description of the product is required').not().isEmpty(),
        check('price', 'The price of the product is required').not().isEmpty(),
        check('category', 'The category of the product is required').not().isEmpty(),
        check('stock', 'The stock of the product is required').not().isEmpty(),
        validarCampos
    ], productPost
);

router.get( "/", productsGet);

export default router;
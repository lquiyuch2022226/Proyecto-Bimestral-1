import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { existeProducto, asignarCategoria, stockPositivo, pricePositivo} from '../helpers/db-validators.js';
import { esRole } from '../middlewares/validar-roles.js';

import{ 
    productPost,
    productsGet
} from '../product/product.controller.js'

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        esRole("ADMIN_ROLE"),
        check('nameProduct', 'The name of the product is required').not().isEmpty(),
        check('nameProduct').custom(existeProducto),
        check('description', 'The description of the product is required').not().isEmpty(),
        check('price', 'The price of the product is required').not().isEmpty(),
        check('price').custom(pricePositivo),
        check('category', 'The category of the product is required').not().isEmpty(),
        check('category').custom(asignarCategoria),
        check('stock', 'The stock of the product is required').not().isEmpty(),
        check('stock').custom(stockPositivo),
        validarCampos
    ], productPost
);

router.get( "/", productsGet);

router.get(
    "/:name", 
    [
        validarJWT,
        esRole("ADMIN_ROLE"),
    ],
    productsGet);

export default router;
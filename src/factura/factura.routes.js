import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { stockPositivo, pricePositivo, esProductoValido} from '../helpers/db-validators.js';
import { esRole } from '../middlewares/validar-roles.js';

import {
    agregarProductoAlCarrito,
} from '../factura/factura.controller.js'

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        esRole("CLIENT_ROLE"),
        check('productName', 'The name of the product is required').not().isEmpty(),
        check('productName').custom(esProductoValido),
        check('howManyProducts', 'The quantity of products is required').not().isEmpty(),
        validarCampos
    ], agregarProductoAlCarrito
);

export default router;
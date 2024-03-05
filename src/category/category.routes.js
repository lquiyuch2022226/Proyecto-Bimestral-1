import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { existeCategoriaByName, existeCategoriaById} from '../helpers/db-validators.js';
import { esRole } from '../middlewares/validar-roles.js';

import {
    categoryPost,
    categoriesGet,
    categoryPut,
    categoryDelete
} from '../category/category.controller.js'

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        esRole("ADMIN_ROLE"),
        check('nameCategory', 'The name of the product is required').not().isEmpty(),
        check('nameCategory').custom(existeCategoriaByName),
        check('description', 'The description of the product is required').not().isEmpty(),
        validarCampos
    ], categoryPost
);

router.get( "/", [ validarJWT, esRole("ADMIN_ROLE") ], 
    categoriesGet);

router.put(
    "/",
    [
        validarJWT,
        esRole("ADMIN_ROLE"),
        check('id', 'Invalid Id').isMongoId(),
        check('id').custom(existeCategoriaById),
        check('nameCategory').custom(existeCategoriaByName),
        validarCampos
    ], categoryPut
);

router.delete(
    "/",
    [
        validarJWT,
        esRole("ADMIN_ROLE"),
        check('id', 'Invalid Id').isMongoId(),
        check('id').custom(existeCategoriaById),
        validarCampos
    ], categoryDelete
);

export default router;

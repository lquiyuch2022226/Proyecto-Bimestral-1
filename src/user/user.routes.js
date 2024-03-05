import { Router } from 'express';
import { check } from 'express-validator';

import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from'../middlewares/validar-jwt.js';

import { 
    usuarioPost,
    usuariosGet, 
    getUsuarioById,
    putUsuarios,
    usuariosDelete} from '../user/user.controller.js';

import { esRoleValido, existenteEmail, existeUsuarioById } from '../helpers/db-validators.js';

const router = Router();

router.post(
    "/",
    [
        check("nombre", "The name is required").not().isEmpty(),
        check("password","The password is required").not().isEmpty(),
        check("password","The password needs a minimun of 6 characters").isLength({min:6}),
        check("correo","Invalid email").isEmail(),
        check("correo").custom(existenteEmail),
        check("role").custom(esRoleValido),
        validarCampos
    ], usuarioPost);

router.get("/", usuariosGet);

router.get(
    "/:id",
    [
        check('id', 'Invalid id').isMongoId(),
        check('id').custom(existeUsuarioById),
        validarCampos
    ], getUsuarioById);

router.put(
    "/:id",
    [
        validarJWT,
        check('id', 'Invalid id').isMongoId(),
        check('id').custom(existeUsuarioById),
        check("role").custom(esRoleValido),
        validarCampos
    ], putUsuarios);



router.delete(
    "/:id",
    [   
        validarJWT,
        //tieneRolAutorizado('ADMIN_ROLE','SUPER_ROLE'),
        check('id', 'Invalid Id').isMongoId(),
        check('id').custom(existeUsuarioById),
        validarCampos
    ], usuariosDelete);

export default router;
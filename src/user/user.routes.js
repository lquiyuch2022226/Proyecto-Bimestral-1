import { Router } from 'express';
import { check } from 'express-validator';

import { validarCampos } from'../middlewares/validar-campos.js';
import { validarJWT } from'../middlewares/validar-jwt.js';

import { 
    usuariosPost,
    usuariosGet, 
    getUsuarioById,
    putUsuarios,
    usuariosDelete} from '../user/user.controller.js';

import { existenteEmail, existeUsuarioById } from '../helpers/db-validators.js';

const router = Router();

router.post(
    "/",
    [
        check("nombre", "El nombre no puede estar vacío").not().isEmpty(),
        check("password","El password debe ser mayor a 6 caracteres").isLength({min:6}),
        check("correo","Este no es un correo válido").isEmail(),
        check("correo").custom(existenteEmail),
        //check("role").custom(esRoleValido),
        validarCampos,
    ], usuariosPost);

router.get("/", usuariosGet);

router.get(
    "/:id",
    [
        check('id', 'No es un id válido').isMongoId(),
        check('id').custom(existeUsuarioById),
        validarCampos
    ], getUsuarioById);

router.put(
    "/:id",
    [
        check('id', 'No es un id válido').isMongoId(),
        check('id').custom(existeUsuarioById),
        validarCampos
    ], putUsuarios);



router.delete(
    "/:id",
    [   
        validarJWT,
        //tieneRolAutorizado('ADMIN_ROLE','SUPER_ROLE'),
        check('id', 'No es un id válido').isMongoId(),
        check('id').custom(existeUsuarioById),
        validarCampos
    ], usuariosDelete);

export default router;
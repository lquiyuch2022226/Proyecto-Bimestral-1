import { Router } from 'express';
import { check } from 'express-validator';

import { login } from '../controllers/auth.controller';
import { validarCampos } from '../middlewares/validar-campos';

const router = Router();

router.post(
    '/login',
    [
        check('correo', "Este no es un correo válido").isEmail(),
        check('password'," el password es obligatorio").not().isEmpty(),
        validarCampos
    ], login);

export default router;
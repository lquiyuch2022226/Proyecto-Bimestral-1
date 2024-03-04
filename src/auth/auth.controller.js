import Usuario from '../user/user.model.js';
import bycryptjs from 'bcryptjs';
import { generarJWT } from '../helpers/generar-jwt.js'


export const login = async (req, res) => {
    const { correo, password } = req.body;

    try{
        const usuario = await Usuario.findOne({correo});

        if(!usuario){
            return res.status(400).json({
                msg: "Credenciales incorrectas, correo no existe en la base de datos."
            });
        }

         if(!usuario.estado){
            return res.status(400).json({
                msg: "User do not exist in database"
            });
         };

         const validarPassword = bycryptjs.compareSync(password, usuario.password);
         if(!validarPassword){
            return res.status(400).json({
                msg: "La contraseña es incorrecta"
            })
         }

         const token = await generarJWT(usuario.id);

         res.status(200).json({
            msg: "Welcome",
            usuario,
            token
         });

    }catch(e){
        console.log(e);
        res.status(500).json({
            msg: "Comuniquese con el administrador"
        });
    };

};
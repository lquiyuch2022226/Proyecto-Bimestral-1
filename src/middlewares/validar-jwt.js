import jwt from 'jsonwebtoken';
import Usuario from '../user/user.model.js';

export const validarJWT = async(req = request, res = response, next)=> {
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'There is token in the request (header)',
        });
    }

    try{
        //verificación del Token
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        //leer usurio al que le corresponde ese uid
        const usuario = await Usuario.findById(uid);
        //verificar que el usuario exista
        if(!usuario){
            return res.status(401).json({
                msg: "The token has a user that don't exists in database"
            });
        }

        if(!usuario.estado){
            return res.status(401).json({
                msg: "NO valid token, User with estado: (false)"
            });
        }

        req.usuario = usuario;
        next();
        
    }catch(e){
        console.log(e);
        res.status(401).json({
            msg: "Invalid token, try another one"
        })
    }
}
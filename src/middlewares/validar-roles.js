export const esRole  = (...roles) =>{
    return (req, res, next) => {
        if(!req.usuario){
            return res.status(500).json({
                msg: 'You want to verify a role without validating the token first'
            })
        }

        if(!roles.includes(req.usuario.role)){
            return res.status(401).json({
                msg: `User can't do this, you have role: ${req.usuario.role}, and the roles can do this are: ${ roles }`
            })
        }

        next()
    }
}
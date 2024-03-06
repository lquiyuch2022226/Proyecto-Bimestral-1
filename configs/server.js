'use strict'

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import User from '../src/user/user.model.js'
import bcryptjs from 'bcryptjs';
import userRoutes from '../src/user/user.routes.js';
import authRoutes from '../src/auth/auth.routes.js';
import productRoutes from '../src/product/product.routes.js'
import categoryRoutes from '../src/category/category.routes.js'

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.userPath = '/ventasApi/v1/user'
        this.authPath = '/ventasApi/v1/auth'
        this.productPath = '/ventasApi/v1/product'
        this.categoryPath = '/ventasApi/v1/category'

        this.middlewares();
        this.conectarDB();
        this.routes();
        this.createAdminUser();
    }

    async conectarDB(){
        await dbConnection();
    }

    async createAdminUser(){
        const existeAdminUser = await User.findOne({ role: 'ADMIN_ROLE' });
        
        if (!existeAdminUser) {
            const userAdmin = {
                nombre: 'admin',
                correo: 'admin@gmail.com',
                password: '123456',
                role: 'ADMIN_ROLE',
            };

            const salt = bcryptjs.genSaltSync();
            userAdmin.password = bcryptjs.hashSync(userAdmin.password, salt);

            const user = new User(userAdmin);
            await user.save();
        }
    }

    middlewares(){
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    routes(){
        this.app.use(this.userPath, userRoutes);
        this.app.use(this.authPath, authRoutes);
        this.app.use(this.productPath, productRoutes);
        this.app.use(this.categoryPath, categoryRoutes);
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log('Server running on port: ', this.port);
        });
    }
}

export default Server;
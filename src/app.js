import express from 'express'
import morgan from 'morgan'
import authRoutes from './routers/auth.routes'
import userRoutes from './routers/user.routes'
import archRoutes from './routers/archivo.routes'
import corrRoutes from './routers/correo.routes'

const app=express();
var cors=require('cors');
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.get('/',function(req,res,next){
    res.send('Bienvenido a Node JS ....');
});

app.use('/api/auth',authRoutes);
app.use('/api/auth/users', userRoutes);
app.use('/api/auth/correos', corrRoutes)
app.use('/api/auth/archivos', archRoutes)
export default app;
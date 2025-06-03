import express from 'express';
import router from './router';
import db from './config/db';

async function connectDB() {
    try {
        await db.authenticate();
        db.sync()
        console.log('Conexión exitosa a la base de datos');
    } catch (error) {
        console.log('Error al conectarse con la BS:');
        console.log(error);
    }
}
connectDB()

const server = express();

server.use(express.json()) 

server.use('/api/products', router)
export default server;


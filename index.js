import express from 'express';
import { create } from 'express-handlebars';
import Jimp from 'jimp';
import { v4 as uuidv4 } from 'uuid';
import bodyParser from 'body-parser';
import * as path from "path";
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));


const hbs = create({
	partialsDir: ["views"],
    defaultLayout: false
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Ruta raíz que renderiza el formulario HTML usando Handlebars
app.get('*', (req, res) => {
    res.render('home');
});

// Ruta para procesar la imagen
app.post('/procesar', async (req, res) => {
    const imagenUrl = req.body.ruta;
    
    try {
        const imagen = await Jimp.read(imagenUrl);
        imagen.resize(350, Jimp.AUTO).greyscale();
        
        const nombre = `${uuidv4()}.jpg`;
        await imagen.writeAsync(__dirname + `/public/assets/${nombre}`);
        
        res.render('home', { imagenUrl: `/assets/${nombre}` });
    } catch (error) {
        console.log('Error procesando la imagen:', error);
        res.status(500).send('Hubo un error al procesar la imagen.');
    }
});


app.listen( 3000, ()=> console.log('Servidor arriba en el puerto 3000'))


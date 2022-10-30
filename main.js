const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const path = require('path');
const albumRoutes = require('./routes/album.routes');

const app = express();
// Ajout gestion requetes POST
app.use(express.urlencoded ({extended:false}));
// permet de décoder du JSON
app.use(express.json());
//middleware de gestion d'envoie de fichiers
app.use(fileUpload());

mongoose.connect('mongodb://127.0.0.1:27017/phototheque');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.static('public'));

app.set('trust proxy',1);
app.use(session({
    secret:'sQrTfE2fbYnTngFaqUCOhCkmIflU3JBP',
    resave:false,
    saveUninitialized:true
}));

// middleware d'envoie d'infos
app.use(flash());

// Renvoi vers fichier de mapage des routes
app.use('/',albumRoutes);

// creation de la reponse 404
app.use((req, res)=>{
    res.status(404);
    res.send('page non trouvée');
});

app.use((err,req,res,next)=>{
    console.log(err);
    res.status(500);
    res.send('°,...,° Serveur en orbite, de retour à la prochaine lune :D');
})

app.listen(3500,()=>{
    console.log('Application lancée sur le port 3500');
});
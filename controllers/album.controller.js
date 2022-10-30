const albumRepo = require('../models/Album');
const path = require('path');
const fs = require('fs');
const catchAsync = require('../helpers/catchAsync');

const listeAlbum = catchAsync(async(req,res)=>{
    const datas = await albumRepo.find();
    res.render('albums',{title:'Tout les albums', datas});
});

const createAlbumForm = (req, res)=>{
    res.render('new-album',{title:'Creation d\'un album',error:req.flash('error')})
};

const createAlbum = catchAsync(async(req,res)=>{
    const form = req.body;
    try {
        await albumRepo.create({
            title:form.albumTitle
        });
        res.redirect('/');
    }catch(err){
        req.flash('error', 'Erreur lors de la création de l\'album');
        res.redirect('/create');
    }
});

const showOneAlbum = catchAsync(async(req,res)=>{
    try{
        const id = req.params.id;
        data = await albumRepo.findById(id);
        res.render('album',{title:`Album ${data.title}`,data,error:req.flash('error')});
    }catch(err){
        console.log(err);
        res.redirect('/404');
    }
});

const addImage = catchAsync(async(req,res)=>{
    const album = await albumRepo.findById(req.params.id);
    // Vérification présence fichier, existance du chemin de stockage vers l'album et deplacement de l'image
    if(!req?.files?.image){
        req.flash('error', 'Aucune image insérée');
        res.redirect(`/album/${album._id}`);
        return;
    }

    const image = req.files.image;

    if(image.mimetype != 'image/jpeg' && image.mimetype != 'image/png'){
        req.flash('error', 'Image acceptée : png ou jpeg');
        res.redirect(`/album/${album._id}`);
        return;
    }
    if(image.size > 2000000){
        req.flash('error', 'Taille maximum acceptée : 2 Mo');
        res.redirect(`/album/${album._id}`);
        return;
    }
    const localPathToFolder = path.join(__dirname,'../public/uploads', req.params.id);
    if(!fs.existsSync(localPathToFolder)){
        fs.mkdirSync(localPathToFolder,{recursive:true});
    }
    const localPathToFile = path.join(localPathToFolder, image.name);
    if(!fs.existsSync(localPathToFile)){
        await image.mv(localPathToFile);
        album.images = [...album.images, image.name];
        await album.save();
    }else{
        req.flash('error', 'L\'image est déjà présente sur le serveur');
        res.redirect(`/album/${album._id}`);
        return;
    }

    res.redirect(`/album/${album._id}`);
});

const eraseOneAlbum = catchAsync(async(req,res)=>{
    const id = req.params.id;
    await albumRepo.deleteOne({_id:id});
    const localPathToFolder = path.join(__dirname,'../public/uploads', id);
    await fs.rmSync(localPathToFolder,{recursive:true,force:true});
    res.redirect('/');
});

const removeImage = catchAsync(async(req,res)=>{
    const id = req.params.id;
    const imageName = req.params.imageName;
    const album = await albumRepo.findById(id);
    album.images = album.images.filter(data=>data != imageName);
    album.save();
    const localPathToFile = path.join(__dirname,'../public/uploads', id,imageName);
    if(fs.existsSync(localPathToFile)){
        await fs.rmSync(localPathToFile);
    }
    res.redirect(`/album/${album._id}`);
});

module.exports ={createAlbumForm,createAlbum,showOneAlbum, listeAlbum, eraseOneAlbum, addImage, removeImage};
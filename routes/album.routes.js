const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album.controller');


router.get('/',albumController.listeAlbum);

router.get('/erase/:id',albumController.eraseOneAlbum);

// renvoi vers les méthodes dédiées des controlleurs
router.get('/create',albumController.createAlbumForm);

router.post('/create',albumController.createAlbum);

router.get('/album/:id',albumController.showOneAlbum);

router.post('/album/:id',albumController.addImage);

router.get('/editCollection/:id/:imageName',albumController.removeImage);

module.exports = router;
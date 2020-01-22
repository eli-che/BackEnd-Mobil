const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
// Snow-flake generation, time sortable.
const { simpleflake } = require('simpleflakes');
// DB Config
const client = require('../config/keys');
//Image
const path = require('path')
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },

    filename: function(req, file, cb){
        cb(null, simpleflake().toString() + path.extname(file.originalname))
    }
});

const fileFilter = function(req, file, cb) {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png')
    {
    // Accept file
    cb(null, true);
    } else {
    // Reject file
    cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
    fileSize: 1024 * 1024 * 100
    },
    fileFilter: fileFilter
});

router.post('/upload', ensureAuthenticated, upload.single('media'), function (req, res) {
   // console.log(req.file);
  // Example to retrive data from form  console.log(req.body.title); 
  var mediaid = "https://image.shutterstock.com/image-vector/diverse-multiracial-multicultural-group-people-260nw-1303850926.jpg"
    const query = 'INSERT INTO media (mediaid) VALUES (?) IF NOT EXISTS';
    client.execute(query, [mediaid], { prepare: true }, function(err, result) {
              


    });
    return res.send({status: true, msg: 'Media Uploaded'});
});


router.get('/media', ensureAuthenticated, function (req, res) {
    const query = 'select mediaid from media';
    client.execute(query, { prepare: true }, function(err, result) {
                return res.send(result.rows);          
    });

});

module.exports = router;
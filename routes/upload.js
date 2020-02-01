const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
// Snow-flake generation, time sortable.
const { simpleflake } = require('simpleflakes');
// DB Config
const pg_client = require('../config/pgkeys')
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

//router.post('/upload', ensureAuthenticated, upload.single('media'), function (req, res) {

router.post('/upload', ensureAuthenticated, function (req, res) {
    const {content, country, state, city} = req.body;

    const query = {
        name: 'upload-media',
        text: 'INSERT INTO mediapost (username, postid, contents, image, created_at, country, states, city, likes, coments) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
        values: [req.user.username, simpleflake().toString(), content, "tobeimageurl.com", Date.now(), country, state, city, 0, 0],
      }
    pg_client.query(query, function(err, result) { 
        if (err){
            return res.send({status: false, msg: 'Something went wrong uploading'});
        }
        else {
            return res.send({status: true, msg: 'Media Uploaded!'});
        }
    });
  
});


router.post('/media', ensureAuthenticated, function (req, res) {
    var {citycursor, statecursor, countrycursor, allcursor, country, state, city} = req.body;
    if (citycursor == 0){citycursor = 8999999999999999999;}
    if (statecursor == 0){statecursor = 8999999999999999999;}
    if (countrycursor == 0){countrycursor = 8999999999999999999;}
    if (allcursor == 0){allcursor = 8999999999999999999;}

    //Search City
    const query = {
        name: 'get-media-city',
        text: 'select * from mediapost where postid < $1 and country = $2 and states = $3 and city = $4 ORDER BY postid DESC LIMIT 6',
        values: [citycursor, country, state, city]
        }
    pg_client.query(query, function(err, result) { 
        if (err){
            console.log(err);
            return res.send({status: false, msg: 'Something went wrong retriving media 1'});
        } 
        else {

            if (result.rowCount > 5) {
                //More than 3 posts available
                // Get the cursor here for city and return it.
            return res.send(result.rows);
            } 
            else {
                //Search State
                //Less than 3 posts available
                const query = {
                    name: 'get-media-state',
                    text: 'select * from mediapost where postid < $1 and country = $2 and states = $3 and city <> $4 ORDER BY postid DESC LIMIT 6',
                    values: [statecursor, country, state, city]
                    }
                pg_client.query(query, function(err, result) {
                    if (err){
                        console.log(err);
                        return res.send({status: false, msg: 'Something went wrong retriving media 2'});
                    }

                    else { 
                        if (result.rowCount > 5) {
                        return res.send(result.rows);
                        }
                        else {
                            //Search country
                            const query = {
                                name: 'get-media-country',
                                text: 'select * from mediapost where postid < $1 and country = $2 and states <> $3 and city <> $4 ORDER BY postid DESC LIMIT 6',
                                values: [countrycursor, country, state, city]
                                }
                                pg_client.query(query, function(err, result) {
                                    if (err){
                                        console.log(err);
                                        return res.send({status: false, msg: 'Something went wrong retriving media 3'});
                                    }
                                    else {
                                        if (result.rowCount > 5) {
                                        return res.send(result.rows);
                                        }
                                        else {
                                            //Search world
                                            const query = {
                                                name: 'get-media-all',
                                                text: 'select * from mediapost where postid < $1 and country <> $2 and states <> $3 and city <> $4 ORDER BY postid DESC LIMIT 6',
                                                values: [countrycursor, country, state, city]
                                                }
                                                pg_client.query(query, function(err, result) {
                                                    if (err){
                                                        console.log(err);
                                                        return res.send({status: false, msg: 'Something went wrong retriving media 4'});
                                                    }
                                                    else { 
                                                        if (result.rowCount > 5) {
                                                            return res.send(result.rows);
                                                            }
                                                            else {
                                                                //Add more age
                                                                return res.send({status: false, msg: 'This is no more posts'});
                                                            }


                                                    }
                
                                                });

                                        }
                                    }
                                });

                        }
                    }

                 });
            }
        }
    });

});

module.exports = router;
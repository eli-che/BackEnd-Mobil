// If user is not logged in
module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        return res.send({status: false, msg: 'You are not logged in'});
    }
}
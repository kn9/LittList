var logger = require('../../log/logger.js');
var List   = require('../../models/list.js');
var Book   = require('../../models/book.js');
var ListFactory = require('../../database/factories/list.js');

function UpdateListController (req, res, next) {
    
    ListFactory.read(req.session.list, function (err, list) {
        if (err) return next(err);

        if (req.body.add !== undefined)
            list.addReference(parseInt(req.body.add, 10)); 
        
        if (req.body.remove !== undefined)
            list.removeReference(parseInt(req.body.remove, 10)); 

        ListFactory.update(list, function (err, list) {
            if (err) return next(err);

            logger.log('debug', 'Updated list contents', {
                id: list.getId(),
                added:   req.body.add    || null,
                removed: req.body.remove || null
            });
            
            if (req.headers.referer !== undefined)
                res.redirect(req.headers.referer);
            else
                res.redirect('/liste');
        });
    });
}

module.exports = UpdateListController;

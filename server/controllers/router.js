var pages = require('./pages');
var message = require('./message');
var memberCtrl = require('./membersCtrl');
var prayerCtrl = require('./prayerCtrl');
var authCheckMiddleware = require('../middleware/auth-check');

// Map routes to controller functions
module.exports = function(app) {
    // Twilio SMS webhook route
    app.post('/message', message.webhook);

    //Group routes
    // app.get('/groups', group.getAllGroups);
    // app.post('/groups', group.createGroup);
    // app.get('/groups/:groupid', group.getOneGroup);
    // app.delete('/groups/:groupid', group.deleteOneGroup);
    // app.put('/groups/:groupid', group.updateGroup);

    // Render a page that will allow an administrator to send out a message
    // to all subscribers
    //app.get('/', pages.showForm);

    // Handle form submission and send messages to subscribers
    app.post('/message/send', message.sendMessages);

    app.get('/members', memberCtrl.getAllMembers);
    app.get('/members/one',authCheckMiddleware, memberCtrl.getOneMember);

    app.get('/prayers/oneUnprayed', prayerCtrl.getOneUnprayedFor);
    app.get('/prayers/all', prayerCtrl.getAllPrayers)
    app.put('/prayers/all', prayerCtrl.updateAllPrayers);
    app.put('/prayers/:prayerid', prayerCtrl.updateOnePrayer);
    app.put('/prayers/increment/:prayerid', prayerCtrl.incrementOnePrayer);
    app.post('/prayers/delete', prayerCtrl.deletePrayers);
    app.post('/prayedfor/:prayerid', authCheckMiddleware, prayerCtrl.memberPrayedFor);

    app.get('/api/prayedfor', memberCtrl.getPrayedFor);

};

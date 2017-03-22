var pages = require('./pages');
var message = require('./message');
var memberCtrl = require('./membersCtrl');

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
    app.get('/members/:memberid', memberCtrl.getOneMember);
};

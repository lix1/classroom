var home = require('../app/controllers/home'),
    auth = require('../app/controllers/authentication'),
    user = require('../app/controllers/user'),
    profile = require('../app/controllers/userProfile'),
    post = require('../app/controllers/post'),
    comment = require('../app/controllers/comment'),
    classroom = require('../app/controllers/classroom'),
    university = require('../app/controllers/university');
var jwt = require('jsonwebtoken');

module.exports.initialize = function(app, router) {
    router.get('/', home.index);

    router.post('/auth/login', auth.login);
    router.post('/auth/signup', auth.signup);
    router.get('/api/users' ,user.getAll);

    router.get('/api/university/:id' ,university.findById);
    router.post('/admin/university' ,university.create);

    router.get('/api/profile' ,profile.getById);
    router.put('/api/profile' ,profile.update);
    router.post('/api/profile/schedule' ,profile.addCourseToSchedule);
    router.put('/api/profile/schedule' ,profile.updateCourseInSchedule);
    router.delete('/api/profile/schedule/:id' ,profile.deleteCourseById);
    router.put('/api/profile/join' ,profile.joinClassroom);
    router.delete('/api/profile/join/:classroomId' ,profile.leaveClassroom);
    router.put('/api/profile/thumbnail' ,profile.uploadThumbnail);
    router.get('/api/profile/thumbnail' ,profile.getThumbnail);
    router.get('/api/profile/thumbnail/:id' ,profile.getThumbnail);

    router.get('/api/classroom/:slug' ,classroom.findBySlug);
    router.put('/api/classroom' ,classroom.update);
    router.post('/api/classroom' ,classroom.create);
    router.delete('/api/classroom/:id' ,classroom.delete);
    router.get('/api/classroom/calendar/:slug' ,classroom.getEventsByClassroom);
    router.put('/api/classroom/calendar' ,classroom.updateEventInSchedule);
    router.post('/api/classroom/calendar' ,classroom.addEventToSchedule);
    router.delete('/api/classroom/calendar/:classroomId/:calendarId' ,classroom.deleteCourseById);

    router.get('/api/post/:forumRef/:forumSlug/:uid/:slug', post.findBySlug);
    router.get('/api/post/:forumRef/:forumSlug', post.findByForum);
    router.post('/api/post', post.create);
    router.post('/api/comment', comment.create);
    router.get('/api/comment/:postId', comment.findByPost);

    app.get('/classroom', function(req, res){
        res.render('index.jade');
    });
    app.get('/classroom/*', function(req, res){
        res.render('index.jade');
    });

    app.use('/api', auth.verifyToken);
    app.use('/admin', auth.verifyToken);
    app.use('/', router);
};

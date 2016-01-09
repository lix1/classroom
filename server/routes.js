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
    router.post('/api/profile/schedule' ,profile.addCourseToSchedule);
    router.put('/api/profile/schedule' ,profile.updateCourseInSchedule);
    router.delete('/api/profile/schedule/:id' ,profile.deleteCourseById);

    router.get('/api/classroom/:year/:semester/:courseId' ,classroom.findByCourse);
    router.get('/api/classroom/:slug' ,classroom.findBySlug);
    router.put('/api/classroom' ,classroom.update);
    router.get('/api/classroom/schedule/:slug' ,classroom.getEventsByClassroom);
    router.put('/api/classroom/schedule' ,classroom.updateEventInSchedule);
    router.post('/api/classroom/schedule' ,classroom.addEventToSchedule);
    router.delete('/api/classroom/schedule/:classroomId/:scheduleId' ,classroom.deleteCourseById);

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

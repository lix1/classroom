var home = require('../app/controllers/home'),
    auth = require('../app/controllers/authentication'),
    user = require('../app/controllers/user'),
    profile = require('../app/controllers/userProfile'),
    course = require('../app/controllers/course'),
    question = require('../app/controllers/question'),
    answer = require('../app/controllers/answer'),
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
    router.get('/api/course' ,course.search);
    router.get('/api/courses' ,course.getAll);
    router.post('/api/course' ,course.create);
    router.post('/api/question' ,question.create);
    router.get('/api/question/:id' ,question.find);
    router.post('/api/answer' ,answer.create);
    router.get('/api/answer' ,answer.getByQuestion);

    router.get('/api/university/:id' ,university.findById);
    router.post('/admin/university' ,university.create);

    router.get('/api/profile' ,profile.getById);
    router.post('/api/profile/schedule' ,profile.addCourseToSchedule);
    router.put('/api/profile/schedule' ,profile.updateCourseInSchedule);
    router.delete('/api/profile/schedule/:id' ,profile.deleteCourseById);

    router.get('/api/classroom/:year/:semester/:courseId' ,classroom.findByCourse);
    router.get('/api/classroom/:slug' ,classroom.findBySlug);
    router.put('/api/classroom' ,classroom.update);

    router.get('/api/post/:forumRef/:forumSlug/:uid/:slug', post.findBySlug);
    router.get('/api/post/:forumRef/:forumSlug', post.findByForum);
    router.post('/api/post', post.create);
    router.post('/api/comment', comment.create);

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

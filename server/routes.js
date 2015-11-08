var home = require('../app/controllers/home'),
    auth = require('../app/controllers/authentication'),
    course = require('../app/controllers/course'),
    question = require('../app/controllers/question'),
  process = require('../app/controllers/process');
var jwt = require('jsonwebtoken');

module.exports.initialize = function(app, router) {
  router.get('/', home.index);

  router.post('/auth/login', auth.login);
  router.post('/auth/signup', auth.signup);
  router.get('/api/users' ,auth.getAll);
  router.get('/api/course' ,course.search);
  router.get('/api/courses' ,course.getAll);
  router.post('/api/course' ,course.create);
  router.post('/api/question' ,question.create);
  //router.get('/api/question/:id' ,question.find);


  app.get('/classroom', function(req, res){
    res.render('index.jade');
  });
  app.get('/classroom/*', function(req, res){
    res.render('index.jade');
  });

  app.use('/api', auth.verifyToken);
  app.use('/', router);
};

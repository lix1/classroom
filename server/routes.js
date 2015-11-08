var home = require('../app/controllers/home'),
  auth = require('../app/controllers/authentication'),
  hospital = require('../app/controllers/hospital'),
  process = require('../app/controllers/process');
var jwt = require('jsonwebtoken');

module.exports.initialize = function(app, router) {
  router.get('/', home.index);

  router.get('/api/users' ,auth.getAll);
  router.post('/auth/login', auth.login);
  router.post('/auth/signup', auth.signup);





  app.get('/rest/hospital', hospital.all);
  app.get('/rest/hospital/:id', hospital.get);
  app.post('/rest/hospital', hospital.create);
  app.put('/rest/hospital', hospital.update);
  app.delete('/rest/hospital/:id', hospital.delete);

  app.get('/rest/process', process.all);
  app.get('/rest/process/:id', process.get);
  app.post('/rest/process', process.create);
  app.put('/rest/process', process.update);
  app.delete('/rest/process/:id', process.delete);

  app.get('/classroom', function(req, res){
    res.render('index.jade');
  });
  app.get('/classroom/*', function(req, res){
    res.render('index.jade');
  });

  app.use('/api', auth.verifyToken);
  app.use('/', router);
};

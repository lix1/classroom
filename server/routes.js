var home = require('../app/controllers/home'),
  auth = require('../app/controllers/authentication'),
  hospital = require('../app/controllers/hospital'),
  process = require('../app/controllers/process');
var jwt = require("express-jwt");

module.exports.initialize = function(app, router) {
  router.get('/', home.index);

  router.get('/users', auth.getAll);
  router.post('/login', auth.login);
  router.post('/register', auth.register);





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

  var jwtCheck = jwt({
    secret: 'lavender'
  });
  app.use(jwtCheck.unless({path: ['/api/login','/api/register']}));


  app.use(auth.verifyToken);
  app.use('/api', router);
};

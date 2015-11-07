var home = require('../app/controllers/home'),
  intro = require('../app/controllers/intro'),
  hospital = require('../app/controllers/hospital'),
  process = require('../app/controllers/process');

module.exports.initialize = function(app, router) {
  router.get('/', home.index);

  app.get('/rest/intro', intro.all);
  app.post('/rest/intro', intro.create);
  app.put('/rest/intro', intro.update);
  app.delete('/rest/intro/:id', intro.delete);

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

  app.get('/adminConsole', function(req, res){
    res.render('index.jade');
  });
  app.get('/adminConsole/*', function(req, res){
    res.render('index.jade');
  });

  app.use('/', router);


};

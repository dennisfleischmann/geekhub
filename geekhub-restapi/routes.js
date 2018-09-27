module.exports = function(app){
    var topics = require('./controllers/topics');
    app.get('/hubs/:hub/topics',            topics.allTopics );
    app.get('/hubs/:hub/topics/:topic',     topics.consume );
    app.post('/hubs/:hub/topics/:topic/',   topics.produce);
    app.delete('/hubs/:hub/topics/:topic',  topics.delete);
}
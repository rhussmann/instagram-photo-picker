const restify = require('restify');

const posts = require('./posts');

var server = restify.createServer({
  name: 'instagram-photo-picker-api',
});

server.get('/posts', (req, res, next) => {
  res.send(200, posts);
  return next();
});

server.listen(8080, () => {
  console.log(`Server ${server.name} listening at ${server.url}`);
});
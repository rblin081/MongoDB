const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

before((done) => {
  mongoose.connect('mongodb://cowboynation8:Summer*01@ds127899.mlab.com:27899/development');
  mongoose.connection
    .once('open', () => { done(); })
    .on('error', (error) => {
      console.warn('Warning', error);
    });
});

beforeEach((done) => {
  const { users, comments, blogposts } = mongoose.connection.collections;
  users.drop(() => {
    comments.drop(() => {
      blogposts.drop(() => {
        done();
      });
    });
  });
});

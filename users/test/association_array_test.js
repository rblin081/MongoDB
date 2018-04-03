const mongoose = require('mongoose');
const User = require('../src/user');
const BlogPost = require('../src/blogPost');
const assert = require('assert');

describe('Associations', (done) => {
  let joe, frank, blogPost1, blogPost2, blogPost3;
  beforeEach((done) => {
    joe = new User({ name: 'Joe'});
    frank = new User({ name: 'Frank'});
    blogPost1 = new BlogPost({ title: 'JS', content: 'Yep it'});
    blogPost2 = new BlogPost({ title: 'is', content: 'really is'});
    blogPost3 = new BlogPost({ title: 'Great', content: 'Yep it really is'});

    joe.blogPosts.push(blogPost1);
    joe.blogPosts.push(blogPost2);
    joe.blogPosts.push(blogPost3);

    frank.blogPosts.push(blogPost1);
    frank.blogPosts.push(blogPost2);
    frank.blogPosts.push(blogPost3);

    Promise.all([joe.save(), frank.save(), blogPost1.save(), blogPost2.save(), blogPost3.save()])
      .then(() => done());
  });

  it.only('adds a blogpost id to existing user w/ update', done => {
    const blogPost4 = new BlogPost({ title: 'Rob', content: 'B'});
    blogPost4.save()
    .then(() => {
      User.findByIdAndUpdate(joe._id,
        {
          $push: {'blogPosts':  blogPost4._id },
        }
      )
      .then(() => User.findById(joe._id).populate('blogPosts'))
      .then(user => {
        assert(user.blogPosts.length === 4);
        done();
      });
    });
  });

  it('removes a blogpost using pull', (done) => {
    User.update(
      { _id: joe._id},
      { $pull: { blogPosts : blogPost1._id } },
      { safe: true }
    )
    .then(() => User.findById(joe._id).populate('blogPosts'))
    .then(user => {
      assert(user.blogPosts.length == 2);
      done();
    });
  });

  it('removes a blogpost assigned to multiple users using pull', (done) => {
    User.update(
      {},
      { $pull: { blogPosts : blogPost1._id } },
      { safe: true, multi: true }
    )
    .then(() => User.find({}).populate('blogPosts'))
    .then(users => {
      assert(users[0].blogPosts.length == 2);
      assert(users[1].blogPosts.length == 2);
      done();
    });
  });

});

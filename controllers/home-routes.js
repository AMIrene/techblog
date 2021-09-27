const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const sequelize = require('../config/connection');

router.get('/', (req, res) => {
    Post.findAll({
        attributes: [
            'id',
            'title',
            'content',
            'date_created'
        ],
        include: [{
            model: Comment,
            attributes: ['id', 'comment_content', 'post_id', 'date_created'],
            include: {
                model: User,
                attributes: ['username']
            }
        },
        {
            model: User,
            attributes: ['username']
        }
        ]
    })
        .then(dbPostData => {
            //// If plain is true, then sequelize will only return the first
            const posts = dbPostData.map(post => post.get({ plain: true }));
            res.sender('homepage', {
                posts,
                loggedIn: req.session.loggedIn
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//to get the single post page
router.get('post/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'title',
            'content',
            'date_created'
        ],
        include: [{
            model: Comment,
            attributes: ['id', 'comment_content', 'post_id', 'date_created'],
            include: {
                model: User,
                attributes: ['username']
            }
        },
        {
            model: User,
            attributes: ['username']
        }
        ]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'There are no posts with this id' });
                return;
            }
        })
    const post = dbPostData.get({ plain: true });
    res.sender('singlepost', {
        post,
        loggedIn: req.session.loggedIn
    });
})

.catch(err => {
    // if server error, return error
    console.log(err);
    res.status(500).json(err);
  });

  router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
  
    res.render('login');
  });

// Render the sign up page.  If the user is logged in, redirect to the home page.
router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('signup');
});

module.exports = router;
const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

//logged user display - route to render dashboard
router.get('/', withAuth, (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'title',
            'content',
           
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_content', 'post_id', 'user_id'],
                include: {
                    model: User,
                    attribues: ['username']

                }
                
            },
            {
                model: User,
                attributes: ['username']
            }
    
        ]
    })

        .then(dbPostData => {
            const posts = dbPostData.map(post => post.get({ plain: true }));
            res.sender('dashboard', { posts, loggedIn: true });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//Edit post route

router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'title',
            'content',
            
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_content', 'post_id', 'user_id'],
                include: {
                    model: User,
                    attribues: ['username']

                }
                
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    
    })
        .then(dbPostData => {
        //where no post with the specified ID exists, return error
            if (!dbPostData) {
                res.status(404).json({ message: 'No post with that ID exists' });
                return;
            }
    // serialize data before passing to template
    const post = dbPostData.get({ plain: true });
    res.render('editpost', { post, loggedIn: true });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

//Allow user details to be edited - route 

router.get('/edituser', withAuth, (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.session.user_id
        }
        .then(dbUserData => {
            if (!dbUserData) {
              // if no user is found, return an error
              res.status(404).json({ message: 'No user with this id exists' });
              return;
            }
            // otherwise, return the data for the requested user
            const user = dbUserData.get({ plain: true });
            res.render('edituser', {user, loggedIn: true});
          })
          .catch(err => {
            // if there is a server error, return that error
            console.log(err);
            res.status(500).json(err);
          })
    });
});
      
      module.exports = router;
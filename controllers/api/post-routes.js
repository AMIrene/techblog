const router = require('express').Router();

const { User, Post, Comment } = require('../../models');

const sequelize = require('../../config/connection');

const withAuth = require('../../utils/auth');

//routes
router.get('/', (req, res) => {
    Post.findAll({
        attributes: [
            'id',
            'post_content',
            'title',
                  
        ],
 
    })

        //get the posts
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//get a single post using ID

router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'post_content',
            'title',
            'created at'
            
        
        ],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {

                model: Comment,
                attributes: ['id', 'comment_content', 'post_id', 'user_id'],
                include: {
                    model: User,
                    attributes: ['username']

                }
            }
        ]     
        
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post with this ID exists!' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

});
  //create or add a new post
router.post('/', withAuth, (req, res) => {
    Post.create({
        title: req.body.title,
        content: req.body.content,
        user_id: req.session.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// update post title or content
router.put('/:id', withAuth, (req, res) => {
    Post.update(req.body,
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post exists with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    });
});

// delete a post
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post exists with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

module.exports = router;
const router = require("express").Router();
const { User, Post, Comment } = require("../../models");
const session = require("express-session");
const withAuth = require("../../utils/auth");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

// get all users route
router.get("/", (req, res) => {
  User.findAll({
    // exclude the password property when data is sent back
    attributes: { exclude: ["password"] },
  })

    .then((dbUserData) => res.json(dbUserData))
    // return error where there is a server error
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
//get single user by id
router.get("/:id", (req, res) => {
  User.findOne({
    attributes: { exclude: ["password"] },
    where: {
      id: req.params.id,
    },

    include: [
      {
        model: Post,
        attributes: ["id", "title", "post_content"],
      },
      {
        model: Comment,
        attributes: ["id", "comment_content", "post_id", "user_id"],
        include: {
          model: Post,
          attributes: ["title"],
        },
      },
    ],
  })

    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user with this id exists" });
        return;
      }

      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//add a new user route
router.post("/", (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  })
    // save session
    .then((dbUserData) => {
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;

        res.json(dbUserData);
      });
    })
    // where there is a server error, return that error
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//login route for user

router.post("/login", (req, res) => {
  //looks for user by email
  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((dbUserData) => {
    // if no email exists, error returned
    if (!dbUserData) {
      res.status(400).json({ message: "There is no user with that email" });
      return;
    }
    // If exists, then verify the user
    // validate password
    const validPassword = dbUserData.checkPassword(req.body.password);
    // if the password is invalid, return error
    if (!validPassword) {
      res
        .status(400)
        .json({
          message: "Incorrect password! Try again or check your login details.",
        });
      return;
    }
    // if valid, save the session, and notify successful login
    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;

      res.json({ user: dbUserData, message: "You are now logged in!" });
    });
  });
});

//route to logout
router.post("/logout", withAuth, (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    // if there is no session, then the logout request will send back a no resource found status
    res.status(404).end();
  }
});

//update user with an ID
router.put("/:id", withAuth, (req, res) => {
  User.update(req.body, {
    // since password has hook to hash
    individualHooks: true,
    //update user by id
    where: {
      id: req.params.id,
    },
  })
    .then((dbUserData) => {
      if (!dbUserData[0]) {
        res.status(404).json({ message: "No user exists with this id" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//delete user using an id
router.delete("/:id", withAuth, (req, res) => {
  // using destroy method
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user exists with this id" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;

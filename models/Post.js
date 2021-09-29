// Post model

// Dependencies
// sequelize model, datatypes, and database connection
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// the Post model extends the sequelize model 
class Post extends Model {}
// define the table columns and configuration, similar to the setup for the User model
Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                // post must be min 10 character long
                len: [10]
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
)

// Export the model
module.exports = Post;



// const { Model, DataTypes } = require('sequelize');
// const sequelize = require('../config/connection.js');

// class Post extends Model {}

// Post.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true,
//       autoIncrement: true
//     },
//     title: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     content: {
//       type: DataTypes.STRING,
//       allowNull: false
    
//   },
//   user_id: {
//   type: DataTypes.INTEGER,
//   references: {
//     model: 'user',
//     key: 'id'
//   }
// },
     
//       date_created: {
//         type: DataTypes.DATE,
//         allowNull: false,
//         defaultValue: DataTypes.NOW,
//       },
    

// },


//   {
//     sequelize,
    
//     freezeTableName: true,
//     underscored: true,
//     modelName: 'post',
//   }
// );

// module.exports = Post;
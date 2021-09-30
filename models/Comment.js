

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// the Comment model extends the sequelize model 
class Comment extends Model {}

// define the table columns and configuration, similar to the setup for the other models
Comment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        comment_content: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // comment must be at least two characters long
                len: [2]
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        post_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'post',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'comment'
    }
)

// Export the model
module.exports = Comment;
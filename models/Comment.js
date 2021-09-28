const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    comment_content: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4],
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "post",
          key: "id",
        },
      },
      date_created: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
  },

  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "comment",
  }
);

module.exports = Comment;

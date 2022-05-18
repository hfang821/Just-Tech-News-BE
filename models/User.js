const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const bcrypt = require("bcrypt");

//create the user model
class User extends Model {
  //set up method to run on instance data (per user) to check password
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

//define table columns and configuration
User.init(
  {
    //table column definitions
    //define an id column
    id: {
      //use the special sequelize dataTypes object provide what type of data it is
      type: DataTypes.INTEGER,
      //equivalent of sql's not null option
      allowNull: false,
      //primary key
      primaryKey: true,
      //auto increment
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      //cannot be any duplicate email values in this table
      unique: true,
      //run our data through validators before creating the table data
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        //the password needs to be at least 4 characters long
        len: [4],
      },
    },
  },
  {
    hooks: {
      //async because the bcrypt function is cpu intensive
      //set up beforeCreate lifecycle "hook" functionality
      async beforeCreate(newUserData) {
        //saltRound value of 10: "salt" random bits added to each password instance
        //async/await syntax
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      //set up beforeUpdate lifecycle "hook" functionality
      async beforeUpdate(updatedUserData) {
        updatedUserData.password = await bcrypt.hash(
          updatedUserData.password,
          10
        );
        return updatedUserData;
      },
    },
    //table configuration options (https://sequelize.org/v5/manual/models-definition.html#configuration)
    //pass in our imported sequelize connection (the direct connection to our database)
    sequelize,
    //dont automatically create createdAt/updatedAt timestamp fields
    timestamps: false,
    //dont pluralize name of database tables
    freezeTableName: true,
    // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
    underscored: true,
    //make it so our model name stays lowercase in the database
    modelName: "user",
  }
);

module.exports = User;

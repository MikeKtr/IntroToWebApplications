const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "users.db",
  logging: false,
});

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Połączenie z bazą danych Udane");
    await User.sync();
  } catch (error) {
    console.error("Błąd połączenia", error);
  }
}

module.exports = {
  User,
  initDatabase,
};

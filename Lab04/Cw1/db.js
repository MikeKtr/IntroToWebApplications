const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "books.db",
  logging: false,
});

const Book = sequelize.define(
  "Book",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "books",
    timestamps: false,
  }
);

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Połączenie z bazą danych książek nawiązane pomyślnie.");
    await Book.sync();
  } catch (error) {
    console.error("Błąd połączenia/synchronizacji bazy danych:", error);
  }
}

module.exports = {
  Book,
  initializeDatabase,
};

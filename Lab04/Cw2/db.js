const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "orders.db", // Baza danych dla Serwisu Zamówień
  logging: false,
});

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "orders",
    timestamps: false,
  }
);

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Połączenie z bazą danych zamówień nawiązane pomyślnie.");
    await Order.sync(); // Tworzy tabelę 'orders'
  } catch (error) {
    console.error("Błąd połączenia/synchronizacji bazy danych:", error);
  }
}

module.exports = {
  Order,
  initializeDatabase,
};

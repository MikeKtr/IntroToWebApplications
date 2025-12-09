const express = require("express");
const axios = require("axios");
const { Order, initializeDatabase } = require("./db");
const authenticateToken = require("./auth/auth");

const app = express();
const PORT = 3002;
app.use(express.json());

const BOOKS_SERVICE_URL = "http://localhost:3001/api/books";

app.get("/api/orders/:userId", async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.params.userId },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Błąd pobierania zamówień użytkownika." });
  }
});

app.post("/api/orders", authenticateToken, async (req, res) => {
  const { userId, bookId, quantity } = req.body;

  try {
    const bookCheckResponse = await axios.get(`${BOOKS_SERVICE_URL}/${bookId}`);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(400).json({
        message: `Nie można złożyć zamówienia. Książka o ID ${bookId} nie istnieje w katalogu.`,
      });
    }

    return res
      .status(500)
      .json({ message: "Błąd podczas weryfikacji książki." });
  }

  try {
    const newOrder = await Order.create({ userId, bookId, quantity });

    res.status(201).json({
      message: "Zamówienie złożone pomyślnie",
      orderId: newOrder.id,
    });
  } catch (error) {
    res.status(500).json({ message: "Błąd zapisu zamówienia do bazy danych." });
  }
});

app.delete("/api/orders/:orderId", authenticateToken, async (req, res) => {
  try {
    const deletedCount = await Order.destroy({
      where: { id: req.params.orderId },
    });
    if (deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Zamówienie nie zostało znalezione." });
    }
    res.json({ message: "Zamówienie usunięte pomyślnie." });
  } catch (error) {
    res.status(500).json({ message: "Błąd usuwania zamówienia." });
  }
});

app.patch("/api/orders/:orderId", authenticateToken, async (req, res) => {
  const { quantity } = req.body;
  if (quantity === undefined) {
    return res
      .status(400)
      .json({ message: "Wymagane jest pole quantity do aktualizacji." });
  }
  try {
    const [updatedCount] = await Order.update(
      { quantity },
      { where: { id: req.params.orderId } }
    );

    if (updatedCount === 0) {
      return res.status(404).json({
        message: "Zamówienie do aktualizacji nie zostało znalezione.",
      });
    }
    res.json({ message: "Zamówienie zaktualizowane pomyślnie." });
  } catch (error) {
    res.status(500).json({ message: "Błąd aktualizacji zamówienia." });
  }
});

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(` Serwis Zamówień działa na porcie ${PORT}`);
  });
});

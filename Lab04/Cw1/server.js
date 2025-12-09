const express = require("express");
const { Book, initializeDatabase } = require("./db");
const authenticateToken = require("./auth/auth");

const app = express();
const PORT = 3001;
app.use(express.json());

app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "błąd pobierania książek" });
  }
});

app.get("/api/books/:bookId", async (req, res) => {
  const bookId = req.params.bookId;
  try {
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res
        .status(404)
        .json({ message: "Książka nie została znaleziona." });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Błąd pobierania książki." });
  }
});

app.post("/api/books", authenticateToken, async (req, res) => {
  const { title, author, year } = req.body;
  try {
    const newBook = await Book.create({ title, author, year });
    res.status(201).json({
      message: "Książka dodana pomyślnie",
      bookId: newBook.id,
    });
  } catch (error) {
    res.status(400).json({
      message:
        "Błąd dodawania książki. Sprawdź poprawność danych (title, author, year).",
    });
  }
});

app.delete("/api/books/:bookId", authenticateToken, async (req, res) => {
  const bookId = req.params.bookId;
  try {
    const deletedCount = await Book.destroy({
      where: { id: bookId },
    });

    if (deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Książka do usunięcia nie została znaleziona." });
    }

    res.json({ message: "Książka usunięta pomyślnie." });
  } catch (error) {
    res.status(500).json({ message: "Błąd usuwania książki." });
  }
});

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Serwis Książek działa na porcie ${PORT}`);
  });
});

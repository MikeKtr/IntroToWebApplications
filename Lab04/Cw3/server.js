const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, initDatabase } = require("./db");

const app = express();
const PORT = 3003;
app.use(express.json());

const JWT_SECRET = "SUPER_TAJNY_KLUCZ_NA_ZADANIE_Z_WDAI2025_12";

app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPass,
    });

    res.status(201).json({
      message: "Utworzono Użytkownika !",
      userId: newUser.id,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Błąd rejerstracji",
      error: error,
    });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Nie znaleziono użytkownika" });
    }

    const isPassValid = bcrypt.compare(password, user.password);
    if (!isPassValid) {
      return res.status(401).json({ message: "Błądne hasło" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token: token });
  } catch (error) {
    res.status(500).json({ message: "Błąd logowania" });
  }
});

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Serwis Działa na porcie ${PORT}`);
  });
});

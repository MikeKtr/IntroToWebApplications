const jwt = require("jsonwebtoken");
const JWT_SECRET = "SUPER_TAJNY_KLUCZ_NA_ZADANIE_Z_WDAI2025_12";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ message: "Wymagana autoryzacja" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Token JWT niepoprawny lub wygasł" });
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;

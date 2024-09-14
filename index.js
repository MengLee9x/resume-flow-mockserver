const express = require("express");

const bodyParser = require("body-parser");

const session = require("express-session");
const cors = require("cors");

const app = express();

const PORT = 4000;

const users = {
  admin1: "123",
  candidate1: "123",
};

const role = {
  admin1: "admin",
  candidate1: "candidate",
};

const commonInfo = {
  name: "Beatrice Wambui",
  profession: "Fullstack Developer",
  phone: "+274723909353",
  email: "beatricewambuimbugua@gmail.com",
  location: "Nairobi, Kenya",
  profileImage: "/images/profile_picture.png",
  socialLinks: {
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    github: "https://github.com",
  },
};

app.use(bodyParser.json());

app.use(
  session({
    secret: "secret-key",

    resave: false,

    saveUninitialized: true,
  })
);

app.use(cors());

function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }

  res.status(401).json({ message: "Unauthorized" });
}

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (users[username] && users[username] === password) {
    req.session.user = username;

    res.json({
      message: "Login successful",
      user: username,
      role: role[username],
    });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }

    res.json({ message: "Logged out successfully" });
  });
});

app.get("/api/data", isAuthenticated, (req, res) => {
  res.json({ message: "This is protected data", user: req.session.user });
});

app.get("/api/public-data", (req, res) => {
  res.json({ message: "This is public data" });
});

app.get("/api/common-info", (req, res) => {
  res.json(commonInfo);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

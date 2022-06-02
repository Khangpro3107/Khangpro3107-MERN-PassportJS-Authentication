const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const dotenv = require("dotenv");
const app = express();
const User = require("./models/User");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const morgan = require("morgan");
const cors = require("cors");

dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan("common"));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

mongoose.connect(process.env.MONGO_URL, () => {
  console.log("Connected to DB!");
});

const authenticateUser = async (username, password, done) => {
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return done(null, false, {
        message: "Username or password is incorrect!",
      });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return done(null, false, {
        message: "Username or password is incorrect!",
      });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
};

passport.use(new LocalStrategy(authenticateUser));
passport.serializeUser((user, done) => {
  return done(null, user.id);
});
passport.deserializeUser(async (userId, done) => {
  return done(null, await User.findById(userId));
});

app.get("/api/dashboard", (req, res) => {
  return res.status(200).json(req.user);
});

app.post(
  "/api/login",
  (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.json({ msg: info.message });
      }
      req.login(user, (err) => {
        if (err) return next(err);
        return res.json({});
      });
    })(req, res, next);
  }
);

app.post("/api/register", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      return res.json({ msg: "Username taken!" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
    });
    await newUser.save();
    return res.status(200).json("Registered successfully!");
  } catch (error) {
    return next(err);
  }
});

app.delete("/api/logout", async (req, res) => {
  req.logOut((err) => {
    if (err) return next(err);
    res.json({ msg: "Logged out successfully!" });
  });
});

app.use((err, req, res, next) => {
  res.send(`<h1>Error: ${err.message}</h1><br/><a href="/login">Log in</a>`);
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log("Server on port " + port));

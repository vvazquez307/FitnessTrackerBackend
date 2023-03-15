/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { getUserByUsername, createUser, getUser } = require("../db");

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");
  next();
});

// POST /api/users/register
usersRouter.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const _user = await getUserByUsername(username);
    if (_user) {
      next({
        name: "UserExistsError",
        message: `User ${username} is already taken.`,
      });
    } else if (password.length < 8) {
      next({
        name: "PasswordTooShortError",
        message: "Password Too Short!",
      });
    } else {
      const user = await createUser({ username, password });
      const token = jwt.sign(
        { username: user.username, password: user.password },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );
      res.send({ message: "thank you for signing up", token, user });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/users/login
usersRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      next({
        name: "loginError",
        message: "Please enter username and password",
      });
    }
    const user = await getUser({ username, password });
    if (user) {
      const token = jwt.sign(
        { id: user.id, username },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );
      res.send({ message: "you're logged in!", token });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    throw error;
  }
});

// GET /api/users/me
usersRouter.get("/me", async (req, res, next) => {
  try {
    const { id } = req.user;
    if (id) {
      res.send(req.user);
    } else {
      next({
        name: "UnauthorizedUserError",
        message: "You must be logged in to view this page",
      });
    }
  } catch (error) {
    throw error;
  }
});

// GET /api/users/:username/routines
usersRouter.get("/:username/routines", async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await getUserByUsername(username);
    if (user) {
      res.send(user);
    } else {
      next({
        name: "UserNotFoundError",
        message: "User not found",
      });
    }
  } catch (error) {
    throw error;
  }
});

module.exports = usersRouter;

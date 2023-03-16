/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  getUserByUsername,
  createUser,
  getAllRoutinesByUser,
  getAllPublicRoutines,
} = require("../db");
const requireUser = require("./util");

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
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "RequireUsernamePasswordError",
      message: "Neither field may be empty",
    });
  }
  try {
    const user = await getUserByUsername(username);
    const isValid = bcrypt.compare(password, user.password);
    if (user && isValid) {
      const token = jwt.sign(
        {
          username: username,
          id: user.id,
        },
        process.env.JWT_SECRET
      );
      res.send({
        message: "you're logged in!",
        token: token,
        user: user,
      });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password incorrect",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/users/me
usersRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    const username = req.user.username;
    const user = await getUserByUsername({ username: username });
    if (user) {
      res.send(user);
    } else {
      next({
        name: "UserNotFoundError",
        message: "User not found",
      });
    }
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:username/routines
usersRouter.get("/:username/routines", requireUser, async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await getUserByUsername({ username: username });
    if (user) {
      const routines = await getAllRoutinesByUser({ username: username });
      res.send(routines);
    } else {
      next({
        name: "UserNotFoundError",
        message: "User not found",
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;

/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  getUserByUsername,
  createUser,
  getUser,
  getAllRoutinesByUser,
  getAllPublicRoutines,
} = require("../db");

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
usersRouter.get("/me", async (req, res, next) => {
  if (!req.headers.authorization) {
    next({
      name: "MissingTokenError",
      message: "You must be logged in to perform this action",
    });
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    const { username } = jwt.verify(token, process.env.JWT_SECRET);
    if (username) {
      const user = await getUserByUsername(username);
      if (user) {
        res.send(user);
      }
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
usersRouter.get("/:username/routines", async (req, res, next) => {
  try {
    const user = await getUserByUsername(req.params.username);
    console.log(user);
    if (user) {
      const routines = await getAllRoutinesByUser(req.params);
      res.send(routines);
    } else {
      const routines = await getAllPublicRoutines(req.params);
      res.send(routines);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;

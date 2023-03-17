/* eslint-disable no-unused-vars */
const express = require("express");
const routinesRouter = express.Router();
const { getAllPublicRoutines } = require("../db");
const requireUser = require("./util");

// GET /api/routines
routinesRouter.get("/", async (req, res, next) => {
  //Returns a list of public routines, includes the activities with them (93 ms)
  try {
    const routines = await getAllPublicRoutines();
    res.send(routines);
  } catch (error) {
    next(error);
  }
});

// POST /api/routines
routinesRouter.post("/", async (req, res, next) => {
  //Creates a new routine, with the creatorId matching the logged in user (70 ms)
  //Requires logged in user (6 ms)
});

// PATCH /api/routines/:routineId
routinesRouter.patch("/:routineId", async (req, res, next) => {});

// DELETE /api/routines/:routineId
routinesRouter.delete("/:routineId", requireUser, async (req, res, next) => {});

// POST /api/routines/:routineId/activities
routinesRouter.post("/:routineId/activities", async (req, res, next) => {});

module.exports = routinesRouter;

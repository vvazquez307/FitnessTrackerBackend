/*eslint-disable no-useless-catch*/
const express = require("express");
const activitiesRouter = express.Router();
const { getAllActivities } = require("../db");

activitiesRouter.use((req, res, next) => {
  console.log("A request is being made to /activities");

  next();
});

// GET /api/activities/:activityId/routines

// GET /api/activities
activitiesRouter.get("/", async (req, res) => {
  try {
    const allActivities = await getAllActivities();
    console.log(allActivities, " /////////////////////////////");

    res.send(allActivities);
  } catch (error) {
    throw error;
  }
});
// POST /api/activities

// PATCH /api/activities/:activityId

module.exports = activitiesRouter;

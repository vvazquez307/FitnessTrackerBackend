/* eslint-disable no-unused-vars */
const express = require("express");
const routinesRouter = express.Router();
const {
  getAllPublicRoutines,
  createRoutine,
  updateRoutine,
  getRoutineById,
  destroyRoutine,
  addActivityToRoutine,
} = require("../db");
const requireUser = require("./util");

// GET /api/routines
routinesRouter.get("/", async (req, res, next) => {
  try {
    const routines = await getAllPublicRoutines();
    res.send(routines);
  } catch (error) {
    next(error);
  }
});

// POST /api/routines
routinesRouter.post("/", requireUser, async (req, res, next) => {
  try {
    const routine = await createRoutine({
      creatorId: req.user.id,
      isPublic: req.body.isPublic,
      name: req.body.name,
      goal: req.body.goal,
    });
    res.send(routine);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/routines/:routineId
routinesRouter.patch("/:routineId", requireUser, async (req, res, next) => {
  try {
    const { routineId } = req.params;
    const { isPublic, name, goal } = req.body;
    const routine = await getRoutineById(routineId);
    const updatedData = {};

    if (isPublic !== undefined) {
      updatedData.isPublic = isPublic;
    }
    if (name) {
      updatedData.name = name;
    }
    if (goal) {
      updatedData.goal = goal;
    }
    if (req.user.id !== routine.creatorId) {
      res.status(403);
      next({
        name: "UserNotAuthorizedError",
        message: `User ${req.user.username} is not allowed to update ${routine.name}`,
      });
    } else {
      const updatedRoutine = await updateRoutine({
        id: routineId,
        ...updatedData,
      });
      res.send(updatedRoutine);
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /api/routines/:routineId
routinesRouter.delete("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;

  try {
    const routine = await getRoutineById(routineId);
    if (req.user.id !== routine.creatorId) {
      res.status(403);
      next({
        name: "UserNotAuthorizedError",
        message: `User ${req.user.username} is not allowed to delete ${routine.name}`,
      });
    } else {
      const destroyedRoutine = await destroyRoutine(routineId);
      console.log(destroyedRoutine, "////////////////////");
      res.send(destroyedRoutine);
      //   res.send(routine);
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/routines/:routineId/activities
routinesRouter.post("/:routineId/activities", async (req, res, next) => {
  const { routineId } = req.params;
  const { activityId, count, duration } = req.body;
  try {
    const routine = await getRoutineById(routineId);
    const updatedData = {};
    if (activityId) {
      updatedData.activityId = activityId;
    }
    if (count) {
      updatedData.count = count;
    }
    if (duration) {
      updatedData.duration = duration;
    }
    const updatedRoutine = await addActivityToRoutine({
      routineId: routineId,
      ...updatedData,
    });
    res.send(updatedRoutine);
  } catch (error) {
    next({
      name: "RoutineActivityError",
      message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`,
    });
  }
});

module.exports = routinesRouter;

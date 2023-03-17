const { response } = require('express');
const express = require('express');
const routine_activitiesRouter = express.Router();
const { updateRoutineActivity, getRoutineById, destroyRoutineActivity } = require('../db');
const requireUser = require("./util");

routine_activitiesRouter.use((req, res, next) => {
    console.log("A request is being made to /routine_activities");
  
    next();
});
// PATCH /api/routine_activities/:routineActivityId
routine_activitiesRouter.patch('/:routineActivityId', requireUser,  async (req, res, next) => {
try {
    const { routineActivityId } = req.params;
    const { count, duration } = req.body;
    const updatedData = {}
    if(count){
        updatedData.count = count;
    }
    if(duration){
        updatedData.duration = duration;
    }
    const updatedRoutineActivity = await updateRoutineActivity({id:routineActivityId, ...updatedData})
    const routineId = updatedRoutineActivity.routineId
    const routine = await getRoutineById(routineId)
    if(req.user.id === routine.creatorId){
        res.send(updatedRoutineActivity)
    }else{
        next({
            error: "error",
            message: `User ${req.user.username} is not allowed to update ${routine.name}`,
            name: "userAndCreatorDoNotMatchError"
        })
    }
} catch ({name, message}) {
    next({name, message})
  }
})
// DELETE /api/routine_activities/:routineActivityId
routine_activitiesRouter.delete("/:routineActivityId", requireUser,async (req, res, next)=> {
    try {
        const { routineActivityId } = req.params;
        const deletedRoutineActivity = await destroyRoutineActivity(routineActivityId);
        const routineId = deletedRoutineActivity.routineId;
        const routine = await getRoutineById(routineId);
        if(req.user.id === routine.creatorId){
            console.log(deletedRoutineActivity, "/////////////////////////////////")
            res.send(deletedRoutineActivity)
        }else{
            res.status(403)
            next({
                error: "error",
                message: `User ${req.user.username} is not allowed to delete ${routine.name}`,
                name: "userAndCreatorDoNotMatchError"
            })
        }
    } catch ({name, message}) {
        next({name, message})
      }
})
module.exports = routine_activitiesRouter;

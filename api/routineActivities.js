const express = require('express');
const routine_activitiesRouter = express.Router();
const {} = require('../db')

routine_activitiesRouter.use((req, res, next) => {
    console.log("A request is being made to /routine_activities");
  
    next();
});
// PATCH /api/routine_activities/:routineActivityId
routine_activitiesRouter.patch('/routine_activities/:routineActivityId', async (req, res, next) => {
try {
    const { routineActivityId } = req.params;
    const { count, duration } = req.body;
    const updatedData = {}
    console.log(routineActivityId, "/////////////routineActivityId//////////////////")
    console.log(count, " //////////////////count////////////////")
    console.log(duration, " ////////////////duration///////////////")
    if(count){
        updatedData.count = count;
    }
    if(duration){
        updatedData.duration = duration;
    }


} catch (error) {
    throw error;
}
})
// DELETE /api/routine_activities/:routineActivityId

module.exports = routine_activitiesRouter;

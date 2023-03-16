/*eslint-disable no-useless-catch*/
const express = require("express");
const activitiesRouter = express.Router();

const { getAllActivities, createActivity, getActivityByName, getActivityById, updateActivity, getPublicRoutinesByActivity } = require('../db')

activitiesRouter.use((req, res, next) => {
  console.log("A request is being made to /activities");

  next();
});

// GET /api/activities/:activityId/routines
activitiesRouter.get('/:activityId/routines', async ( req, res, next) => {
    try {
        const { activityId } = req.params
        const routines = await getPublicRoutinesByActivity({ id: activityId })
        if(routines.length === 0){
            next({
                error: "error",
                message: `Activity ${activityId} not found`,
                name: "routineActivityDoesNotExist"
            })
        }else{
            res.send(routines)
        }
    } catch ({name, message}) {
      next({name, message})
    }
})

// GET /api/activities
activitiesRouter.get('/', async (req, res) => {
    try {
        const allActivities = await getAllActivities();
        res.send(allActivities)
    } catch (error) {
        throw error;
    }
})

// POST /api/activities
activitiesRouter.post('/', async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const activityData = {
            name: name,
            description: description
        };
        const activity = await getActivityByName(name)
        if(activity){
            next({
                error: "error",
                message: `An activity with name ${name} already exists`,
                name: "matchingActivityError"
            })
        }else{
            const createdActivity = await createActivity(activityData);
            res.send(createdActivity)
        } 
    } catch ({name, message}) {
      next({name, message})
    }
})

// PATCH /api/activities/:activityId
activitiesRouter.patch('/:activityId', async (req, res, next)=> {
    try {
        const { activityId } = req.params;
        const { name, description } = req.body
        const updatedData = {}

        if(name){
            updatedData.name = name;
        }
        if(description){
            updatedData.description = description;
        }

        const activityById = await getActivityById(activityId)
        const activityByName = await getActivityByName(updatedData.name)

        if(!activityById){
            next({
                error: "error",
                message: `Activity ${activityId} not found`,
                name: "activityDoesNotExist"
            })
        }else if(activityByName){
            next({
                error: "error",
                message: `An activity with name ${updatedData.name} already exists`,
                name: "matchingActivityError"
            })
        }else{
            const updatedActivity = await updateActivity({id: activityId, ...updatedData})
            res.send(updatedActivity)
        }
    } catch (error) {
        next(error);
    }

})

module.exports = activitiesRouter;

/*eslint-disable no-useless-catch*/
const express = require("express");
const activitiesRouter = express.Router();

const { getAllActivities, createActivity, getActivityByName } = require('../db')

activitiesRouter.use((req, res, next) => {
  console.log("A request is being made to /activities");

  next();
});

// GET /api/activities/:activityId/routines

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
    const { name, description } = req.body;
    const activityData = {
        name: name,
        description: description
    };

    const activity = await getActivityByName(name)
    try {
        console.log(activity, "/////////////////////////")
        console.log(activityData," ?????????????????????????")
        // const createdActivity = await createActivity(activityData);
        // res.send(createdActivity)
        if(activity){
            next({
                error: "error",
                message: `An activity with name ${name} already exists`,
                name: "matchingActivityError"
            })
        }else{
            const createdActivity = await createActivity(activityData);
            console.log(createdActivity, ".................................................")
            res.send(createdActivity)
        } 
    } catch ({name, message}) {
      next({name, message})
    }
})

// PATCH /api/activities/:activityId

module.exports = activitiesRouter;

const express = require('express');
const R_A_Router = express.Router();
const {} = require('../db')

R_A_Router.use((req, res, next) => {
    console.log("A request is being made to /`routine_activities`");
  
    next();
});
// PATCH /api/routine_activities/:routineActivityId
R_A_Router.patch('/routine_activities/:routineActivityId', requireUser, async (req, res, next) => {

})
// DELETE /api/routine_activities/:routineActivityId

module.exports = router;

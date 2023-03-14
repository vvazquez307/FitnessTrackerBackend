const client = require("./client");
const { createRoutine } = require("./routines");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {
      rows: [routine_activities],
    } = await client.query(
      `
      INSERT INTO routine_activities ("routineId", "activityId", count, duration)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [routineId, activityId, count, duration]
    );
    return routine_activities;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getRoutineActivityById(id) {
  try {
    const { rows: [routine_activity] } = await client.query(`
    SELECT *
    FROM routine_activities
    WHERE id = $1
    `, [id]);
    return routine_activity
  } catch (error) {
    throw error;
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows } = await client.query(`
    SELECT *
    FROM routine_activities
    WHERE "routineId" = $1;
    `, [id]);
    return rows
  } catch (error) {
    throw error;
  }
}

async function updateRoutineActivity({ id, ...fields }) {

  const newData = Object.keys(fields).map(
    (key, index) => `${ key }=$${ index + 1 }`
  ).join(', ');

  try {
    const { rows: [updatedActivity] } = await client.query(`
    UPDATE routine_activities
    SET ${newData}
    WHERE id = ${id}
    RETURNING *;
    `, Object.values(fields));
    return updatedActivity
  } catch (error) {
    throw error;
  }
}

async function destroyRoutineActivity(id) {
  try {
    const {rows: [deletedRoutineActivity]} = await client.query(`
    DELETE FROM routine_activities
    WHERE id = $1
    RETURNING *;
    `, [id]);
    return deletedRoutineActivity
  } catch (error) {
    throw error;
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  console.log(routineActivityId," //////////////////////")
  console.log(userId," //////////////////////")
  try {
    const {rows:[isCreator]} = await client.query(`
    SELECT id
    FROM routine_activities
    JOIN routines ON routine_activities."routineId" = routines.id
    WHERE routine_activities.id = $1 AND routines."creatorId"= $2;
    `, [routineActivityId, userId])
    console.log(iscreator," //////////////////////")
    if(!isCreator){
      return null
    }else{
      return true
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};

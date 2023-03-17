const client = require("./client");

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
    const {
      rows: [routine_activity],
    } = await client.query(
      `
    SELECT *
    FROM routine_activities
    WHERE id = $1
    `,
      [id]
    );
    return routine_activity;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    console.log(id, "ID!!!");
    const { rows } = await client.query(
      `
    SELECT *
    FROM routine_activities
    WHERE "routineId" = ${id};
    `
    );
    console.log(rows, "#########");
    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  const newData = Object.keys(fields)
    .map((key, index) => `${key}=$${index + 1}`)
    .join(", ");

  try {
    const {
      rows: [updatedActivity],
    } = await client.query(
      `
    UPDATE routine_activities
    SET ${newData}
    WHERE id = ${id}
    RETURNING *;
    `,
      Object.values(fields)
    );
    return updatedActivity;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function destroyRoutineActivity(id) {
  try {
    const {
      rows: [deletedRoutineActivity],
    } = await client.query(
      `
    DELETE FROM routine_activities
    WHERE id = $1
    RETURNING *;
    `,
      [id]
    );
    return deletedRoutineActivity;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    const {
      rows: [creator],
    } = await client.query(
      `
    SELECT * 
    FROM routine_activities
    JOIN routines ON routine_activities.id = $1
    AND routines."creatorId" = $2;
    `,
      [routineActivityId, userId]
    );
    if (!creator) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log(error);
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

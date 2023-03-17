const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities");
const {
  getRoutineActivitiesByRoutine,
  destroyRoutineActivity,
} = require("./routine_activities");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
      INSERT INTO routines ("creatorId", "isPublic", "name", "goal")
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [creatorId, isPublic, name, goal]
    );
    return routine;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
      SELECT * 
      FROM routines 
      WHERE id = $1
      `,
      [id]
    );
    if (!routine) {
      return null;
    } else {
      return routine;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(
      `
    SELECT *
    FROM routines;
    `
    );
    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getAllRoutines() {
  try {
    const { rows } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id;
      `
    );

    return attachActivitiesToRoutines(rows);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      WHERE routines."isPublic" = true;
      `
    );
    console.log(rows);
    return attachActivitiesToRoutines(rows);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      WHERE users.username = $1;
      `,
      [username]
    );
    return attachActivitiesToRoutines(rows);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      WHERE users.username = $1 AND routines."isPublic" = true;
      `,
      [username]
    );
    return attachActivitiesToRoutines(rows);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      JOIN routine_activities ON routines.id = routine_activities."routineId"
      WHERE routine_activities."activityId" = $1 AND routines."isPublic" = true;
      `,
      [id]
    );
    return attachActivitiesToRoutines(rows);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function updateRoutine({ id, ...fields }) {
  try {
    const setString = Object.keys(fields)
      .map((key, index) => `"${key}"=$${index + 1}`)
      .join(", ");
    if (setString.length === 0) {
      return null;
    } else {
      const {
        rows: [routine],
      } = await client.query(
        `
      UPDATE routines
      SET ${setString}
      WHERE id = ${id}
      RETURNING *;
    `,
        Object.values(fields)
      );
      return routine;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function destroyRoutine(id) {
  // Deletes all the routine_activities whose routine is the one being deleted.
  try {
    // const routineActivities = await getRoutineActivitiesByRoutine({ id: id });
    // console.log(routineActivities, "!!!!!!!!!!!!!");
    // routineActivities.forEach((e) => destroyRoutineActivity(e));
    await client.query(
      `
      DELETE FROM routine_activities
      WHERE "routineId" = ${id}
      RETURNING *;
      `
    );
    const {
      rows: [deletedRoutine],
    } = await client.query(
      `
      DELETE FROM routines
      WHERE id = $1
      RETURNING *;
      `,
      [id]
    );
    return deletedRoutine;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};

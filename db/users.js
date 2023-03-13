const client = require("./client");
const bcrypt = require("bcrypt");

// database functions

// user functions
async function createUser({ username, password }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  password = hashedPassword;
  // let userToAdd = {username, hashedPassword }
  try {
    const {
      rows: [user],
    } = await client.query(
      `INSERT INTO users (username, password)
       VALUES($1, $2)
       ON CONFLICT(username) DO NOTHING
       RETURNING id, username;
      `,
      [username, password]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  const user = await getUserByUsername(username);
  const hashedPassword = user.password;
  const isValid = await bcrypt.compare(password, hashedPassword);
  try {
    if (!isValid) {
      return null;
    } else {
      delete user.password;
      return user;
    }
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `SELECT *
      FROM users
      WHERE id = $1;
      `,
      [userId]
    );
    if (!user) {
      return null;
    } else {
      delete user.password;
      return user;
    }
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(userName) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `SELECT *
      FROM users
      WHERE username = $1;
      `,
      [userName]
    );
    if (user.length === 0) {
      return null;
    } else {
      return user;
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};

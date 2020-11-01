import sequelize from "@daos/DBInstance";

export const request = require("supertest");
import app from "../Server";

export const TESTUSER = {
  username: "testunittestuser",
  displayName: "testunittestuser",
  password: "Testunittestuser!",
};
export const TESTUSER2 = {
  username: "testunittestusr2",
  displayName: "testunittestusr2",
  password: "Testunittestusr2!",
};
export const ITEMID = "814120d4-5d3a-464b-8040-a9fecc107e54"; // Coffee

// Create test users in database
export async function createTestUsers() {
  await request(app)
    .post("/api/signup")
    .send({
      username: `${TESTUSER.username}`,
      displayName: `${TESTUSER.displayName}`,
      password: `${TESTUSER.password}`,
    });
  await request(app)
    .post("/api/signup")
    .send({
      username: `${TESTUSER2.username}`,
      displayName: `${TESTUSER2.displayName}`,
      password: `${TESTUSER2.password}`,
    });
}

// Get cookie for authorised user
export async function getAuthenticatedUserCookie() {
  const resLogin = await request(app)
    .post("/api/login")
    .send({
      username: `${TESTUSER.username}`,
      password: `${TESTUSER.password}`,
    });
  if (resLogin.body.errors) {
    const resSignUp = await request(app)
      .post("/api/signup")
      .send({
        username: `${TESTUSER.username}`,
        displayName: `${TESTUSER.displayName}`,
        password: `${TESTUSER.password}`,
      });
    return resSignUp.headers["set-cookie"];
  } else {
    return resLogin.headers["set-cookie"];
  }
}

// Delete test users from database
export async function deleteTestUsers() {
  await sequelize.query(
    `DELETE from ious WHERE giver='${TESTUSER.username}' OR receiver='${TESTUSER.username}';
        DELETE from tokens WHERE username='${TESTUSER.username}';
        DELETE from users WHERE username='${TESTUSER.username}';`
  );
  await sequelize.query(
    `DELETE from ious WHERE giver='${TESTUSER2.username}' OR receiver='${TESTUSER2.username}';
        DELETE from tokens WHERE username='${TESTUSER2.username}';
        DELETE from users WHERE username='${TESTUSER2.username}';`
  );
}

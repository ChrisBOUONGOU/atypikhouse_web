import apiPlatformClient from "./api/apiPlatformClient";
import { URI_USERS, URI_USERS_LOGIN } from "./api/constants";

export async function createUser(userData) {
  const createdUser = await apiPlatformClient.post(URI_USERS, {
    accept: "application/json",
    payload: userData,
  });
  return createdUser;
}

export async function getUser(session) {
  if (session && session.user && session.user.email) {
    let uri = `${URI_USERS}?email=${session.user.email}`;
    let user = await apiPlatformClient.get(uri);
    return Array.isArray(user) && user.length > 0 ? user[0] : null;
  }
  return null;
}

export async function getUserById(userId) {
  let uri = `${URI_USERS}/${userId}`;
  let user = await apiPlatformClient.get(uri);
  return user;
}

export async function loginUser(email, password) {
  const userData = {
    email: email,
    password: password,
  };

  const result = await apiPlatformClient.post(URI_USERS_LOGIN, {
    accept: "application/json",
    payload: userData,
  });

  if (result && result.user) {
    return result.user;
  }

  return null;
}

export function isAdminSession(session) {
  return (
    session &&
    Array.isArray(session.userRoles) &&
    session.userRoles.includes("ROLE_ADMIN")
  );
}

export function isModeratorSession(session) {
  return (
    session &&
    Array.isArray(session.userRoles) &&
    session.userRoles.includes("ROLE_MODERATOR")
  );
}

export function isOwner(session) {
  return (
    session &&
    Array.isArray(session.userRoles) &&
    session.userRoles.includes("ROLE_OWNER")
  );
}

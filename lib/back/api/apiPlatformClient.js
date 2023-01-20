import { API_URL } from "./constants";

async function fetchAPI(uri, method = "GET", { payload, accept } = {}) {
  if (!accept) {
    accept = "application/json";
  }
  let headers = {
    "Content-Type": "application/json",
    Accept: accept,
    "X-APP-ID": process.env.API_CLIENT_ID,
    "X-APP-SECRET": process.env.API_CLIENT_SECRET,
  };

  //if (session && session.accessToken) {
  //  headers = { AUTHORIZATION: session.accessToken, ...headers };
  //}

  const res = await fetch(API_URL + uri, {
    method: method,
    headers: headers,
    body: payload ? JSON.stringify(payload) : null,
  });

  return await res;
}

const apiPlatformClient = {
    get: async (uri, data) => {
      return (await fetchAPI(uri, "GET", data)).json();
    },
    post: async (uri, data) => {
      return (await fetchAPI(uri, "POST", data)).json();
    },
    put: async (uri, data) => {
      return (await fetchAPI(uri, "PUT", data)).json();
    },
    delete: async (uri, data) => {
      return await fetchAPI(uri, "DELETE", { accept: "*/*" });
    },
    patch: async (uri, data) => {
      return (await fetchAPI(uri, "PATCH", data)).json();
    },
  };
  
  export default apiPlatformClient;
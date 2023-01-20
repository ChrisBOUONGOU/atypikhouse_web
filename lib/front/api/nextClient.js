async function fetchNextAPI(uri, method = "GET", payload, headers) {
    const res = await fetch(uri, {
      method: method,
      headers: headers ?? {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: payload ? JSON.stringify(payload) : null,
    });
  
    return await res;
  }
  
  // handle file upload
  async function fetchNextAPIWithFile(uri, method = "POST", payload, headers) {
    const res = await fetch(uri, {
      method: method,
      headers: headers ?? {
        Accept: "application/json",
      },
      body: payload ? payload : null,
    });
  
    return await res;
  }
  
  const nextClient = {
    get: async (uri, data) => {
      return (await fetchNextAPI(uri, "GET", data)).json();
    },
    post: async (uri, data) => {
      return (await fetchNextAPI(uri, "POST", data)).json();
    },
    postFile: async (uri, data) => {
      return (await fetchNextAPIWithFile(uri, "POST", data)).json();
    },
    put: async (uri, data) => {
      return (await fetchNextAPI(uri, "PUT", data)).json();
    },
    delete: async (uri) => {
      return await fetchNextAPI(uri, "DELETE", null, { accept: "*/*" });
    },
    patch: async (uri, data) => {
      return (await fetchNextAPI(uri, "PATCH", data)).json();
    },
  };
  
  export default nextClient;
  
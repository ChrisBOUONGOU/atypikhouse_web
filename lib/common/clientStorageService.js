const get = (storage, itemName) => {
    const item = storage.getItem(itemName);
    const numPatt = new RegExp(/^\d+$/);
    const jsonPatt = new RegExp(/[\[\{].*[\}\]]/);
  
    if (item) {
      if (jsonPatt.test(item)) {
        return JSON.parse(item);
      } else if (numPatt.test(item)) {
        return parseFloat(item);
      } else {
        return item;
      }
    } else {
      return null;
    }
  };
  
  const set = (storage, itemName, item) => {
    if (typeof item === "object") {
      storage.setItem(itemName, JSON.stringify(item));
    } else {
      storage.setItem(itemName, item);
    }
  };
  
  const remove = (storage, itemName) => {
    storage.removeItem(itemName);
  };
  
  export const localStorageService = {
    get: (itemName) => {
      return get(localStorage, itemName);
    },
    set: (itemName, item) => {
      set(localStorage, itemName, item);
    },
    remove: (itemName) => {
      remove(localStorage, itemName);
    },
  };
  
  export const sessionStorageService = {
    get: (itemName) => {
      return get(sessionStorage, itemName);
    },
    set: (itemName, item) => {
      set(sessionStorage, itemName, item);
    },
    remove: (itemName) => {
      remove(sessionStorage, itemName);
    },
  };
  
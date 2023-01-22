cy.atypikUtils = {
  generateId: (length) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  checkExistByQuery: (selector, successCallback, errorCallback) => {
    cy.get("body").then((html) => {
      const $count = cy.$$(html).find(selector).length;
      if ($count > 0) {
        successCallback();
      } else {
        errorCallback();
      }
    });
  },
  whileNotExistDo: (selector, predicate, callbackAction, maxRetry = 6) => {
    const whileWithPromise = (data, condition, action) => {
      var whilst = (data) => {
        return condition(data)
          ? action(data).then(whilst)
          : Promise.resolve(data);
      };
      return whilst(data);
    };

    const searchAndExecuteCallback = ({ found, retryIndex }) => {
      return new Promise((resolve, reject) => {
        cy.get("body").then((html) => {
          const $elemnts = cy.$$(html).find(selector);
          if (predicate($elemnts)) {
            resolve({ found: true, retryIndex: retryIndex + 1 });
          } else {
            cy.wait(200);
            callbackAction();
            resolve({ found: false, retryIndex: retryIndex + 1 });
          }
        });
      });
    };

    let initialParams = { found: false, retryIndex: 0 };
    return whileWithPromise(
      initialParams,
      (obj) => !obj.found && obj.retryIndex < maxRetry,
      searchAndExecuteCallback
    );
  },
};

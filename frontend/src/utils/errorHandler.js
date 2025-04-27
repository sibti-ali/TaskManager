let setGlobalError = null;

export const registerSetGlobalError = (fn) => {
  setGlobalError = fn;
};

export const triggerGlobalError = (error) => {
  if (setGlobalError) {
    setGlobalError(error);
  }
};

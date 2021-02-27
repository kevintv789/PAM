/**
 * Validates if an email address has the correct format
 * @param email
 */
export const validateEmail = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Returns a formatted USA mobile number as the user types. Requires a stateful component
 * @param currentState
 * @param previousState
 */
export const formatMobileNumber = (currentState: string, previousState: string) => {
  if (!currentState) return currentState;
  const currentValue = currentState.replace(/[^\d]/g, "");
  const cvLength = currentValue.length;

  if (!previousState || currentState.length > previousState.length) {
    if (cvLength < 4) return currentValue;
    if (cvLength < 7)
      return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;
    return `(${currentValue.slice(0, 3)}) ${currentValue.slice(
      3,
      6
    )}-${currentValue.slice(6, 10)}`;
  }
};

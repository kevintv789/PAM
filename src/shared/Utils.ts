import { constants, theme } from ".";

import { USER_DOC } from "shared/constants/databaseConsts";
import { filter } from "lodash";
import firebase from "firebase";
import moment from "moment";

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
    if (cvLength < 7) return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;
    return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`;
  }
};

export const hasErrors = (key: string, errors: string[]) => {
  return errors.includes(key) ? { borderBottomColor: theme.colors.red } : null;
};

/**
 * This function selects the correct property/unit type icon for a property
 * @param type
 */
export const getPropertyTypeIcons = (type: string) => {
  let imagePath = "";
  let newWidth, newHeight;

  switch (type) {
    case constants.PROPERTY_TYPES.APT_CONDO:
      imagePath = require("../assets/icons/prop_type_apartment.png");
      break;
    case constants.PROPERTY_TYPES.SINGLE_FAM:
      imagePath = require("../assets/icons/prop_type_sfh.png");
      break;
    case constants.PROPERTY_TYPES.TOWNHOUSE:
      imagePath = require("../assets/icons/prop_type_townhouse.png");
      newWidth = 50;
      newHeight = 50;
      break;
    case constants.PROPERTY_TYPES.MULTI_FAM:
      imagePath = require("../assets/icons/prop_type_multiplex.png");
      newWidth = 50;
      newHeight = 50;
      break;
    default:
      break;
  }

  return {
    imagePath,
    newWidth,
    newHeight,
  };
};

/**
 * This function retrieves the default image of each property if there are no
 * images available. If there are, just return the original image
 * @param image
 * @param type
 */
export const getPropertyImage = (images: any[], type: string) => {
  if (!images || images.length === 0) {
    switch (type) {
      case constants.PROPERTY_TYPES.APT_CONDO:
        return {
          uri:
            "https://firebasestorage.googleapis.com/v0/b/pam-property-manager.appspot.com/o/images%2Fdefault_images%2Fapartment_default.png?alt=media&token=b9a3d245-de18-4a44-b37f-6d953b40a0d9",
        };
      case constants.PROPERTY_TYPES.SINGLE_FAM:
        return {
          uri:
            "https://firebasestorage.googleapis.com/v0/b/pam-property-manager.appspot.com/o/images%2Fdefault_images%2Fdefault_house_img_circle.png?alt=media&token=1368be1e-2961-4c79-a49c-ac0044e8d825",
        };
      case constants.PROPERTY_TYPES.TOWNHOUSE:
        return {
          uri:
            "https://firebasestorage.googleapis.com/v0/b/pam-property-manager.appspot.com/o/images%2Fdefault_images%2Fdefault_townhouse.png?alt=media&token=21c41548-d75c-4989-a471-0884b8da3462",
        };
      case constants.PROPERTY_TYPES.MULTI_FAM:
        return {
          uri:
            "https://firebasestorage.googleapis.com/v0/b/pam-property-manager.appspot.com/o/images%2Fdefault_images%2Fmultiplex_default.png?alt=media&token=6a8f471c-cb78-46c2-b74a-6714765b1be8",
        };
      default:
        return;
    }
  } else {
    return {
      uri: images[0].downloadPath && images[0].downloadPath !== "" ? images[0].downloadPath : images[0].uri,
    };
  }
};

/**
 * Formats number with comma separated pattern
 * @param value
 */
export const formatNumber = (value: any) => {
  let newValue = value;

  if (value) {
    if (typeof value === "string") {
      newValue = Number(value.replaceAll(",", ""));
    }

    return newValue.toLocaleString();
  }

  return 0;
};

/**
 * This function takes in an actual value and a raw value (amountState) and will
 * format the amount into currency starting from cents
 * @param inputValue
 * @param amountState
 */
export const formatCurrencyFromCents = (inputValue: string, amountState: string) => {
  let formattedAmt = "";
  let tempValue = inputValue.slice(-1);
  let rawVal = amountState + tempValue;

  if (rawVal.length === 1) {
    formattedAmt = "0.0" + rawVal;
  } else if (rawVal.length === 2) {
    formattedAmt = "0." + rawVal;
  } else {
    let intAmount = rawVal.slice(0, rawVal.length - 2);
    let centAmount = rawVal.slice(-2);

    formattedAmt = intAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + centAmount;
  }

  return { formattedAmt, rawVal };
};

/**
 * Gets difference of time in days
 * @param startDate
 * @param endDate
 */
export const getDaysDiffFrom = (startDate: any, endDate: any, inclusive: boolean = false) => {
  const start = moment(new Date(startDate), moment.ISO_8601);
  const end = moment(new Date(endDate), moment.ISO_8601);

  if (!start.isValid() || !end.isValid()) {
    return;
  }

  const diff = end.diff(start, "days");

  if (inclusive) {
    return diff + 1;
  }

  return diff;
};

/**
 * Formats a string to either plural or singular based on provided parameters
 * @param str
 * @param num
 */
export const formatPlural = (str: string, num: number) => {
  if (num && num > 1) {
    return str + "s";
  }

  return str;
};

/**
 * This function retrieves data from an input of IDs
 * Ex: Property:
 * [{
 *   tenantIds: [1, 2, 3]
 * }]
 *
 * Based on the property array above, this will return all tenant objects that has ID 1, 2, 3
 * @param ids
 * @param dataToFilter
 */
export const getDataFromProperty = (ids: number[], dataToFilter: object[]) => {
  let result: object[] = [];

  // Loop on each IDs and build an array
  if (ids && ids.length) {
    ids.forEach((id: number) => {
      result.push(filter(dataToFilter, (e: any) => e.id === id)[0]);
    });
  }

  return result.filter((res) => res !== undefined);
};

/**
 * This function takes in 2 parameters, startDate and payPeriod and returns a
 * moment calculated date based on selected time period.
 * Example: If user selects "MONTHLY" as their pay period on 3/12/2021,
 * then the next payment date will be calculated to 4/12/2021
 *
 * @param startDate
 * @param payPeriod
 */
export const getNextPaymentDate = (startDate: string, payPeriod: string) => {
  let timeToAdd = -1;
  let dateType: any;

  switch (payPeriod) {
    case constants.RECURRING_PAYMENT_TYPE.ONE_TIME:
      timeToAdd = 0;
      dateType = "days";
      break;
    case constants.RECURRING_PAYMENT_TYPE.DAILY:
      timeToAdd = 1;
      dateType = "days";
      break;
    case constants.RECURRING_PAYMENT_TYPE.WEEKLY:
      timeToAdd = 7;
      dateType = "days";
      break;
    case constants.RECURRING_PAYMENT_TYPE.BIWEEKLY:
      timeToAdd = 14;
      dateType = "days";
      break;
    case constants.RECURRING_PAYMENT_TYPE.MONTHLY:
      timeToAdd = 1;
      dateType = "months";
      break;
    case constants.RECURRING_PAYMENT_TYPE.BIMONTHLY:
      timeToAdd = 2;
      dateType = "months";
      break;
    case constants.RECURRING_PAYMENT_TYPE.QUARTERLY:
      timeToAdd = 3;
      dateType = "months";
      break;
    case constants.RECURRING_PAYMENT_TYPE.SEMI_ANNUALLY:
      timeToAdd = 6;
      dateType = "months";
      break;
    case constants.RECURRING_PAYMENT_TYPE.ANNUALLY:
      timeToAdd = 12;
      dateType = "months";
      break;
    default:
      break;
  }

  if (timeToAdd >= 0) {
    return moment(new Date(startDate), moment.ISO_8601).add(timeToAdd, dateType).format("MM/DD/YYYY");
  }
};

/**
 * This function only updates an object on an array of objects
 * This will most likely be removed when the API gets built
 * @param objectToUpdate
 * @param originalArray
 */
export const updateArrayOfObjects = (objectToUpdate: any, originalArray: any[]) => {
  return originalArray.map((p: any, index: number) => {
    if (p.id === objectToUpdate.id) {
      originalArray[index] = objectToUpdate;
    }
  });
};

export const filterArrayForTimePeriod = (array: any[], prop: string, timePeriod: string) => {
  switch (timePeriod) {
    case constants.RECURRING_PAYMENT_TYPE.MONTHLY:
      const curMonth = new Date().getMonth() + 1;
      return array.filter((item) => moment(new Date(item[prop]), moment.ISO_8601).month() + 1 === curMonth);
    default:
      return;
  }
};

/**
 * This function returns the current user's UID
 */
export const getCurrentUserId = () => {
  return firebase.auth().currentUser?.uid;
};

/**
 * This function returns the current user data
 */
export const getCurrentUserData = () => {
  return firebase.firestore().collection(USER_DOC).doc(firebase.auth().currentUser?.uid);
};

/**
 * This function takes in an array, the original index and the updated index to the new position
 * @param array
 * @param fromIndex
 * @param toIndex
 */
export const updateArrayPosition = (array: any[], fromIndex: number, toIndex: number) => {
  return ([array[fromIndex], array[toIndex]] = [array[toIndex], array[fromIndex]]);
};

/**
 * This function takes in an array of objects and returns a boolean to determine
 * if the specified value exists within said array of objects
 * @param arr
 * @param key
 * @param valueToFind
 */
export const doesElementExistArrObj = (arr: any[], key: string, valueToFind: any) => {
  return arr.find((item) => item[key] === valueToFind) != null;
};

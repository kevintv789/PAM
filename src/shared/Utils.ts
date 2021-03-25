import { constants, theme } from ".";

import { filter } from "lodash";
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
export const formatMobileNumber = (
  currentState: string,
  previousState: string
) => {
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
export const getPropertyImage = (image: any, type: string) => {
  if (!image) {
    switch (type) {
      case constants.PROPERTY_TYPES.APT_CONDO:
        return require("../assets/images/apartment_default.png");
      case constants.PROPERTY_TYPES.SINGLE_FAM:
        return require("../assets/images/default_house_img_circle.png");
      case constants.PROPERTY_TYPES.TOWNHOUSE:
        return require("../assets/images/prop_type_townhouse.png");
      case constants.PROPERTY_TYPES.MULTI_FAM:
        return require("../assets/images/multiplex_default.png");
      default:
        break;
    }
  }

  return image;
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
export const formatCurrencyFromCents = (
  inputValue: string,
  amountState: string
) => {
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

    formattedAmt =
      intAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + centAmount;
  }

  return { formattedAmt, rawVal };
};

/**
 * Gets difference of time in days
 * @param startDate
 * @param endDate
 */
export const getDaysDiffFrom = (
  startDate: any,
  endDate: any,
  inclusive: boolean = false
) => {
  const start = moment(startDate);
  const end = moment(endDate);

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
    return moment(startDate).add(timeToAdd, dateType).format("MM/DD/YYYY");
  }
};

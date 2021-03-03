import { PropertyTypes } from "./constants/mockData";
import { constants } from "./constants";

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
export const formatNumber = (value: any) =>
  new Intl.NumberFormat().format(value);

import {
  PROPERTIES_DOC,
  PROPERTY_FINANCES_DOC,
} from "shared/constants/databaseConsts";

import { TENANTS_DOC } from "./../../shared/constants/databaseConsts";
import firebase from "firebase";
import { orderBy } from "lodash";
import { updateArrayOfObjects } from "shared/Utils";

// Action Types/Action Creators
const GET_FINANCES = "GET_FINANCES";
const GET_TENANTS = "GET_TENANTS";
const GET_PROPERTIES = "GET_PROPERTIES";
const ADD_FINANCES = "ADD_FINANCES";
const ADD_TENANT = "ADD_TENANT";
const UPDATE_PROPERTY = "UPDATE_PROPERTY";
const UPDATE_TENANT = "UPDATE_TENANT";
const UPDATE_FINANCES = "UPDATE_FINANCES";

export const getPropertyFinances = () => {
  return (dispatch: any) => {
    firebase
      .firestore()
      .collection(PROPERTY_FINANCES_DOC)
      .onSnapshot((snapshot) => {
        if (snapshot.docs && snapshot.docs.length > 0) {
          const finances = snapshot.docs.map((i: any) => i.data());
          dispatch({ type: GET_FINANCES, payload: finances });
        } else {
          dispatch({ type: GET_FINANCES, payload: [] });
        }
      });
  };
};

export const getTenants = () => {
  return (dispatch: any) => {
    firebase
      .firestore()
      .collection(TENANTS_DOC)
      .onSnapshot((snapshot) => {
        if (snapshot.docs && snapshot.docs.length > 0) {
          const tenants = snapshot.docs.map((i) => i.data());
          dispatch({ type: GET_TENANTS, payload: tenants });
        }
      });
  };
};

export const getPropertiesByIds = (propertyIds: any[]) => {
  if (propertyIds && propertyIds.length > 0) {
    return (dispatch: any) => {
      firebase
        .firestore()
        .collection(PROPERTIES_DOC)
        .where(firebase.firestore.FieldPath.documentId(), "in", propertyIds)
        .onSnapshot((snapshot) => {
          if (snapshot.docs && snapshot.docs.length > 0) {
            let properties = snapshot.docs.map((i) => i.data());
            properties = orderBy(properties, ["createdOn"], ["desc"]);
            dispatch({ type: GET_PROPERTIES, payload: properties });
          }
        });
    };
  }
};

export const addFinances = (payload: any) => ({ type: ADD_FINANCES, payload });
export const addTenant = (payload: any) => ({ type: ADD_TENANT, payload });
export const updateProperty = (payload: any) => ({
  type: UPDATE_PROPERTY,
  payload,
});
export const updateTenant = (payload: any) => ({
  type: UPDATE_TENANT,
  payload,
});
export const updateFinances = (payload: any) => ({
  type: UPDATE_FINANCES,
  payload,
});

// State & Reducer
const initialState = {
  properties: [],
  finances: [],
  tenants: [],
};

export const propertyReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case GET_PROPERTIES:
      return { ...state, properties: action.payload };
    case GET_FINANCES:
      return { ...state, finances: action.payload };
    case GET_TENANTS:
      return { ...state, tenants: action.payload };
    case ADD_FINANCES:
      return { ...state, finances: [...state.finances, action.payload] };
    case ADD_TENANT:
      return { ...state, tenants: [...state.tenants, action.payload] };
    case UPDATE_PROPERTY:
      const propertyToUpdate = action.payload;
      const properties: any[] = state.properties;

      // find which property to update
      updateArrayOfObjects(propertyToUpdate, properties);

      return { ...state, properties };
    case UPDATE_TENANT:
      const tenantToUpdate = action.payload;
      const tenants: any[] = state.tenants;

      // find which tenant to update
      updateArrayOfObjects(tenantToUpdate, tenants);

      return { ...state, tenants };
    case UPDATE_FINANCES:
      const financeToUpdate = action.payload;
      const finances: any[] = state.finances;

      // find which expense to update
      updateArrayOfObjects(financeToUpdate, finances);

      return { ...state, finances };
    default:
      return state;
  }
};

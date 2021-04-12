import { PROPERTIES_DOC, USER_DOC } from "shared/constants/databaseConsts";

import { Dispatch } from "react";
import { TENANTS_DOC } from "./../../shared/constants/databaseConsts";
import { filter } from "lodash";
import firebase from "firebase";
import { mockData } from "shared"; // remove when we get real data
import { updateArrayOfObjects } from "shared/Utils";

// Action Types/Action Creators
const GET_EXPENSE = "GET_EXPENSE";
const GET_TENANTS = "GET_TENANTS";
const GET_PROPERTIES = "GET_PROPERTIES";
const ADD_FINANCES = "ADD_FINANCES";
const ADD_PROPERTY = "ADD_PROPERTY";
const ADD_TENANT = "ADD_TENANT";
const UPDATE_PROPERTY = "UPDATE_PROPERTY";
const UPDATE_TENANT = "UPDATE_TENANT";
const UPDATE_FINANCES = "UPDATE_FINANCES";

export const getExpense = () => {
  return (dispatch: any) => {
    dispatch({ type: GET_EXPENSE });
  };
};

export const getTenants = (tenantIds: string[]) => {
  return (dispatch: any) => {
    firebase
      .firestore()
      .collection(TENANTS_DOC)
      .where(firebase.firestore.FieldPath.documentId(), "in", tenantIds)
      .onSnapshot((snapshot) => {
        if (snapshot.docs && snapshot.docs.length > 0) {
          const tenants = snapshot.docs.map((i) => i.data());
          dispatch({ type: GET_TENANTS, payload: tenants });
        }
      });
  };
};

export const getPropertiesByIds = (propertyIds: any[]) => {
  return (dispatch: any) => {
    firebase
      .firestore()
      .collection(PROPERTIES_DOC)
      .where(firebase.firestore.FieldPath.documentId(), "in", propertyIds)
      .onSnapshot((snapshot) => {
        if (snapshot.docs && snapshot.docs.length > 0) {
          const properties = snapshot.docs.map((i) => i.data());
          dispatch({ type: GET_PROPERTIES, payload: properties });
        }
      });
  };
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
  finances: mockData.PropertyFinances,
  tenants: [],
};

export const propertyReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case GET_PROPERTIES:
      return { ...state, properties: action.payload };
    case GET_EXPENSE:
      return { ...state };
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

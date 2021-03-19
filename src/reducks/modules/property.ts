import { filter } from "lodash";
import { mockData } from "shared"; // remove when we get real data

// Action Types/Action Creators
const GET_EXPENSE = "GET_EXPENSE";
const GET_TENANTS = "GET_TENANTS";
const GET_PROPERTIES = "GET_PROPERTIES";
const ADD_EXPENSE = "ADD_EXPENSE";
const ADD_PROPERTY = "ADD_PROPERTY";

export const getExpense = () => {
  return (dispatch: any) => {
    dispatch({ type: GET_EXPENSE });
  };
};
export const getTenants = () => ({ type: GET_TENANTS });
export const getPropertiesByIds = (propertyIds: number[]) => ({
  type: GET_PROPERTIES,
  propertyIds,
});
export const addExpense = (payload: any) => ({ type: ADD_EXPENSE, payload });
export const addProperty = (payload: any) => ({ type: ADD_PROPERTY, payload });

// State & Reducer
const initialState = {
  properties: [],
  expenses: [],
  tenants: [],
};

export const propertyReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case GET_PROPERTIES:
      const allProperties = mockData.Properties;
      const propertyIdsToFilter = action.propertyIds;
      let filteredProperties: object[] = [];

      // Filter each property based on the list of IDs and return a new list of properties
      propertyIdsToFilter.forEach((ids: number) => {
        filteredProperties.push(filter(allProperties, (p) => p.id === ids)[0]);
      });

      return { ...state, properties: filteredProperties };
    case GET_EXPENSE:
      return { ...state, expenses: mockData.Expenses };
    case GET_TENANTS:
      return { ...state, tenants: mockData.Tenants };
    case ADD_EXPENSE:
      return { ...state, expenses: [...state.expenses, action.payload] };
    case ADD_PROPERTY:
      return { ...state, properties: [...state.properties, action.payload] };
    default:
      return state;
  }
};

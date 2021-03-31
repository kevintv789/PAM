import { filter } from "lodash";
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
export const getTenants = () => ({ type: GET_TENANTS });
export const getPropertiesByIds = (propertyIds: number[]) => ({
  type: GET_PROPERTIES,
  propertyIds,
});
export const addFinances = (payload: any) => ({ type: ADD_FINANCES, payload });
export const addProperty = (payload: any) => ({ type: ADD_PROPERTY, payload });
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
  tenants: mockData.Tenants,
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
      return { ...state };
    case GET_TENANTS:
      return { ...state };
    case ADD_FINANCES:
      return { ...state, finances: [...state.finances, action.payload] };
    case ADD_PROPERTY:
      return { ...state, properties: [...state.properties, action.payload] };
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

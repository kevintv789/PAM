// Action Types/Action Creators
const SET_EXPENSE = "SET_EXPENSE";
const SET_TENANTS = "SET_TENANTS";
const ADD_EXPENSE = "ADD_EXPENSE";

// export const setExpense = (payload: any) => ({ type: SET_EXPENSE, payload });
export const setExpense = (payload: any) => {
  return (dispatch: any) => {
    dispatch({ type: SET_EXPENSE, payload });
  };
};
export const setTenants = (payload: any) => ({ type: SET_TENANTS, payload });
export const addExpense = (payload: any) => ({ type: ADD_EXPENSE, payload });

// State & Reducer
const initialState = {
  expenses: [],
  tenants: [],
};

export const propertyReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_EXPENSE:
      return { ...state, expenses: action.payload };
    case SET_TENANTS:
      return { ...state, tenants: action.payload };
    case ADD_EXPENSE:
      return { ...state, expenses: [...state.expenses, action.payload] };
    default:
      return state;
  }
};

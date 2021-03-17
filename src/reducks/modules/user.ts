// Action Types
const GET_USER = "GET_USER";

// Action Creators
export const getUser = (userData: any) => ({
  type: GET_USER,
  payload: userData,
});

// Reducer
const initialState = {
  user: undefined,
};

export const userReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case GET_USER:
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

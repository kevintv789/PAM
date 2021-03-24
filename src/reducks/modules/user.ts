import { mockData } from "shared";
// Action Types
const GET_USER = "GET_USER";

// Action Creators
export const getUser = () => ({
  type: GET_USER,
});

// Reducer
const initialState = {
  user: undefined,
};

export const userReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case GET_USER:
      return { ...state, user: mockData.User };
    default:
      return state;
  }
};

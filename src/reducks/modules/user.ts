import "firebase/firestore";

import { USER_DOC } from "shared/constants/databaseConsts";
import firebase from "firebase";

// Action Types
const GET_USER = "GET_USER";

// Action Creators
export const getUser = (payload: any) => {
  return (dispatch: any) => {
    dispatch({ type: GET_USER, payload });
    // firebase
    //   .firestore()
    //   .collection(USER_DOC)
    //   .doc(firebase.auth().currentUser?.uid)
    //   .get()
    //   .then((snapshot) => {
    //     if (snapshot.exists) {
    //       dispatch({ type: GET_USER, payload: snapshot.data() });
    //     }
    //   });
  };
};

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

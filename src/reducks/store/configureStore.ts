import { applyMiddleware, combineReducers, createStore } from "redux";

import { composeWithDevTools } from "redux-devtools-extension";
import { propertyReducer } from "reducks/modules/property";
import thunk from "redux-thunk";
// reducers
import { userReducer } from "reducks/modules/user";

const rootReducer = combineReducers({
  userState: userReducer,
  propertyState: propertyReducer,
});

const configureStore = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default configureStore;

import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./reducers/index";
import reduxImmutableStateInvariant from "redux-immutable-state-invariant";
import thunk from "redux-thunk";

declare global {
  interface Window { __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any; }
}

export default function configureStore() {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // add support for Redux dev tools

  return createStore(
    rootReducer,
    {},
    composeEnhancers(applyMiddleware(thunk, reduxImmutableStateInvariant()))
  );
}

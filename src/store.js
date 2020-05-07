import { createStore, combineReducers } from "redux";
import boxReducer from "./box-configurer/ducks";

const rootReducer = combineReducers({
  boxConfiguration: boxReducer,
});

const store = createStore(rootReducer);

export default store;

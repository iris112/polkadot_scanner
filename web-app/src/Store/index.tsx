import { configureStore } from "@reduxjs/toolkit";
import eventDataReducer from './eventDataSlice';
import filterEventReducer from './filterEventSlice';

export default configureStore({
  reducer: {
    resultData: eventDataReducer,
    filterEventName: filterEventReducer
  },
});
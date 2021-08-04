import { createSlice } from '@reduxjs/toolkit';
import { EventDataState } from './eventDataSlice';

export const filterEventSlice = createSlice({
  name: "filterEventName",
  initialState: "",
  reducers: {
    setFilterEventName: (state, action) => action.payload
  }
});

export const { setFilterEventName } = filterEventSlice.actions;

export const selectFilterEventName = (state: EventDataState) => state.filterEventName;

export default filterEventSlice.reducer;
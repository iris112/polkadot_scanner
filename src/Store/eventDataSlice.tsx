import { createSlice } from '@reduxjs/toolkit';
import { BlockEvent } from '../Data';

export type EventDataState = { 
  resultData: any; 
  filterEventName: string; 
};

export const resultDataSlice = createSlice({
  name: "resultData",
  initialState: new Array<BlockEvent>(),
  reducers: {
    setResultData: (state, action) => [...action.payload]
  }
});

export const { setResultData } = resultDataSlice.actions;

export const selectResultData = (state: EventDataState) => {
  return state.resultData;
};

export default resultDataSlice.reducer;


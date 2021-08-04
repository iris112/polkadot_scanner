import eventDataReducer, { setResultData } from './eventDataSlice';
import filterEventReducer, { setFilterEventName } from './filterEventSlice';
import { BlockEvent } from '../Data';

test('should return the initial state', () => {
  expect(eventDataReducer(undefined, {type: ""})).toEqual([]);
  expect(filterEventReducer(undefined, {type: ""})).toEqual("");
})

test('should handle a set resultData', () => {
  const previousState = new Array<BlockEvent>();
  const actionPayload: BlockEvent = {blockNumber: 1, eventName: 'AAA', eventArgs: 'Args', additionals: "aaa"};
  expect(eventDataReducer(previousState, setResultData([actionPayload]))).toEqual([actionPayload])
})

test('should handle a set filterEvent', () => {
    const previousState = "";
    const actionPayload = "event1";
    expect(filterEventReducer(previousState, setFilterEventName(actionPayload))).toEqual(actionPayload)
  })
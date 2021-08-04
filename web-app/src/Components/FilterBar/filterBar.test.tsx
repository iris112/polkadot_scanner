import { fireEvent, render, screen } from "@testing-library/react"
import FilterBar from './';
import { Provider } from 'react-redux';
import store from '../../Store';
import { act } from "react-dom/test-utils";

describe("filterBar component", (): void => {
  const promise = Promise.resolve();
  let eventName: HTMLInputElement;

  beforeEach((): void => {
    render(<Provider store={store}><FilterBar /></Provider>);
    eventName = screen.getByTestId("filter-event").querySelector('input') as HTMLInputElement;
  });

  it("renders default state", (): void => {    
    expect(eventName.value).toBe("");
  });

  it("type event name", async (): Promise<void> => {
    fireEvent.change(eventName, { target: { value: 'abc' } });
    await act(() => promise)

    expect(eventName.value).toBe("abc");   
  });
});
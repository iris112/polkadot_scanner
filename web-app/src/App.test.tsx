import { fireEvent, render, screen } from "@testing-library/react"
import App from './App';
import { Provider } from 'react-redux';
import store from './Store';
import { act } from "react-dom/test-utils";

describe("polkadot scanner form", (): void => {
  const promise = Promise.resolve();
  let startNum: HTMLInputElement;
  let endNum: HTMLInputElement;
  let endPoint: HTMLInputElement;
  let btnScan: HTMLButtonElement;

  beforeEach((): void => {
    render(<Provider store={store}><App /></Provider>);

    startNum = screen.getByTestId("start-number").querySelector('input') as HTMLInputElement;
    endNum = screen.getByTestId("end-number").querySelector('input') as HTMLInputElement;
    endPoint = screen.getByTestId("end-point").querySelector('input') as HTMLInputElement;
    btnScan = screen.getByTestId("btn-scan") as HTMLButtonElement;
  });

  it("renders default state", (): void => {    
    expect(startNum.value).toBe("0");
    expect(endNum.value).toBe("0");
    expect(endPoint.value).toBe("wss://rpc.polkadot.io");
    expect(btnScan).toHaveClass("Mui-disabled");
  });

  it("validation of start block number", async (): Promise<void> => {
    // Numberic check
    fireEvent.change(startNum, { target: { value: 'a' } });
    await act(() => promise)

    let errorString = screen.getByTestId("start-number").querySelector('p') as HTMLParagraphElement;
    expect(startNum.value).toBe("a");   
    expect(errorString.textContent).toContain('Must be a number');
    expect(btnScan).toHaveClass("Mui-disabled");

    // start < end check
    fireEvent.change(startNum, { target: { value: '1' } });
    await act(() => promise)

    errorString = screen.getByTestId("end-number").querySelector('p') as HTMLParagraphElement;
    expect(startNum.value).toBe("1");
    expect(endNum.value).toBe("0");   
    expect(errorString.textContent).toContain('Should be begger than start block number');
    expect(btnScan).toHaveClass("Mui-disabled");

    // positive check
    fireEvent.change(startNum, { target: { value: '-2' } });
    await act(() => promise)

    errorString = screen.getByTestId("start-number").querySelector('p') as HTMLParagraphElement;
    expect(startNum.value).toBe("-2");   
    expect(errorString.textContent).toContain('Must be greater than zero');
    expect(btnScan).toHaveClass("Mui-disabled");
  });

  it("validation of end block number", async (): Promise<void> => {
    // Numberic check
    fireEvent.change(endNum, { target: { value: 'a' } });
    await act(() => promise)

    let errorString = screen.getByTestId("end-number").querySelector('p') as HTMLParagraphElement;
    expect(endNum.value).toBe("a");   
    expect(errorString.textContent).toContain('Must be a number');
    expect(btnScan).toHaveClass("Mui-disabled");

    // start < end check
    fireEvent.change(startNum, { target: { value: '5' } });
    fireEvent.change(endNum, { target: { value: '3' } });
    await act(() => promise)

    errorString = screen.getByTestId("end-number").querySelector('p') as HTMLParagraphElement;
    expect(startNum.value).toBe("5");
    expect(endNum.value).toBe("3");   
    expect(errorString.textContent).toContain('Should be begger than start block number');
    expect(btnScan).toHaveClass("Mui-disabled");
  });

  it("validation of end point", async (): Promise<void> => {
    // URL check
    fireEvent.change(endPoint, { target: { value: 'abcdefg' } });
    await act(() => promise)

    let errorString = screen.getByTestId("end-point").querySelector('p') as HTMLParagraphElement;
    expect(endPoint.value).toBe("abcdefg");   
    expect(errorString.textContent).toContain('Must be a URL format!');
    expect(btnScan).toHaveClass("Mui-disabled");
  });

  it("progress bar appear after click scan button", async (): Promise<void> => {
    fireEvent.change(startNum, { target: { value: '1' } });
    fireEvent.change(endNum, { target: { value: '2' } });
    await act(() => promise)

    fireEvent.click(btnScan);
    await act(() => promise)

    let progressBar = screen.getByTestId("progress-bar") as HTMLDivElement;
    expect(progressBar.getAttribute("aria-valuenow")).toBe("1");
  });
});

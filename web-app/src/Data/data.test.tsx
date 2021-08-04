import { jest } from '@jest/globals';
import { ApiPromise, WsProvider } from '@polkadot/api';
import parseData, { BlockEvent } from './';

jest.setTimeout(30000);

describe('misc online tests', (): void => {
  let api: ApiPromise;

  beforeEach(async (): Promise<void> => {
    const provider = new WsProvider('wss://rpc.polkadot.io');
    api = await ApiPromise.create({ provider });
  });

  afterEach(async (): Promise<void> => {
    await api.disconnect();
  });
  
  it('handles map keys', async () => {  
  
    const resultData: Array<BlockEvent> = await parseData(api, 1);
    expect(resultData.length).toBe(2);
    expect(resultData[0].blockNumber).toBe(1);
    expect(resultData[0].eventName).toBe('ExtrinsicSuccess');
    expect(resultData[0].eventArgs).not.toBe(null);
    expect(resultData[0].additionals).not.toBe(null);
  });
});
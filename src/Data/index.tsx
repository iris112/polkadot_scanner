import { ApiPromise } from '@polkadot/api';

export interface BlockEvent {
  blockNumber: number;
  eventName: string;
  eventArgs: string;
  additionals: string;
}

export default async function parseData(api: ApiPromise, blockNumber: number): Promise<Array<BlockEvent>> {
  const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
  const allRecords = await api.query.system.events.at(blockHash);
  const blockEvents: Array<BlockEvent> = [];
  allRecords.forEach((record) => {
    // Extract the phase, event and the event types
    const { event } = record;
    const types = event.typeDef;

    // Extract the arguments info
    const args: string = event.data.map((data, index) => `${types[index].type}: ${data.toString()}`).join("\n");

    blockEvents.push({
      blockNumber,
      eventName: event.method ?? event.meta.name.toString(),
      eventArgs: args,
      additionals: event.meta.docs.toString()
    })
  })

  return blockEvents;
}
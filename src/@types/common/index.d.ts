type ExtName = 'share-on-nostr-safari';

type Packet = { ext: ExtName } & (
  | { kind: 'share'; tabId: number; text: string; url: string }
  | { kind: 'relays'; relays: string[] }
  | { kind: 'result'; url: string; success: boolean }
  | { kind: 'updatePreferences' }
);

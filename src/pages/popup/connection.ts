declare global {
  interface Window {
    __shareOnNostr__loaded: boolean;
  }
}

export async function connectToActiveTab(params: { inject: boolean }): Promise<{
  tabId: number;
  title: string;
  url: string;
}> {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  const { id: tabId = 0, url = '', title = '' } = tab;

  if (params.inject) {
    chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        if (window.__shareOnNostr__loaded) {
          return;
        }
        window.__shareOnNostr__loaded = true;

        injectResourceScript('js/share-on-nostr-safari.js');

        window.addEventListener('message', async ({ data }: MessageEvent<Packet>) => {
          if (data.ext !== 'share-on-nostr-safari') {
            return;
          }

          if (data.kind === 'relays' || data.kind === 'result') {
            chrome.runtime.sendMessage(data);
          }
        });
        chrome.runtime.onMessage.addListener((packet: Packet) => {
          if (packet.ext !== 'share-on-nostr-safari') {
            return;
          }

          if (packet.kind === 'share') {
            window.postMessage(packet);
          }
        });

        function injectResourceScript(path: string) {
          const script = document.createElement('script');
          script.setAttribute('async', 'false');
          script.setAttribute('type', 'text/javascript');
          script.setAttribute('src', chrome.runtime.getURL(path));
          document.head.appendChild(script);
        }
      },
    });
  }

  return {
    tabId,
    title,
    url,
  };
}

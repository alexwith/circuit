const EVENT_NAME = "onCanvasElementChange";

export function dispatchElementChange() {
  const event = new Event(EVENT_NAME);
  document.dispatchEvent(event);
}

export function subscribeElementChange(listener: () => void) {
  document.addEventListener(EVENT_NAME, listener);
}

export function unsubscribeElementChange(listener: () => void) {
  document.removeEventListener(EVENT_NAME, listener);
}

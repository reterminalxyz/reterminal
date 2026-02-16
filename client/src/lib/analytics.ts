export function getOrCreateSession(): string {
  let token = localStorage.getItem('liberta_token');
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem('liberta_token', token);
  }
  return token;
}

function getSource(): "pwa" | "web" {
  if (window.matchMedia('(display-mode: standalone)').matches) return "pwa";
  if ((navigator as any).standalone === true) return "pwa";
  return "web";
}

export function trackEvent(eventName: string): void {
  try {
    const sessionId = getOrCreateSession();
    const source = getSource();
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, event_name: eventName, source }),
      keepalive: true,
    }).catch(() => {});
  } catch (_) {}
}

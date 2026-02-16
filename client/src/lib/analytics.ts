export function getOrCreateSession(): string {
  let token = localStorage.getItem('liberta_token');
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem('liberta_token', token);
  }
  return token;
}

export function trackEvent(eventName: string): void {
  try {
    const sessionId = getOrCreateSession();
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, event_name: eventName }),
      keepalive: true,
    }).catch(() => {});
  } catch (_) {}
}

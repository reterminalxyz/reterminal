let deferredPrompt: any = null;
let promptConsumed = false;

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e: Event) => {
    e.preventDefault();
    deferredPrompt = e;
    promptConsumed = false;
  });
}

export function getDeferredPrompt(): any {
  return deferredPrompt;
}

export async function triggerInstallPrompt(): Promise<"accepted" | "dismissed" | null> {
  if (!deferredPrompt || promptConsumed) return null;
  try {
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    promptConsumed = true;
    deferredPrompt = null;
    return result.outcome;
  } catch (_) {
    deferredPrompt = null;
    promptConsumed = true;
    return null;
  }
}

export function isPromptAvailable(): boolean {
  return deferredPrompt !== null && !promptConsumed;
}

export function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

export function isAndroid(): boolean {
  return /Android/.test(navigator.userAgent);
}

declare global {
  var __SERVER__: boolean;
}

if (typeof window === 'undefined') {
  global.__SERVER__ = true;
} else {
  global.__SERVER__ = false;
}

export function isServer() {
  return typeof window === 'undefined';
}

export function assertServer() {
  if (!isServer()) {
    throw new Error('This code should only run on the server');
  }
}

export function assertClient() {
  if (isServer()) {
    throw new Error('This code should only run on the client');
  }
}

export function truncate({ crypto = false, web = false }) {
  if (crypto) {
    return `${crypto.slice(0, 6)}...${crypto.slice(-4)}`;
  }

  if (web) {
    return `${web.slice(0, 35)}...`;
  }

  return 'unknown';
}


export function isValidUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    try {
      const url = new URL(`https://${str}`);
      return url.hostname.includes('.') || url.hostname === 'localhost';
    } catch {
      return false;
    }
  }
}


export function removeHttp(url) {
  return url.replace(/^https?:\/\//, '');
}

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
  const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/i;
  if (!urlRegex.test(str)) return false;


  try {
    new URL(str);
    return true;
  } catch {
    try {
      const url = new URL(`https://${str}`);
      return url.hostname.includes('.');
    } catch {
      return false;
    }
  }
}


export function removeHttp(url) {
  return url.replace(/^https?:\/\//, '');
}


export function normalizeError(error) {
    const detail = error?.response?.data?.detail;

    if (Array.isArray(detail)) {
        return detail.map(e => e.msg || "Unknown error");
    }

    return [
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.message ||
        "Unknown error"
    ];
}

export function setCookie(name, value, hours) {
  const maxAge = hours * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; samesite=Strict`;
}

export function getCookie(name) {
  const match = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)")
  );
  return match ? decodeURIComponent(match[2]) : null;
}

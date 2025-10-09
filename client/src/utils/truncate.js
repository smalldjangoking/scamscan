function truncate({ crypto = false, web = false }) {
  if (crypto) {
    return `${crypto.slice(0, 6)}...${crypto.slice(-4)}`;
  }

  if (web) {
    return `${web.slice(0, 35)}...`;
  }

  return 'unknown';
}

export default truncate;
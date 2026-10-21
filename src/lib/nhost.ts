const subdomain = process.env.NHOST_SUBDOMAIN;
const region = process.env.NHOST_REGION;

export const nhostConfig =
  subdomain && region ? { subdomain, region } : null;

export const isNhostConfigured = nhostConfig !== null;

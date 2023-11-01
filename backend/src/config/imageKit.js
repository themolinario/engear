import Imagekit from 'imagekit';

// Webhook configs
export const WEBHOOK_SECRET = 'whsec_iNip9+IaS0ks/cSAgQlSF3fIc85Fz7WL'; // Copy from Imagekit dashboard
export const WEBHOOK_EXPIRY_DURATION = 300 * 1000; // 300 seconds for example

export const imagekit = new Imagekit({
  publicKey: 'public_+frtqKEUzzbxxZ5YE5/sBwbov5c=',
  urlEndpoint: 'https://ik.imagekit.io/mmolinari',
  privateKey: 'private_/0x9j3kkTtgmTwOKMxf8+LlKrqM=',
})
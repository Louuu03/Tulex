const fetchJWKS = async (jwksUri: string) => {
  const response = await fetch(jwksUri);
  const { keys } = await response.json();
  return keys;
};

const findKeyById = (keys: any[], kid: string): any | undefined =>
  keys.find(key => key.kid === kid);

// Convert a JWKS RSA key to a format usable by the Web Crypto API
const importPublicKey = async (jwk: JsonWebKey): Promise<CryptoKey> => {
  return crypto.subtle.importKey(
    'jwk',
    jwk,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: { name: 'SHA-256' },
    },
    false,
    ['verify']
  );
};

// Decode JWT header without verification to extract the "kid"
const decodeJwtHeader = (token: string): { kid: string } => {
  const [headerEncoded] = token.split('.');
  const buff = Buffer.from(headerEncoded, 'base64');
  const text = buff.toString('ascii');
  return JSON.parse(text);
};

// Verify JWT signature with the public key
const verify = async (
  token: string,
  publicKey: CryptoKey
): Promise<boolean> => {
  const [headerEncoded, payloadEncoded, signatureEncoded] = token.split('.');
  const signatureUint8Array = new Uint8Array(
    Array.from(Buffer.from(signatureEncoded, 'base64'))
  );
  const data = new TextEncoder().encode(
    [headerEncoded, payloadEncoded].join('.')
  );

  return crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    publicKey,
    signatureUint8Array,
    data
  );
};

const jwksUri: string =
  'https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_a3MMsePOp/.well-known/jwks.json';

const verifyToken = async (token: string): Promise<boolean> => {
  try {
    const jwks = await fetchJWKS(jwksUri);
    const decodedHeader = decodeJwtHeader(token);
    const jwk = findKeyById(jwks, decodedHeader.kid);
    if (!jwk) {
      console.error('Key not found');
      return false;
    }

    const publicKey = await importPublicKey(jwk);
    const isValid = await verify(token, publicKey);
    return isValid;
  } catch (error) {
    console.error('Verification error:', error);
    return false;
  }
};
export { verifyToken };

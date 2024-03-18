import jwt, { Secret } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const client = jwksClient({
  jwksUri: `https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_a3MMsePOp/.well-known/jwks.json`,
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback): void {
  client.getSigningKey(header.kid!, (err, key) => {
    var signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

export const verifyToken = async (
  token: string
): Promise<jwt.JwtPayload | undefined> => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey as Secret,
      { algorithms: ['RS256'] },
      (err, decoded) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded as jwt.JwtPayload);
      }
    );
  });
};

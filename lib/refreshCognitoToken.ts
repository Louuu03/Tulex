// utils/refreshToken.ts
import { CognitoIdentityServiceProvider } from 'aws-sdk';

const cognito = new CognitoIdentityServiceProvider({
  region: process.env.AWS_REGION,
});

export async function refreshCognitoToken(
  refreshToken: string
): Promise<CognitoIdentityServiceProvider.InitiateAuthResponse> {
  const params: CognitoIdentityServiceProvider.Types.InitiateAuthRequest = {
    AuthFlow: 'REFRESH_TOKEN_AUTH',
    ClientId: process.env.POOL_CLIENT_ID!,
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
    },
  };

  try {
    const response = await cognito.initiateAuth(params).promise();
    return response;
  } catch (error) {
    console.error('Error refreshing token: ', error);
    throw new Error('Failed to refresh token');
  }
}

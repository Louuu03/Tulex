// utils/refreshToken.ts

type RefreshTokenResponse = {
  id_token: string;
  access_token: string;
  expires_in: number;
  token_type: string;
  refresh_token?: string;
};

export async function refreshCognitoToken(
  refreshToken: string
): Promise<RefreshTokenResponse> {
  const tokenEndpoint = `https://tulex.auth.ap-southeast-1.amazoncognito.com/oauth2/token`; // Replace with your Cognito Domain
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: process.env.POOL_CLIENT_ID!,
    refresh_token: refreshToken,
  });

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`Failed to refresh token: ${response.statusText}`);
  }

  return response.json();
}

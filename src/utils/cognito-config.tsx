import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
  ISignUpResult,
} from 'amazon-cognito-identity-js';
import axios from 'axios';

interface PoolData {
  UserPoolId: string;
  ClientId: string;
  RedirectUri: string;
  Domain: string;
}
interface TokenResponse {
  id_token: string;
  access_token: string;
  refresh_token: string;
}
// Set up your Cognito User Pool data
const poolData: PoolData = {
  UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID as string,
  ClientId: process.env.NEXT_PUBLIC_CLIENT_ID as string,
  RedirectUri: process.env.NEXT_PUBLIC_AUTH_REDIRECT_URI as string,
  Domain: process.env.NEXT_PUBLIC_POOL_DOMAIN as string,
};

const userPool = new CognitoUserPool(poolData);

// Function to handle user login
export const loginUser = async (
  email: string,
  password: string
): Promise<any> => {
  const authenticationDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  });

  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: userPool,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: session => resolve(session),
      onFailure: err => {
        reject(err || 'An unknown error occurred.');
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        // User needs to set a new password
        reject('New password required');
      },
    });
  });
};

// Enhanced Function to handle user sign up and immediate login
export const signUpUser = async (
  email: string,
  password: string,
  additionalAttributes: CognitoUserAttribute[] = []
): Promise<ISignUpResult> => {
  const attributes = additionalAttributes.map(
    attr => new CognitoUserAttribute(attr)
  );

  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, attributes, [], (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      result ? resolve(result) : reject(err);
    });
  });
};

export const verifyEmail = (
  username: string,
  code: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result); // 'SUCCESS' if verification succeeded
      }
    });
  });
};

export const resendVerificationCode = (username: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.resendConfirmationCode((err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result); // Success response
      }
    });
  });
};

export const FacebookLogin = (): void => {
  const url = `${poolData.Domain}/oauth2/authorize?identity_provider=Facebook&redirect_uri=${poolData.RedirectUri}&response_type=code&client_id=${poolData.ClientId}&scope=openid%20profile%20email`;
  // Redirect the user to the Cognito hosted UI
  window.location.assign(url);
};

export const GoogleLogin = (): void => {
  const url = `${poolData.Domain}/oauth2/authorize?identity_provider=Google&redirect_uri=${poolData.RedirectUri}&response_type=code&client_id=${poolData.ClientId}&scope=openid%20profile%20email`;
  // Redirect the user to the Cognito hosted UI
  window.location.assign(url);
};

export const getToken = async (code: string): Promise<TokenResponse> => {
  const url = `${poolData.Domain}/oauth2/token`;
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', poolData.ClientId);
  params.append('redirect_uri', poolData.RedirectUri);
  params.append('code', code);
  try {
    const response = await axios.post(url, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    // You might want to validate or directly map the response here
    const { id_token, access_token, refresh_token } = response.data;

    // Ensure the response data includes all expected fields
    if (!id_token || !access_token || !refresh_token) {
      throw new Error('Missing token fields in the response');
    }

    return { id_token, access_token, refresh_token }; // Return the structured object
  } catch (error) {
    console.error('Error getting token:', error);
    throw error; // Rethrow the error if you want calling function to handle it
  }
};

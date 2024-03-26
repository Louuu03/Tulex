import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken'; // Assuming you're using JWT for tokens
import { verifyToken } from '../lib/verifyCognitoToken';
import { refreshCognitoToken } from '../lib/refreshCognitoToken';

export const middleware = async (req: NextRequest, next: Function) => {
  let idToken = req.cookies.get('idToken')?.value;
  let accessToken = req.cookies.get('accessToken')?.value;
  let refreshToken = req.cookies.get('refreshToken')?.value;
  let userId: string | (() => string) = req.cookies.get('userId')
    ?.value as string;
  let isNewUser: boolean | string = req.cookies.get('isNewUser')
    ?.value as string;
  let resetHeaders: string[] = [];
  const res = NextResponse.next();

  // set headers
  const cookieOptions = {
    secure: process.env.NODE_ENV === 'production',
  };

  // Define cookie expiry times
  const idTokenExpiry = new Date(Date.now() + 3600 * 1000); // 1 hour
  const accessTokenExpiry = new Date(Date.now() + 3600 * 1000); // 1 hour
  const userIdExpiry = new Date(Date.now() + 30 * 24 * 3600 * 1000); // 30 days

  const allCookies = {
    isNewUser: {
      value: isNewUser,
      options: {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: cookieOptions.secure,
      },
    },
    userId: {
      value: userId,
      options: {
        expires: userIdExpiry,
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: cookieOptions.secure,
      },
    },
    idToken: {
      value: idToken,
      options: {
        expires: idTokenExpiry,
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: cookieOptions.secure,
      },
    },
    accessToken: {
      value: accessToken,
      options: {
        expires: accessTokenExpiry,
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: cookieOptions.secure,
      },
    },
  };

  const setCookies = Headers => {
    if (Headers.length > 0) {
      Headers.forEach(header => {
        const { options, value } = allCookies[header];
        res.cookies.set(
          header,
          header === 'accessToken'
            ? accessToken
            : header === 'idToken'
              ? idToken
              : value,
          options
        );
      });
    }
  };
  console.log(req.nextUrl.pathname,req.nextUrl.pathname.startsWith('/api/auth/callback'))
  //APIS
  if(req.nextUrl.pathname.startsWith('/api/auth/callback')||req.nextUrl.pathname.startsWith('/app/auth/callback')){
    return res;
  }
  else if (
    req.nextUrl.pathname.startsWith('/api')
  ) {
    console.log('api');
    try {
      // Verify access token
      if (!accessToken || !(await verifyToken(accessToken))) {
        if (refreshToken) {
          const newTokens = await refreshCognitoToken(refreshToken);
          accessToken = newTokens.access_token;
          idToken = newTokens.id_token;
          const decoded = jwt.decode(idToken);
          userId = decoded?.sub as string; // Assuming 'sub' is your user identifier
          resetHeaders.push('idToken', 'accessToken', 'userId', 'isNewUser');
        } else {
          // If no refreshToken, redirect to login
          return NextResponse.redirect(new URL('/app/login', req.url));
        }
      }

      if (!userId && idToken) {
        const decoded = jwt.decode(idToken);
        userId = decoded?.sub as string; // Assuming 'sub' is your user identifier
        resetHeaders.push('userId', 'isNewUser');
      }

      if (!userId) {
        return NextResponse.redirect(new URL('/app/login', req.url));
      }
    } catch (error) {
      console.error(error);
      return Response.json(
        { success: false, message: 'Internal Server Error' },
        { status: 500 }
      );
    }
    setCookies(resetHeaders);
  }

  //APPS
  else if (req.nextUrl.pathname === '/app/login') {
    try {
      if (!accessToken || !(await verifyToken(accessToken))) {
        //If have refreshToken and success to get new tokens
        if (refreshToken) {
          try {
            return refreshCognitoToken(refreshToken).then(() =>
              NextResponse.redirect(new URL('/app', req.url))
            );
          } catch (error) {
            console.log('error', error);
          }
        } else {
          // If no refreshToken, redirect to login
        }
      } else {
        return NextResponse.redirect(new URL('/app', req.url));
      }
    } catch (error) {
      console.log('error', error);
    }
  } else if (req.nextUrl.pathname === '/app/guide') {
    try {
      console.log('guide');
      if (!accessToken || !(await verifyToken(accessToken))) {
        if (refreshToken) {
          const newTokens = await refreshCognitoToken(refreshToken);
          accessToken = newTokens.access_token;
          idToken = newTokens.id_token;
          const decoded = jwt.decode(idToken);
          userId = decoded?.sub as string; // Assuming 'sub' is your user identifier
          resetHeaders.push('idToken', 'accessToken', 'userId', 'isNewUser');
          setCookies(resetHeaders);
        } else {
          // If no refreshToken, redirect to login
          return NextResponse.redirect(new URL('/app/login', req.url));
        }
      }
    } catch (error) {
      console.log('error', error);
      return NextResponse.redirect(new URL('/app/login', req.url));
    }
  } else if (req.nextUrl.pathname.startsWith('/app')) {
    console.log('app');
    try {
      // Verify access token
      if (!accessToken || !(await verifyToken(accessToken))) {
        if (refreshToken) {
          const newTokens = await refreshCognitoToken(refreshToken);
          accessToken = newTokens.access_token;
          idToken = newTokens.id_token;
          const decoded = jwt.decode(idToken);
          userId = decoded?.sub as string; // Assuming 'sub' is your user identifier
          resetHeaders.push('idToken', 'accessToken', 'userId', 'isNewUser');
        } else {
          // If no refreshToken, redirect to login
          return NextResponse.redirect(new URL('/app/login', req.url));
        }
      }

      if (!userId && idToken) {
        const decoded = jwt.decode(idToken);
        userId = decoded?.sub as string; // Assuming 'sub' is your user identifier
        resetHeaders.push('userId', 'isNewUser');
        isNewUser = true;
      }

      if (userId) {
        if (!isNewUser || isNewUser === true) {
          return NextResponse.redirect(new URL('/app/guide', req.url));
        }
      } else {
        return NextResponse.redirect(new URL('/app/login', req.url));
      }

      // If all checks pass, call next to proceed
      setCookies(resetHeaders);
    } catch (error) {
      console.error(error);
      return Response.json(
        { success: false, message: 'Internal Server Error', error: error.message },
        { status: 500 }
      );
    }
  }

  return res;
};

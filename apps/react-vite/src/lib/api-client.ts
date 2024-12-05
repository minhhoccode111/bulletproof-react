// InternalAxiosRequestConfig: type for axios request config
import Axios, { InternalAxiosRequestConfig } from 'axios';

// TODO: manages notifications
import { useNotifications } from '@/components/ui/notifications';
// environment variables data object
import { env } from '@/config/env';
// static and dynamic paths
import { paths } from '@/config/paths';

// Simplifies HTTP requests with a pre-configured api instance
// Ensures headers and credentials are consistent across requests
// Centralizes error handling with notifications and redirects for unauthorized users

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  // add: Accept: application/json header to all requests
  if (config.headers) {
    config.headers.Accept = 'application/json';
  }

  // enables withCredentials to include cookies in cross-origin requests
  // (useful for session-based authentication)
  config.withCredentials = true;
  return config;
}

// sets the API's base URL from environment variables (env.API_URL)
export const api = Axios.create({
  baseURL: env.API_URL,
});

// applies authRequestInterceptor to all outgoing requests
// ensures headers and credentials are configured correctly
api.interceptors.request.use(authRequestInterceptor);
// configures how axios handle responses
api.interceptors.response.use(
  // response success handler
  (response) => {
    // extract and return only the response's data field
    return response.data;
  },
  // response error handler
  (error) => {
    // extracts the error message from the server response or the error object
    const message = error.response?.data?.message || error.message;
    // uses the notification system (useNotifications) to display the error
    useNotifications.getState().addNotification({
      type: 'error',
      title: 'Error',
      message,
    });

    // Unauthorized Error Handling (401)
    if (error.response?.status === 401) {
      const searchParams = new URLSearchParams();
      const redirectTo =
        searchParams.get('redirectTo') || window.location.pathname;
      // Redirects the user to the login page (paths.auth.login) with a
      // redirectTo parameter to retain their current location
      window.location.href = paths.auth.login.getHref(redirectTo);
    }

    return Promise.reject(error);
  },
);

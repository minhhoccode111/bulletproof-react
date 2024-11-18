import * as React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import { App } from './app';
import { enableMocking } from './testing/mocks';

const root = document.getElementById('root');
if (!root) throw new Error('No root element found');

enableMocking().then(() => {
  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});

/*
what happens when you run the app with `enableMocking`:

1. The `enableMocking` function checks if `env.ENABLE_API_MOCKING` is true. If it is, the function proceeds to initialize the mock environment

2. The mock database is initialized by calling the `initializeDb` function from `src/testing/mocks/db.ts`. This function loads the mock database from a file (`mocked-db.json`) or from local storage, and populates the database with data


3. The mock worker is started by calling the `worker.start()` function from `public/mockServiceWorker.js`. This function sets up a service worker that intercepts and handles requests made by the app


The service worker (`public/mockServiceWorker.js`) listens for the following events:

* `install`: The service worker is installed, and it skips waiting for the old service worker to shut down
* `activate`: The service worker is activated, and it claims control over the clients (i.e., the app)
* `fetch`: The service worker intercepts a request made by the app and handles it accordingly. If the request is not a navigation request and there are active clients, the service worker resolves the request by calling the `handleRequest` function
* `message`: The service worker receives a message from the app and handles it accordingly

The `handleRequest` function in the service worker determines how to handle the request. If the client is not active, it bypasses mocking and makes a passthrough request. Otherwise, it notifies the client that a request has been intercepted and sends a response back to the client

In summary, when you run the app with `enableMocking`, it sets up a mock environment that includes a mock database and a service worker that intercepts and handles requests made by the app. This allows you to test your app in a controlled environment with mock data
*/

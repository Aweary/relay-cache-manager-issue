# Relay - CacheManager API test

This is meant to reproduce https://github.com/facebook/relay/issues/1296

## How to reproduce

Run `npm install` and then `npm start`. Open the browser and navigate to `localhost:3000`. The page should load correctly, since there is no cache
yet.

Wait at least two seconds, and then refresh the page. It should not render correctly. The browser console should have some logs documenting what calls were made to the `cacheManager` instance.

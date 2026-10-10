import 'react-native-url-polyfill/auto';
import 'text-encoding';
import { ReadableStream } from 'web-streams-polyfill';
import 'react-native-fetch-api';

if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = ReadableStream;
}

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
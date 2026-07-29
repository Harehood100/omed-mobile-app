import { registerRootComponent } from 'expo';

// Must be imported before anything else — TaskManager.defineTask needs to run at module
// scope so the task is available even if the OS relaunches the app headlessly in the
// background. See lib/reminderBackgroundTask.js.
import './lib/reminderBackgroundTask';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

### 5.0.1
- Added debug message on Initialization
- Improved code

### 5.0.0
- Added integration with Redux DevTools - [documentation](https://vytautaspranskunas.gitbook.io/react-state-rxjs/debugging/redux-devtools)
- Improved async support in actions - [documentation](https://vytautaspranskunas.gitbook.io/react-state-rxjs/core-concepts/actions/async)
- Improved debugging experience

##### BREAKING CHANGES
- Removed clear operator. Instead use immutable operator ```store.update(state => state.clear())```. Previouse functionality of clear operator was moved to ```reset``` to avoid confusion
- Time travel was removed because of integration with Redux DevTools. You do not need to include <StateHistoryComponent /> to your main.tsx file.

### 4.2.0
- Added more `currentValue` and `value` params to `shouldUpdateState` hook in external storage plugin.

### 4.1.2
- Destroyd callbacks for possible mempry leacks.

### 4.1.1
- all external storage operation now returns optional observable with possibility to subscribe and get notified about action completion.

### 4.0.0
- Added new Map operator
- Added new Clear operator
- Added new Reset operator
- Added store.bind.form plugin for binding state to forms
- Added ability to store state to external storagies like localStorage or async storagies like IndexDB

### 3.3.3
- Fixed bug with inheritance

### 3.3.2
- Added createStore method to NgStateTestBed

### 3.1.1
- Simplified TestBed. Now `initial state` and `statePath` are optional and has defult values of `{}` and `[]`. More info in Readme.

### 3.1.0
- Improve constructor ovveriding by ovveriding prototype instead of instance constructor.

### 3.0.0
- Added ```ReactStateTestBed``` for simplified actions and components unit testing.

### 2.2.0
- made compatible with ssr (server side rendering).
- added ```process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod'``` for minified bundle include in production.
- example application is updated with server side rendering.

### 2.1.0
- fixed bug when using ```"module": "es2015"``` in typescript

### 2.0.0
- upgraded to React 16.0.0
- debuging was simplyfied. Added startDebugging and stopDebugging methods to window.state. startDebugging takes optional array parameter statePath to watch over some state part. Also additional param debug = true / false was added to InjectStore decorator. When set to true console will show state part of the component that uses those actions.
- Store.store.clear() added
- isProd flag added to ReactState.init method (read ng-state documentation for more details)

### 1.5.0
- added <strong>readonly</strong> ```stateIndex``` to HasStateActions. This is usefull when you want to edit list item on different route for instance and want to pass list index not via params but via route.

- improved state refresh

### 1.4.0
- Fixed bug in lists change detection.

### 1.3.0
- Introduced classes HasStateActions<T> and HasStore<T> to reduce boilerplate in components and actions. There is no more need to introduce actions, state and store in each component or store in actions.

```ts
export class TodoDescription extends React.Component<any, any> implements HasStateActions<TodoStateActions> {
    // this.actions is available
}

OR even shorter

export class TodoDescription extends ReactComponentWithStateActions<any, any, TodoStateActions> {
    // this.actions is available
}


export class TodosStateActions extends HasStore<Immutable.List<any>> {
    // this.store is available
    // this.state is available
}
```
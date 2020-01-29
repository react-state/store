### 7.1.0
- added `listenTo` method to `Dispatcher`. It returns Observable and can be used with `takeUntil` and other RxJs functions

### 7.0.0
- introduced `useComponentState` hook to follow React hooks concept

### 6.8.2
- made fully compatible for enzyme testing including nested components
- added optional type to `select` operator for type of subselect state
- upgraded peer dependency of immer to 5.0.0

### 6.8.1
- simplified actions assigment for component. Now actons are assigned automatically by actions type to each component. No need to call `setActionsToComponent` unless you want to assigne custom actions instance to specific component.

### 6.6.0
- removed dependency to 'componentWillUpdate' hook because it will deprecated
- Added support for UI testing approach with UI interactors like Enzyme

### 6.5.0
- made router history accessible for external use via `RouterHistory.history`. With this redirects become possible from any place: `RouterHistory.history.push('/login')`. Where browser uses `createBrowserHistory` and unit tests are uses `createMemoryHistory`;
- added assigment `Store.store = store;` to ReactStateTestBed so you d not need o assign it manually when creating store for unit tests

### 6.4.0
- fixed `clear` operator
- added `@Async()` decorator. Now to make action async it should not end with `Async` any more instead mark it with `@Async()` decorator. Action still need to return `Observable`

### 6.3.0
- immutable data stratgey retruned to optional `withMutations` strategy in order fix the bug when working with lists. Only limited amount of operators can be applied when used withMutations. Read more about it on: (immutable documentation)(https://immutable-js.github.io/immutable-js). To use `withMutations` you need to add last argument in `store.update` function like: `this.store.update(...action, {}, { withMutations: true } as ImmutableUpdateActionAdditionalSettings)`. In order to get this fix applied please upgrade `@react-state/store` and `@react-state/immutablejs-data-strategy`

### 6.2.0
- made library compatible with any compile targets like es2015...esnext

### 6.1.0
- Added optimistic updates API. Can be accessed via: ```store.optimisticUpdates.```

### 6.0.0
- Intorduced immer support

##### BREAKING CHANGES
- In order to use react-state now you have to import `@react-state/store` instead of `react-state` and immer of immutable strategy: `ImmerDataStrategy` or `ImmutableJsDataStrategy` needs to be registered on by calling ```.addDataStrategy(ImmutableJsDataStrategy)```
- Also for test bed you need to place `ReactStateTestBed.setTestEnvironment(new ImmerDataStrategy());` to beforeEach and provide immer or immutable data strategy.


### 5.2.0
- Improved code
- Improved information of history items
- Redux DevTools `maxAge` now is set from `storeHistoryItems` property

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
- Added createStore method to ReactStateTestBed

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
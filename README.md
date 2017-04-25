# react-state
RxJS and ImmutableJs powered state management React apps. Inspired by NgRx.

[![npm version](https://badge.fury.io/js/react-state-rxjs.svg)](https://badge.fury.io/js/react-state-rxjs)

ng-state is a controlled nested state container designed to help write performant, consistent applications
on top of React. Core tenets:
- State is a single immutable data structure
- Each component gets its own peace of nested state
- State accessed with 'actions' variable under component or the `Store`, an observable of state and an observer of global state

react-state is build on same core as ng-state (https://github.com/ng-state). So most library behaviour can be found there.

## Main differences made for React:

### Configuration
In your app's main module, register store with initial state by using `ReactState.init`

```ts
ReactState.init((state: any, routerHistory: History) => {
    ReactDOM.render(<Main history={routerHistory} />, document.getElementById("example"))
}, initialState)
```

#### params
- state - current state that will be passed in each time state mutates
- routeHistory - it is react-router-dom 'createHistory' object initialized under the hood to collect routing history for 'time travel' functionality. This param passed to Main component and then to the Router
```ts
<!--index.tsx-->
 ReactDOM.render(<Main history={routerHistory} />, document.getElementById("example"))

<!--main.tsx-->
 <Router history={this.props.history}>
```

- initialState - this is your initial state
```ts
import * as Immutable from "immutable";

let initialState = Immutable.fromJS({
    todos: []
});

export { initialState };
```

### Difference in StateAction's
- Geeters are not converted to properties because React change detecions has no performance penalties with it
- All actions that returns Observable or Promise has to end with 'Async'
```ts
get todoDescriptionAsync() {
    return this.store.map((state) => {
        return state.get('description');
    });
}
```
- Apart from ```stroe``` injected to actions there is an optional parameter ```state``` that can be used in non Async actions
```ts
get todoDescription() {
    return this.state.get('description');
}
```
- ```statePath``` and ```stateIndex``` are passed down to components by using params. (you do not need to do anything with those it is just for react-state-rxjs library to track components path)
```ts
<TodoDescription statePath={this.statePath} stateIndex={index} />
```
- To get 'Time Travel' functionality you have to include StateHistoryComponent to your main application passing routerHistory param to it
```ts
<StateHistoryComponent routerHistory={this.props.history} />
```
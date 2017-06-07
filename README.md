# react-state
RxJS and ImmutableJs powered state management React apps. Inspired by NgRx and Redux.

[![npm version](https://badge.fury.io/js/react-state-rxjs.svg)](https://badge.fury.io/js/react-state-rxjs)

ng-state is a controlled nested state container designed to help write performant, consistent applications
on top of React. Core tenets:
- State is a single immutable data structure
- Each component gets its own peace of nested state
- State accessed with 'actions' variable under component or the `Store`, an observable of state and an observer of global state

react-state is build on same core as [ng-state](https://github.com/ng-state). So most library behaviour can be found there.

### Main differences from other RxJs store based state managements solutions
- Allows state nesting and injects responsible peaces to components
- Uses immutablejs fast equality object comparison for high performance
- Actions can return observables, promises or simple objects
- Decouples / Hides paths to state from components
- Uses Redux like pure functions - actions to interact with state
- Uses Redux like messages for communication between not related components
- Does not use React component state
- No boilerplate
- No long paths to access nested state / store


### Performance first
Each component implements ```shouldComponentUpdate``` method which default return value changed to ```false```.
Component updates only when:
- state is changed
- changed default value of ```shouldComponentUpdate``` to ```true``` by passing ```true``` to ComponentState decorator
- component has explicit ```shouldComponentUpdate``` implementation that causes update

### Installation
Install react-state-rxjs from npm:
```bash
npm install react-state-rxjs --save
```

### Examples
- [Official react-state/example-app](https://github.com/react-state/example-app) is an officially maintained example application showcasing possibilities of ```react-state```

## Main differences made for React:

### Configuration
In your app's main module, register store with initial state by using `ReactState.init`

```ts
ReactState.init((routerHistory: History) => {
    ReactDOM.render(<Main history={routerHistory} />, document.getElementById("example"))
}, initialState)
```

#### params
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

let initialState = {
    todos: <any[]>[]
};

export { initialState };
```

### Difference in Components
- starting from version 1.5.0 there is readonly ```stateIndex``` property introduced. This usefull in those cases when you want to edit list item on different route for instance and have to pass stateIndex via route not via params. In this case library has priority on property over over params.

```ts
export class TodoDescription extends React.Component<any, any> implements HasStateActions<TodoStateActions> {
    actions: TodoStateActions;
    statePath: any;
    get stateIndex() {
        return '0' // param comming from router or any other source
    };
}
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
- Apart from ```store``` injected to actions there is an optional parameter ```state``` that can be used in non Async actions
```ts
get todoDescription() {
    return this.state.get('description');
}
```
- ```statePath``` and ```stateIndex``` are passed down to components by using params. (you do not need to do anything with those it is just for react-state-rxjs library to track components path)
```ts
<TodoDescription statePath={this.statePath} stateIndex={index} />
```

### Difference in Time Travel

- To get 'Time Travel' functionality you have to include StateHistoryComponent to your main application passing routerHistory param to it
```ts
<StateHistoryComponent routerHistory={this.props.history} />
```

### Basic flow with code side-by-side explained:

![flow](/react-state-flow.png)

## Contributing
Please read [contributing guidelines here](https://github.com/react-state/store/blob/master/CONTRIBUTING.md).
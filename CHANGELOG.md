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
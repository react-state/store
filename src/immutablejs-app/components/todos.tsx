import * as React from 'react';

import { ClearTodoMessage, TodoModel } from './actions/todo.model';
import { Dispatcher, Message } from '../../../projects/react-state/src/services/dispatcher';

import { ComponentState } from '../../../projects/react-state/src/decorators/component-state.decorator';
import { Subscription } from 'rxjs';
import { TodoDescription } from './description';
import { TodosStateActions } from './actions/todos.actions';
import { Store } from '../../../projects/react-state/src/store/store';

@ComponentState(TodosStateActions)
export class Todos extends React.Component {
    description: HTMLInputElement;
    name: HTMLInputElement;

    actions: TodosStateActions;
    statePath: any;

    subscription: Subscription;

    constructor(props) {
        super(props);

        this.subscription = Dispatcher
            .subscribe(ClearTodoMessage as Message, (payload: any) => {
                this.actions.clearTodos();
            });

        this.subscription = Dispatcher
            .subscribe('UpdateTodoItemMessage', (payload: any) => {
                this.actions.updateFirstItem();
            });
    }

    componentWillUnmount() {
        this.subscription.unsubscribe();
    }

    render() {
        if (!this.actions.todosAsync) {
            return;
        }

        const todoItems = this.actions.todosAsync.map((item: any, index: any) => {
            return (<tr key={index}>
                <th scope='row'>{index + 1}</th>
                <td>{item.get('name')}</td>
                <td><TodoDescription key={index} statePath={this.statePath} stateIndex={index} /></td>
                <td><button className='btn btn-danger' onClick={() => this.deleteItem(index)}>X</button></td>
            </tr>);
        });

        return (

            <div className='container'>
                <form className='form-inline'>
                    <label className='sr-only' htmlFor='inlineFormInput'>Name</label>
                    <input type='text' name='name' ref={input => this.name = input} className='form-control mb-2 mr-sm-2 mb-sm-0' id='inlineFormInput' placeholder='Name' />

                    <label className='sr-only' htmlFor='inlineFormInputGroup'>Username</label>
                    <input type='text' name='description' ref={input => this.description = input} className='form-control mb-2 mr-sm-2 mb-sm-0' id='inlineFormInput' placeholder='Description' />

                    <button type='button' className='btn btn-primary' onClick={this.addItem.bind(this)}>Submit</button>
                    <button type='button' className='btn btn-primary' style={{ marginLeft: '10px' }} onClick={this.reset.bind(this)}>Reset</button>
                </form>
                <br />
                <table className='table'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {todoItems}
                    </tbody>
                </table>
                TODOS - {this.interpolationTest()}
            </div>
        );
    }

    reset() {
        Store.store.reset();
        // this.actions.reset();
    }

    deleteItem(index: number) {
        this.actions.deleteTodo(index);
    }

    addItem(e: Event) {
        this.actions.addTodo({ name: this.name.value, description: this.description.value } as TodoModel);
        this.name.value = '';
        this.description.value = '';
    }

    interpolationTest() {
        return Math.random();
    }
}
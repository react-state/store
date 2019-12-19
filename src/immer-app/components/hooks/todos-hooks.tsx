import * as React from 'react';

import { ClearTodoMessage, TodoModel } from '../actions/todo.model';
import { Dispatcher, Message } from '../../../../projects/react-state/src/services/dispatcher';

import { Subscription } from 'rxjs';
import TodoDescriptionHooks from './description-hooks';
import { useEffect } from 'react';
import { TodosStateActions } from '../actions/todos.actions';
import useComponentState = require('../../../../projects/react-state/src/decorators/component-state.hook');

const TodosWithHooks = ({ testProp }: any) => {
    let description: HTMLInputElement;
    let name: HTMLInputElement;
    let subscription: Subscription;
    const { actions, statePath } = useComponentState(TodosStateActions);

    useEffect(() => {

        subscription = Dispatcher
            .subscribe(ClearTodoMessage as Message, (payload: any) => {
                actions.clearTodos();
            });

        subscription = Dispatcher
            .subscribe('UpdateTodoItemMessage', (payload: any) => {
                actions.updateFirstItem();
            });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const reset = () => {
        actions.reset();
    };

    const deleteItem = (index: number) => {
        actions.deleteTodo(index);
    };

    const addItem = (e: Event) => {
        actions.addTodo({ name: name.value, description: description.value } as TodoModel);
        name.value = '';
        description.value = '';
    };

    const interpolationTest = () => {
        return Math.random();
    };

    if (!actions) {
        return null;
    }

    const todoItems = actions.todos.map((item: any, index: any) => {
        return (<tr key={index}>
            <th scope='row'>{index + 1}</th>
            <td>{item.name}</td>
            <td><TodoDescriptionHooks key={index} statePath={statePath} stateIndex={index} /></td>
            <td><button className='btn btn-danger' onClick={() => deleteItem(index)}>X</button></td>
        </tr>);
    });

    return (
        <div className='container'>
            <form className='form-inline'>
                <label className='sr-only' htmlFor='inlineFormInput'>Name</label>
                <input type='text' name='name' ref={input => name = input} className='form-control mb-2 mr-sm-2 mb-sm-0' id='inlineFormInput' placeholder='Name' />

                <label className='sr-only' htmlFor='inlineFormInputGroup'>Username</label>
                <input type='text' name='description' ref={input => description = input} className='form-control mb-2 mr-sm-2 mb-sm-0' id='inlineFormInput' placeholder='Description' />

                <button type='button' className='btn btn-primary' onClick={addItem.bind(this)}>Submit</button>
                <button type='button' className='btn btn-primary' style={{ marginLeft: '10px' }} onClick={reset.bind(this)}>Reset</button>
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
            TODOS - {interpolationTest()}
        </div>
    );
};

export default TodosWithHooks;
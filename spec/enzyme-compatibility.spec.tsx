import * as React from 'react';
import { ReactStateTestBed, InjectStore, HasStore, ComponentState, ReactComponentWithStateActions } from '@react-state/store';
import * as Adapter from 'enzyme-adapter-react-16';
import { configure, shallow, ShallowWrapper } from 'enzyme';
import { ImmerDataStrategy } from '@react-state/immer-data-strategy';

configure({ adapter: new Adapter() });

@InjectStore(['${stateIndex}'])
export class TodoDescriptionStateActions extends HasStore<any> {
    get todoDescription() {
        return this.state.description;
    }
}

@InjectStore('todos')
export class TodosStateActions extends HasStore<any> {
    get todoDescription() {
        return this.state[0].description;
    }

    changeTodoDescription() {
        this.store.update(state => {
            state[1].description = 'changed description';
        });
    }
}

@ComponentState(TodoDescriptionStateActions)
export class TodoDescription extends ReactComponentWithStateActions<any, any, TodoDescriptionStateActions> {
    render() {
        return <div className='description'>{this.actions.todoDescription}</div>;
    }
}

@ComponentState(TodosStateActions)
export class Todos extends ReactComponentWithStateActions<any, any, TodosStateActions> {

    changeTodoDescription() {
        this.actions.changeTodoDescription();
    }

    render() {
        return (
            <div className='todos'>
                <div className='parent-description'>{this.actions.todoDescription}</div>
                <TodoDescription statePath={this.statePath} stateIndex={1}></TodoDescription>
                <button className='button' onClick={() => this.changeTodoDescription()}></button>
            </div>
        );
    }
}


describe('Enzyme compatibility', () => {

    let wrapper: ShallowWrapper<any>;

    beforeEach(() => {
        const initialState = {
            todos: [
                { id: 1, name: 'test', description: 'test' },
                { id: 2, name: 'test', description: 'test description' },
            ],
        };

        ReactStateTestBed.setTestEnvironment(new ImmerDataStrategy());
        ReactStateTestBed.strictActionsCheck = false;
        ReactStateTestBed.createActions(TodosStateActions, initialState, ['todos']);

        wrapper = shallow(<Todos />);
    });

    it('should read description from parent', () => {
        expect(wrapper.find('div.parent-description').text()).toEqual('test');
    });

    it('should read description from child', () => {
        expect(wrapper.render().find('.description').text()).toEqual('test description');
    });

    it('should change child description on button click', () => {
        expect(wrapper.render().find('.description').text()).toEqual('test description');

        const button = wrapper.find('.button');
        button.simulate('click');

        expect(wrapper.render().find('.description').text()).toEqual('changed description');
    });
});
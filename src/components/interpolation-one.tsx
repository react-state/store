import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ComponentState } from '../../projects/react-state/src/decorators/component-state.decorator';
import { InterpolationOneStateActions } from './actions/interpolation-one.actions';

@ComponentState(InterpolationOneStateActions)
export class InterpolationTwo extends React.Component<any, any> {
    actions: InterpolationOneStateActions;
    statePath: any;

    render() {
        return (
            <div>{this.test()} - { this.actions.interpolationValue }
                <button onClick={() => this.changeState()}>click</button>
                <br/>
                <br/>
                <br/>
                <br/>
                <button onClick={() => this.unloadComponent()}>UNMOUNT</button>
            </div>
            );
    }

    test() {
        return Math.random();
    }

    changeState() {
        this.actions.update(Math.random());
    }

    unloadComponent(){
        ReactDOM.unmountComponentAtNode(document.getElementById('example'));
    }
}
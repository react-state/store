import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { InterpolationOneStateActions } from '../actions/interpolation-one.actions';
import useComponentState = require('../../../../projects/react-state/src/decorators/component-state.hook');


const InterpolationTwo = ({ statePath }) => {
    const { actions } = useComponentState(InterpolationOneStateActions, statePath);

    const test = () => {
        return Math.random();
    };

    const changeState = () => {
        this.actions.update(Math.random());
    };

    const unloadComponent = () => {
        ReactDOM.unmountComponentAtNode(document.getElementById('example'));
    };

    return (
        <div>{test()} - {this.actions.interpolationValue}
            <button onClick={() => changeState()}>click</button>
            <br />
            <br />
            <br />
            <br />
            <button onClick={() => unloadComponent()}>UNMOUNT</button>
        </div>
    );
};

export default InterpolationTwo;

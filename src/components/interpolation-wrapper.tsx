import * as React from 'react';

import { ComponentState } from '../../projects/react-state/src/decorators/component-state.decorator';
import { InterpolationOne } from './interpolation-two';
import { InterpolationTestStateActions } from './actions/interpolation-wrapper.actions';
import { InterpolationTwo } from './interpolation-one';
import { TodoStateActions } from './actions/todo.actions';
import { Todos } from './todos';

@ComponentState(InterpolationTestStateActions)
export class InterpolationWrapper extends React.Component<any, any> {
    statePath: any;
    render(){
        return (
            <div>
                <InterpolationOne statePath={this.statePath} />
                <InterpolationTwo statePath={this.statePath} />
            </div>
        );
    }
}
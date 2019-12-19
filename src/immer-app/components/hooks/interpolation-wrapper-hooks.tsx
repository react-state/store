import * as React from 'react';

import { ComponentState } from '../../../../projects/react-state/src/decorators/component-state.decorator';
import InterpolationTwo from './interpolation-two-hooks';
import { InterpolationTestStateActions } from '../actions/interpolation-wrapper.actions';
import InterpolationOne from './interpolation-one-hooks';

@ComponentState(InterpolationTestStateActions)
export class InterpolationWrapper extends React.Component<any, any> {
    statePath: any;
    render() {
        return (
            <div>
                <InterpolationOne statePath={this.statePath} />
                <InterpolationTwo statePath={this.statePath} />
            </div>
        );
    }
}
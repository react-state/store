import * as React from 'react';

import { InterpolationWrapper } from './interpolation-wrapper';
import { Todos } from './todos';

export class Wrapper extends React.Component<any, any> {
    render() {
        return (
            <div>
                <Todos />
                <InterpolationWrapper />
            </div>
        );
    }
}
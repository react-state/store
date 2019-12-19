import * as React from 'react';
import TodosHooks from './todos-hooks';
import { InterpolationWrapper } from '../interpolation-wrapper';

const WrapperHooks = () => (
    <div>
        <TodosHooks />
        <InterpolationWrapper />
    </div>
);

export default WrapperHooks;
import 'reflect-metadata';
import { ASYNC_FUNCTIONS_METADATA } from '../constants';

export function Async() {
    return (target: any, key: any, index: any) => {
        target = Reflect.getPrototypeOf(target);
        const args = Reflect.getMetadata(ASYNC_FUNCTIONS_METADATA, target.constructor, key) || {};
        (args as IsAsync).isAsync = true;

        Reflect.defineMetadata(
            ASYNC_FUNCTIONS_METADATA,
            args,
            target.constructor,
            key,
        );
    };
}

export interface IsAsync {
    isAsync: boolean;
}
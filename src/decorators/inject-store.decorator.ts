import { StateHistory } from './../state/history';
import { Store } from "../store/store";
import { resolveAsync } from "../helpers/async-filter"

export function InjectStore(newPath: string[] | string | ((currentPath: any, stateIndex: any) => string[] | string), intialState?: Object | any) {
    let getStatePath = (currentPath: any, stateIndex: any, extractedPath: any) => {

        let transformedPath = (<string[]>extractedPath).map(item => {
            return item === '${stateIndex}'
                ? stateIndex
                : item;
        });

        return [...currentPath, ...transformedPath];
    };

    let getAbsoluteStatePath = (stateIndex: (string | number) | (string | number)[], extractedPath: any) => {
        const transformedPath = (<string>extractedPath).split('/');
        if (typeof stateIndex === 'string' || typeof stateIndex === 'number') {
            stateIndex = [stateIndex];
        }

        let nthStatePathIndex = 0;
        transformedPath.forEach((value, index) => {
            if (value === '${stateIndex}') {
                if ((<any[]>stateIndex).length <= nthStatePathIndex) {
                    throw new Error(`State path ${newPath} has not enough stateIndexes set. Please provide stateIndexes as array in the same order as set in statePath.`);
                }

                transformedPath[index] = (<any>stateIndex)[nthStatePathIndex];
                nthStatePathIndex++;
            }
        });

        return transformedPath;
    };

    let getAllAsyncMethods = function (target: any): { name: string, isGetter: boolean }[] {
        let methods = <any[]>[];
        while (target = Reflect.getPrototypeOf(target)) {
            let asyncMethods = (<any>Object).entries((<any>Object).getOwnPropertyDescriptors(target))
                .filter(([key, descriptor]: [string, any]) => {
                    return key.endsWith('Async')
                })
                .map(([key, descriptor]: [string, any]) => {
                    return { name: key, isGetter: typeof descriptor.get === 'function' }
                })
             methods = [...methods, ...asyncMethods];
        }

       return methods;
    }

    let getObservableId = function (instance: any, target: any, funcName: any) {
        const nameFor = instance.statePath.join('_');
        const functionName = target.toString().match(/^function\s*([^\s(]+)/)[1];
        return `${nameFor}_${functionName}_${funcName}`;
    }

    let createNewFunction = function (currentFunction: Function, instance: any, funcName: any, target: any) {
        return function () {
            var originalResult = currentFunction
                .bind(instance)
                .apply(currentFunction, arguments);

            return resolveAsync(originalResult, getObservableId(instance, target, funcName));
        }
    }

    let wrapToAsync = function (instance: any, target: any) {
        const asyncMethods = getAllAsyncMethods(instance);

        asyncMethods.forEach(value => {
            const temp = instance[value.name];
            delete instance[value.name];
            if (value.isGetter) {
                Object.defineProperty(instance, value.name, {
                    get: function () {
                        return resolveAsync(temp, getObservableId(instance, target, value.name));
                    }
                });
            } else {
                instance[value.name] = createNewFunction(temp, instance, value.name, target);
            }
        });
    }

    return (target: any) => {

        target.prototype.createStore = function (instance: any, currentPath?: any[], stateIndex?: (string | number) | (string | number)[]) {

            let extractedPath = typeof newPath === 'function' && (<any>newPath).name === ''
                ? (<any>newPath)(currentPath, stateIndex)
                : newPath;

            const statePath = typeof extractedPath === 'string'
                ? getAbsoluteStatePath(stateIndex, extractedPath)
                : getStatePath(currentPath, stateIndex, extractedPath);

            instance.statePath = statePath;
            const store = Store.store;

            if (intialState) {
                store.initialize(instance.statePat, intialState);
            }

            if (!StateHistory.CURRENT_STATE.getIn(statePath)) {
                console.error(`No such state in path ${statePath}. Define initial state for this path in global initial state or comonent actions.`);
            }

            instance.store = store.select(statePath);

            Object.defineProperty(instance, 'state', {
                get: function () {
                    return StateHistory.CURRENT_STATE.getIn(statePath);
                }
            });

            wrapToAsync(instance, target);

            return statePath;
        };

        target.prototype.getAllObservableIds = function (instance: any) {
            const asyncMethods = getAllAsyncMethods(instance);
            return asyncMethods.map(value => getObservableId(instance, target, value.name));
        }
    };
}

export abstract class HasStore<T> {
    store: Store<T> = null;
    state?: any = null;
}
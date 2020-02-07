import 'reflect-metadata';

import { StateHistory } from '../state/history';
import { Store } from '../store/store';
import { AsyncValueResolver } from '../helpers/async-value-resolver';
import { Helpers } from '../helpers/helpers';
import { DataStrategyProvider } from '../data-strategy/data-strategy-provider';
import { ReactStateConfig } from '../react-state.config';
import { ASYNC_FUNCTIONS_METADATA } from '../constants';
import { IsAsync } from './async.decorator';

export function InjectStore(newPath: string[] | string | ((currentPath: any, stateIndex: any) => string[] | string), intialState?: Object | any, debug: boolean = false) {
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

        target = Reflect.getPrototypeOf(target);
        let asyncMethods = (<any>Object).entries((<any>Object).getOwnPropertyDescriptors(target))
            .filter(([key, descriptor]: [string, any]) => {
                const metaData = Reflect.getMetadata(ASYNC_FUNCTIONS_METADATA, target.constructor, key);
                return metaData && (metaData as IsAsync).isAsync;
            })
            .map(([key, descriptor]: [string, any]) => {
                return { name: key, isGetter: typeof descriptor.get === 'function' };
            });

        return asyncMethods;
    };

    let getObservableId = function (funcName: any, actionId: string) {
        return `${actionId}_${funcName}`;
    };

    let createNewFunction = function (currentFunction: Function, instance: any, funcName: any) {
        return function () {
            const originalResult = currentFunction
                .bind(instance)
                .apply(currentFunction, arguments);

            return AsyncValueResolver.instance.resolve(originalResult, getObservableId(funcName, instance.aId));
        };
    };

    let wrapToAsync = function (instance: any) {
        const asyncMethods = getAllAsyncMethods(instance);

        asyncMethods.forEach(value => {
            const temp = instance[value.name];
            delete instance[value.name];
            if (value.isGetter) {
                Object.defineProperty(instance, value.name, {
                    get: function () {
                        return AsyncValueResolver.instance.resolve(temp, getObservableId(value.name, instance.aId));
                    }
                });
            } else {
                instance[value.name] = createNewFunction(temp, instance, value.name);
            }
        });
    };

    const checkPath = (): boolean => {
        if (ReactStateConfig.isProd) {
            return false;
        }

        if (ReactStateConfig.isTest && debug) {
            return true;
        }

        if (ReactStateConfig.isTest) {
            return false;
        }

        return true;
    };

    return (target: any) => {
        target.prototype.createStore = function (currentPath: any[], stateIndex: (string | number) | (string | number)[]) {

            this.aId = Helpers.guid();

            let extractedPath = typeof newPath === 'function' && (<any>newPath).name === ''
                ? (<any>newPath)(currentPath, stateIndex)
                : newPath;

            const statePath = typeof extractedPath === 'string'
                ? getAbsoluteStatePath(stateIndex, extractedPath)
                : getStatePath(currentPath, stateIndex, extractedPath);

            this.statePath = statePath;
            const store = Store.store;

            this.store = intialState
                ? store.initialize(statePath, intialState)
                : store.select(statePath);

            if (checkPath() && !DataStrategyProvider.instance.getIn(StateHistory.instance.currentState, statePath)) {
                console.error(`No such state in path ${statePath}. Define initial state for this path in global initial state or comonent actions.`);
            }

            this.stateChangeSubscription = this.store
                .subscribe((state: any) => {
                    this.state = state;

                    if (debug) {
                        console.info(DataStrategyProvider.instance.toJS(state));
                    }
                });

            wrapToAsync(this);

            return statePath;
        };

        target.prototype.createTestStore = function (statePath: any[]) {
            this.store = Store.store.select(statePath);
            const that = this;
            this.stateChangeSubscription = this.store.subscribe((state: any) => {
                that.state = state;
            });
        };

        target.prototype.onDestroy = function () {
            AsyncValueResolver.instance.unsubscribe(this.aId);
            this.stateChangeSubscription.unsubscribe();
        };
    };
}

export abstract class HasStore<T> {
    store: Store<T> = null;
    state: T = null;
}

export interface ActionInjector<T> extends HasStore<T> {
    onDestroy: () => void;
    createTestStore: (statePath: any[]) => void;
    createStore: (currentPath: string | any[], stateIndex: (string | number) | (string | number)[]) => string | string[];
}
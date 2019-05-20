import * as React from 'react';
import { PersistStateManager } from '../../projects/react-state/src/store/plugins/persist-state.plugin';
import { timer } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { ComponentState } from '../../projects/react-state/src/decorators/component-state.decorator';
import { StorageStateActions } from './actions/stroage.actions';
import { Store } from '../../projects/react-state/src/store/store';

@ComponentState(StorageStateActions)
export class StorageComponent extends React.Component {

    actions: StorageStateActions;
    statePath: any;

    constructor(props) {
        super(props);
        PersistStateManager.configureStorage({
            clear: () => timer(2000).pipe(tap(_ => localStorage.clear())),
            getItem: (key: string) => timer(2000).pipe(map(_ => localStorage.getItem(key))),
            removeItem: (key: string) => timer(2000).pipe(tap(_ => localStorage.removeItem(key))),
            setItem: (key: string, value: any) => timer(2000).pipe(tap(_ => localStorage.setItem(key, value))),
        }, () => timer(2000).pipe(map(_ => Object.keys(localStorage))));
    }

    add() {
        this.actions.add()
            .subscribe(state => {
                console.log('2000ms delay save: ', state);
            });

        this.saveOtherStateToSessionStorage();
    }

    private saveOtherStateToSessionStorage() {
        Store.store.select(['todos'])
            // .storage.save({ storageConfig: { storage: sessionStorage, getKeys: () => Object.keys(sessionStorage) } })
            .storage.save({ storageConfig: { storage: localStorage, getKeys: () => Object.keys(localStorage) } })
            .subscribe(state => {
                console.log('Imediate save: ', state);
            });
    }

    remove() {
        this.actions.remove().subscribe(key => {
            console.log('2000ms delay remove: ', key);
        });
    }

    clear() {
        this.actions.clear().subscribe(state => {
            console.log('2000ms delay cleared: ', state);
        });
    }

    load() {
        this.actions.load().subscribe(state => {
            console.log('2000ms delay load: ', state);
        });
    }

    change() {
        this.actions.change();
    }

    render() {
        return (
            <div>
                ItemToStore value: {this.actions.deeperItem}<br /><br />
                <button className='btn btn-primary' style={{ marginLeft: '5px' }} onClick={this.add.bind(this)}>add</button>
                <button className='btn btn-primary' style={{ marginLeft: '5px' }} onClick={this.remove.bind(this)}>remove</button>
                <button className='btn btn-primary' style={{ marginLeft: '5px' }} onClick={this.clear.bind(this)}>clear</button>
                <button className='btn btn-primary' style={{ marginLeft: '5px' }} onClick={this.load.bind(this)}>load</button>
                <button className='btn btn-primary' style={{ marginLeft: '5px' }} onClick={this.change.bind(this)}>change</button>
            </div>
        );
    }
}
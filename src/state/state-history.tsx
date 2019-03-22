import * as React from "react";
import { Subscription } from 'rxjs';

import { StateHistory } from './history';
import { Store } from '../store/store';

export class StateHistoryComponent extends React.Component<any, any> {
    state = {
        lastIndex: 0,
        showHistory: false,
        items: [] as any[]
    }

    viewistorySubscription: Subscription;

    componentWillMount() {
        this.viewistorySubscription = StateHistory.viewHistory
            .subscribe((value: any) => {
                this.setState((prevState: any) => {
                    prevState.showHistory = value;
                    if (value) {
                        prevState.items = [...StateHistory.HISTORY];
                    }

                    return prevState;
                });
            });
    }

    componentWillUnmount() {
        this.viewistorySubscription.unsubscribe();
    }

    render() {
        const historyHolder = {
            position: 'absolute',
            bottom: 0,
            height: '100px',
            left: 0,
            right: 0,
            backgroundColor: '#EFEFEF',
            border: '1px solid #CCCCCC',
            display: 'flex'
        },
            historyItem = {
                flex: 1,
                maxWidth: '40px',
                height: '100px',
                backgroundColor: '#333333',
                marginRight: '5px'
            }

        const todoItems = this.state.items.map((item, index) =>
            <div style={historyItem} key={item.toString() + index} onMouseOver={() => this.applyState(index)}></div>
        );

        return (
            this.state.showHistory
                ? <div style={historyHolder as any}>{todoItems}</div>
                : null
        );
    }

    applyState(index: any) {
        if (!this.state.lastIndex) {
            this.state.lastIndex = this.state.items.length - 1;
        }

        const targetRoute = this.state.items[index].getIn(['router', 'url']);

        const lastState = this.state.items[this.state.lastIndex];
        if (targetRoute && lastState.get('router') && lastState.getIn(['router', 'url']) !== targetRoute) {
            this.props.routerHistory.push(targetRoute);
            this.changeState(index);
        } else {
            this.changeState(index);
        }

    }

    private changeState(index: any) {
        this.state.lastIndex = index;
        Store.store.select([])
            .update((state: any) => {
                state.clear();
                state.merge(this.state.items[index]);
            }, true);
    }
}
import { Dispatcher } from "../services/dispatcher";

export class AsyncValueResolver {
    private static _instance: AsyncValueResolver = null;

    private values: any = {};
    private subscriptions: any = {};

    static get instance() {
        if (!this._instance) {
            this._instance = new AsyncValueResolver();
        }

        return this._instance;
    }

    resolve(input: any, observableId: string) {
        // Make sure we have an Observable or a Promise
        if (!input || !(input.subscribe || input.then)) {
            return input;
        }

        if (!(observableId in this.subscriptions)) {
            const subscriptionStrategy = input.subscribe && input.subscribe.bind(input)
                || input.success && input.success.bind(input) // To make it work with HttpPromise
                || input.then.bind(input);

            this.subscriptions[observableId] = subscriptionStrategy((value: any) => {
                this.values[observableId] = value;
                Dispatcher.publish(observableId.split('_')[0]);
            });
        }

        return this.values[observableId];
    };

    unsubscribe(actionId: string) {
        const idsToUnsubscribe = Object.keys(this.subscriptions)
            .filter((id: string) => id.startsWith(actionId));

        idsToUnsubscribe.forEach((id: string) => {
            const sub = this.subscriptions[id];
            if (sub) {
                sub.unsubscribe && sub.unsubscribe();
                sub.dispose && sub.dispose();
            }
            delete this.subscriptions[id];
            delete this.values[id];
        });
    }
}

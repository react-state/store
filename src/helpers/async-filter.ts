const values: any = {};
const subscriptions: any = {};

export function resolveAsync(input: any, observableId: string) {
    // Make sure we have an Observable or a Promise
    if (!input || !(input.subscribe || input.then)) {
        return input;
    }

    if (!(observableId in subscriptions)) {
        const subscriptionStrategy = input.subscribe && input.subscribe.bind(input)
            || input.success && input.success.bind(input) // To make it work with HttpPromise
            || input.then.bind(input);

        subscriptions[observableId] = subscriptionStrategy((value: any) => {
            values[observableId] = value;
        });
    }

    return values[observableId];
};

export function unsubscribe(ids: string[]) {
    ids.forEach(id => {
        const sub = subscriptions[id];
        if (sub) {
            sub.unsubscribe && sub.unsubscribe();
            sub.dispose && sub.dispose();
        }
        delete subscriptions[id];
        delete values[id];
    });
}
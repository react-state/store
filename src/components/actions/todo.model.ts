import { Message } from './../../../projects/react-state/src/services/dispatcher';

export class TodoModel {
    name: string;
    description: string;
}

export class ClearTodoMessage extends Message {
    constructor(payload?: any) {
        super('ClearTodoMessages', payload);
    }
}

export class UpdateTodoItemMessage extends Message {
    constructor(payload?: any) {
        super('UpdateTodoItemMessage', payload);
    }
}
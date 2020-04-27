export { };
import { Tracking } from './FreelancehuntAPI';
import { Observer } from './Freelancehunt';
import { threadId } from 'worker_threads';


export class User {
    public observer!: Observer;
    public skills!: string[];
    public buttons!: object[];
    public options!: object;

    constructor(observer: Observer) {
        this.observer = observer;
    }
}
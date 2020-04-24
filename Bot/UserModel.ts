export { };
import { Tracking } from './FreelancehuntAPI';


export class User {
    public tracking: Tracking;
    public skills: string[];
    public buttons: object[];
    public options: object;


    constructor(tracking: Tracking, skills: string[], buttons: any[], options: object) {
        this.tracking = tracking;
        this.skills = skills;
        this.buttons = buttons;
        this.options = options;
    }
}

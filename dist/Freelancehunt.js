"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Tracking {
    constructor() {
        this.observers = [];
    }
    /**
     * attach
     */
    attach(observer) {
        const isExist = this.observers.includes(observer);
        if (isExist) {
            return console.log('This observer has been already attached.');
        }
        this.observers.push(observer);
    }
    /**
     * dettach
     */
    dettach(observer) {
        const observerIndex = this.observers.indexOf(observer);
        if (observerIndex === -1) {
            return console.log('This observer not exist.');
        }
        this.observers.splice(observerIndex, 1);
    }
    /**
     * notify
     */
    notify() {
        for (const observer of this.observers) {
            observer.update(this);
        }
    }
    /**
     * businessLogic
     */
    businessLogic() {
        this.notify();
    }
}
class Observer {
    constructor() {
        this.isRunning = false;
        this.currentSkills = [];
    }
    /**
     * update
     */
    update(track) {
        console.log('Notify user about projects!');
    }
}
function generateUrlWithSkills(skills) {
    /**
     * Generate url for event user by his/ger skills.
     */
    let url = 'https://api.freelancehunt.com/v2/projects?filter[skill_id]=' + skills.join(',');
    return url;
}
const track = new Tracking();
const observer = new Observer();
track.attach(observer);
track.businessLogic();
//# sourceMappingURL=Freelancehunt.js.map
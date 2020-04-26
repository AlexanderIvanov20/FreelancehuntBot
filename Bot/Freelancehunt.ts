export { };
import request from 'sync-request';
import TelegramBot, { SendMessageOptions } from 'node-telegram-bot-api';
import fs from 'fs';
import path from 'path';


export const token: string = '931369266:AAFiXlP3Wvxp8tjMoRX78JJ8xG3k_WZJN84';
const bot = new TelegramBot(token);
export const optionsMessage: SendMessageOptions = { parse_mode: 'Markdown' };
const options = {
    headers: {
        'Authorization': 'Bearer 1db7b5f0e42435bac8272098372e80624e182141'
    }
};


interface ITracking {
    attach(observer: Observer): void;
    dettach(observer: Observer): void;
    notify(): void;
}


interface IObserver {
    update(track: Tracking): void;
}


class Tracking implements ITracking {
    private observers: Observer[] = [];
    /**
     * attach. Subscribe user.
     */
    public attach(observer: Observer): void {
        const isExist: boolean = this.observers.includes(observer);
        if (isExist) {
            return console.log('This observer has been already attached.');
        }
        this.observers.push(observer);
    }
    /**
     * dettach. Unsubscribe user.
     */
    public dettach(observer: Observer): void {
        const observerIndex: number = this.observers.indexOf(observer);
        if (observerIndex === -1) {
            return console.log('This observer not exist.');
        }
        this.observers.splice(observerIndex, 1);
    }
    /**
     * notify. Go on array by cycle.
     */
    public notify() {
        for (const observer of this.observers) {
            observer.update(this);
        }
    }
}


export class Observer implements IObserver {
    private _userId!: number | string;
    private _projectsPath!: string;
    public __isRunning: boolean = true;
    public currentSkills!: string[];
    private dataFile!: any[];
    private projects!: any[];

    constructor(userId: number | string) {
        this._userId = userId;
        this._projectsPath = path.join(__dirname, `${this._userId}_projects.json`);
    }
    /**
     * update. Get and send project. Also check on already notified.
     */
    public update(track: Tracking) {
        console.log(`Notify user: ${this._userId}...`)

        const res = request('GET', generateUrlWithSkills(['56', '182', '24']), options);
        this.projects = JSON.parse(res.getBody('utf8')).data;
        this.dataFile = JSON.parse(fs.readFileSync(this._projectsPath, 'utf8').toString());

        if (!fs.existsSync(this._projectsPath)) {
            fs.writeFileSync(this._projectsPath, JSON.stringify(this.projects, null, 4));
            for (let item in this.projects) {
                this.send(this.projects, item, this._userId);
            }
        }
        for (let item in this.projects) {
            if (!this.dataFile.some(obj => obj.id === this.projects[item].id)) {
                this.send(this.projects, item, this._userId);
            }
        }
        fs.writeFileSync(this._projectsPath, JSON.stringify(this.projects, null, 4));

        setTimeout(() => {
            if (this.__isRunning) track.notify();
        }, 10000);
    }

    /**
     * send. Generate message and send it to current user by id.
     */
    private send(projects: any[], item: any, userId: number | string): void {
        let messageHello: string = `Title: *${projects[item].attributes.name}*\n\n` +
            `Description: ${projects[item].attributes.description}\n` +
            `Link: ${projects[item].links.self.web}`;
        bot.sendMessage(userId, messageHello, optionsMessage);
    }
}


/**
 * Generate url for event user by his/ger skills.
 */
export function generateUrlWithSkills(skills: string[]): string {
    let url: string = 'https://api.freelancehunt.com/v2/projects?filter[skill_id]=' + skills.join(',');
    return url;
}


export const track = new Tracking();

// const observer = new Observer('1118871102');
// track.attach(observer);

// track.notify();

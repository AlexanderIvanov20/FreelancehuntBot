export { };
import request from 'request';
import TelegramBot, { SendMessageOptions } from 'node-telegram-bot-api';
import fs from 'fs';
import path from 'path';


export const token: string = '931369266:AAFiXlP3Wvxp8tjMoRX78JJ8xG3k_WZJN84';
export const bot = new TelegramBot(token);


interface ITracking {
    attach(observer: Observer): void;
    dettach(observer: Observer): void;
    notify(): void;
}


class Tracking implements ITracking {
    private observers: Observer[] = [];
    /**
     * attach
     */
    public attach(observer: Observer): void {
        const isExist: boolean = this.observers.includes(observer);
        if (isExist) {
            return console.log('This observer has been already attached.');
        }
        this.observers.push(observer);
    }
    /**
     * dettach
     */
    public dettach(observer: Observer): void {
        const observerIndex: number = this.observers.indexOf(observer);
        if (observerIndex === -1) {
            return console.log('This observer not exist.');
        }
        this.observers.splice(observerIndex, 1);
    }
    /**
     * notify
     */
    public notify() {
        for (const observer of this.observers) {
            observer.update(this);
        }
    }
    /**
     * businessLogic
     */
    public businessLogic() {
        this.notify();
    }
}


interface IObserver {
    update(track: Tracking): void;
}


class Observer implements IObserver {
    public isRunning: boolean = false;
    public currentSkills: string[] = [];
    /**
     * update
     */
    public update(track: Tracking) {
        console.log('Notify user about projects!');
    }
}


function generateUrlWithSkills(skills: string[]): string {
    /**
     * Generate url for event user by his/ger skills.
     */
    let url: string = 'https://api.freelancehunt.com/v2/projects?filter[skill_id]=' + skills.join(',');
    return url;
}


const track = new Tracking();

const observer = new Observer();
track.attach(observer);

track.businessLogic();

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sync_request_1 = __importDefault(require("sync-request"));
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.token = '931369266:AAFiXlP3Wvxp8tjMoRX78JJ8xG3k_WZJN84';
const bot = new node_telegram_bot_api_1.default(exports.token);
exports.optionsMessage = { parse_mode: 'Markdown' };
const options = {
    headers: {
        'Authorization': 'Bearer 1db7b5f0e42435bac8272098372e80624e182141'
    }
};
class Tracking {
    constructor() {
        this.observers = [];
    }
    /**
     * attach. Subscribe user.
     */
    attach(observer) {
        const isExist = this.observers.includes(observer);
        if (isExist) {
            return console.log('This observer has been already attached.');
        }
        this.observers.push(observer);
    }
    /**
     * dettach. Unsubscribe user.
     */
    dettach(observer) {
        const observerIndex = this.observers.indexOf(observer);
        if (observerIndex === -1) {
            return console.log('This observer not exist.');
        }
        this.observers.splice(observerIndex, 1);
    }
    /**
     * notify. Go on array by cycle.
     */
    notify() {
        for (const observer of this.observers) {
            observer.update(this);
        }
    }
}
class Observer {
    constructor(userId) {
        this._userId = userId;
        this._projectsPath = path_1.default.join(__dirname, `${this._userId}_projects.json`);
    }
    /**
     * update. Get and send project. Also check on already notified.
     */
    async update(track) {
        console.log(`Notify user: ${this._userId}...`);
        const res = sync_request_1.default('GET', generateUrlWithSkills(this.currentSkills), options);
        this.projects = JSON.parse(res.getBody('utf8')).data;
        this.dataFile = JSON.parse(fs_1.default.readFileSync(this._projectsPath, 'utf8').toString());
        if (!fs_1.default.existsSync(this._projectsPath)) {
            fs_1.default.writeFileSync(this._projectsPath, JSON.stringify(this.projects, null, 4));
            for (let item in this.projects) {
                this.send(this.projects, item, this._userId);
            }
        }
        for (let item in this.projects) {
            if (!this.dataFile.some(obj => obj.id === this.projects[item].id)) {
                this.send(this.projects, item, this._userId);
            }
        }
        fs_1.default.writeFileSync(this._projectsPath, JSON.stringify(this.projects, null, 4));
        setTimeout(() => {
            track.notify();
        }, 10000);
    }
    /**
     * send. Generate message and send it to current user by id.
     */
    send(projects, item, userId) {
        let messageHello = `Title: *${projects[item].attributes.name}*\n\n` +
            `Description: ${projects[item].attributes.description}\n` +
            `Link: ${projects[item].links.self.web}`;
        bot.sendMessage(userId, messageHello, exports.optionsMessage);
    }
}
exports.Observer = Observer;
/**
 * Generate url for event user by his/ger skills.
 */
function generateUrlWithSkills(skills) {
    let url = 'https://api.freelancehunt.com/v2/projects?filter[skill_id]=' + skills.join(',');
    return url;
}
exports.generateUrlWithSkills = generateUrlWithSkills;
exports.track = new Tracking();
// const observer = new Observer('1118871102');
// track.attach(observer);
// track.notify();
//# sourceMappingURL=Freelancehunt.js.map
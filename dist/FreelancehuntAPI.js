"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.token = '931369266:AAFiXlP3Wvxp8tjMoRX78JJ8xG3k_WZJN84';
exports.bot = new node_telegram_bot_api_1.default(exports.token);
exports.telegramOptionsMessage = {
    parse_mode: 'Markdown'
};
class Tracking {
    constructor(token, bot, telegramOptionsMessage) {
        this.optionsRequest = null;
        this.running = true;
        /*
        Construct all elements.
        */
        this.token = token;
        this.bot = bot;
        this.telegramOptionsMessage = telegramOptionsMessage;
    }
    async getProjectsByMySkills(userId) {
        /*
        Send projects, that create in real-time, to user.
        */
        if (this.running) {
            try {
                request_1.default(this.optionsRequest, (error, response) => {
                    if (error)
                        console.error(error);
                    let data = JSON.parse(response.body);
                    let projects = data.data;
                    let projectsPath = path_1.default.join(__dirname, `${userId}_projects.json`);
                    if (!fs_1.default.existsSync(projectsPath)) {
                        fs_1.default.writeFileSync(projectsPath, JSON.stringify(projects, null, 4));
                        for (let item in projects) {
                            sendProject(projects, item, userId);
                        }
                    }
                    let dataFile = JSON.parse(fs_1.default.readFileSync(projectsPath, 'utf8').toString());
                    let point = false;
                    for (let item in projects) {
                        if (!dataFile.some(obj => obj.id === projects[item].id)) {
                            sendProject(projects, item, userId);
                            point = true;
                        }
                    }
                    this.trackingResult(point, projects, projectsPath, userId);
                });
            }
            catch (errorSome) {
                this.trackingError(errorSome);
            }
        }
    }
    async trackingResult(point, projects, pathToJson, userId) {
        /*
        Function that "sums up". Check point on truth and rewrite it to json, if array have new project.
        */
        if (this.running) {
            if (!point) {
                console.log("Function didn't send anything... There are not new projects!");
            }
            else {
                fs_1.default.writeFileSync(pathToJson, JSON.stringify(projects, null, 4));
                console.log('Projects updated!');
            }
            let that = this;
            setTimeout(function () {
                that.getProjectsByMySkills(userId);
            }, 10000);
        }
    }
    async trackingError(errorSome) {
        /*
        Handling error, but don't stop loop
        */
        console.error('Error:' + errorSome);
    }
}
exports.Tracking = Tracking;
async function sendProject(projects, item, userId) {
    /*
    Generate message and send it to current user by id
    */
    let messageHello = `Title: *${projects[item].attributes.name}*\n\n` +
        `Description: ${projects[item].attributes.description}\n` +
        `Link: ${projects[item].links.self.web}`;
    exports.bot.sendMessage(userId, messageHello, exports.telegramOptionsMessage);
}
exports.sendProject = sendProject;
function generateUrlWithSkills(args) {
    /*
    Generate url for event user by his/ger skills.
    */
    let url = 'https://api.freelancehunt.com/v2/projects?filter[skill_id]=' + args.join(',');
    return url;
}
exports.generateUrlWithSkills = generateUrlWithSkills;
//# sourceMappingURL=FreelancehuntAPI.js.map
export { };
import request from 'request';
import TelegramBot, { SendMessageOptions } from 'node-telegram-bot-api';
import fs from 'fs';
import path from 'path';


export const token: string = '931369266:AAFiXlP3Wvxp8tjMoRX78JJ8xG3k_WZJN84';
export const bot = new TelegramBot(token);
export const telegramOptionsMessage: SendMessageOptions = {
    parse_mode: 'Markdown'
}


export class Tracking {
    /*
    Class for tracking projects on Freelancehunt (Start, stop, get).
    */
    public token: string;
    public bot: any;
    public optionsRequest: any = null;
    public telegramOptionsMessage: SendMessageOptions;
    public running: boolean = true;

    constructor(token: string, bot: any, telegramOptionsMessage: SendMessageOptions) {
        /*
        Construct all elements.
        */
        this.token = token;
        this.bot = bot;
        this.telegramOptionsMessage = telegramOptionsMessage;
    }

    public async getProjectsByMySkills(userId: number | string) {
        /*
        Send projects, that create in real-time, to user.
        */
        if (this.running) {
            try {
                request(this.optionsRequest, (error: object | null, response: request.Response): void => {
                    if (error) console.error(error);

                    let data = JSON.parse(response.body);
                    let projects: any[] = data.data;
                    let projectsPath: string = path.join(__dirname, `${userId}_projects.json`);

                    if (!fs.existsSync(projectsPath)) {
                        fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 4));

                        for (let item in projects) {
                            sendProject(projects, item, userId);
                        }
                    }

                    let dataFile: any[] = JSON.parse(fs.readFileSync(projectsPath, 'utf8').toString());
                    let point: boolean = false;
                    for (let item in projects) {
                        if (!dataFile.some(obj => obj.id === projects[item].id)) {
                            sendProject(projects, item, userId);
                            point = true
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


    private async trackingResult(point: boolean, projects: any[], pathToJson: string, userId: number | string): Promise<void> {
        /*
        Function that "sums up". Check point on truth and rewrite it to json, if array have new project.
        */
        if (this.running) {
            if (!point) {
                console.log("Function didn't send anything... There are not new projects!");
            }
            else {
                fs.writeFileSync(pathToJson, JSON.stringify(projects, null, 4));
                console.log('Projects updated!');
            }
            let that = this;
            setTimeout(function () {
                that.getProjectsByMySkills(userId);
            }, 10000);
        }
    }


    private async trackingError(errorSome: Function | any): Promise<void> {
        /*
        Handling error, but don't stop loop
        */
        console.error('Error:' + errorSome);
    }
}


export async function sendProject(projects: any[], item: any, userId: number | string): Promise<void> {
    /*
    Generate message and send it to current user by id
    */
    let messageHello: string = `Title: *${projects[item].attributes.name}*\n\n` +
        `Description: ${projects[item].attributes.description}\n` +
        `Link: ${projects[item].links.self.web}`;
    bot.sendMessage(userId, messageHello, telegramOptionsMessage);
}


export function generateUrlWithSkills(args: string[]): string {
    /*
    Generate url for event user by his/ger skills.
    */
    let url: string = 'https://api.freelancehunt.com/v2/projects?filter[skill_id]=' + args.join(',');
    return url;
}

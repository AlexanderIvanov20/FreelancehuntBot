export { };
import TelegramBot, { SendMessageOptions, Message, CallbackQuery } from 'node-telegram-bot-api';
import fs from 'fs';
import path from 'path';
import { User } from './UserModel';
import { track, Observer, generateUrlWithSkills, token, optionsMessage } from './Freelancehunt';


const pathToSkils: string = path.join(__dirname, '../', 'skills.json');
const bot = new TelegramBot(token, { polling: true });
let ids: number[] = [];
let skills: any[] = JSON.parse(fs.readFileSync(pathToSkils, { encoding: 'utf8' }));


type ObjectUser = Record<string | number, User>;
let users: ObjectUser = {};
/**
 * Configure inline options for select skills.
 */
function markupButtons(someButtons: any[], msg: any) {
    let inlineButtons: any = {
        reply_markup: JSON.stringify({
            inline_keyboard: someButtons
        }),
        parse_mode: 'Markdown',
        chat_id: msg.chat.id,
        message_id: msg.message_id
    };
    return inlineButtons;
}
/**
 * Deleting message.
 */
async function deleteNeededMessages(msg: Message): Promise<void> {
    bot.deleteMessage(msg.chat.id, (msg.message_id - 1).toString());
    bot.deleteMessage(msg.chat.id, (msg.message_id - 2).toString());
}
/**
 * On start event. Write to file id to further using for send new projects.
 */
bot.onText(/\/start/, function (msg: Message, match: RegExpExecArray | null) {
    // const observer = new Observer(msg.chat.id);

    for (let item in skills) {
        ids.push(+(skills[item]['id']));
    }

    let message: string = `Hello, *${msg.chat.first_name} ${msg.chat.last_name}*.\n\n` +
        `Select skills! To choose your skills click a button.`;
    let chooseButton: any = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Select some skills', callback_data: 'chooseSkills' }]
            ]
        }),
        parse_mode: 'Markdown'
    };
    bot.sendMessage(msg.chat.id, message, chooseButton);
});
/**
 * Check and react on skills id.
 */
bot.on('callback_query', (callbackQuery: CallbackQuery) => {
    const action: any = callbackQuery.data;
    const msg: any = callbackQuery.message;

    if (action === 'chooseSkills') {
        // bot.editMessageText('Select skills: ', users[msg.chat.id].options);
    }
    else if (ids.includes(+action)) {
        users[msg.chat.id].skills.push(action);
        let userButtons: any = users[msg.chat.id].buttons;

        let point: boolean = true;
        for (let item = 0; item < users[msg.chat.id].buttons.length; item++) {
            if (userButtons[item][0]['callback_data'] == +action) {
                userButtons.splice(item, 1);
            }
            if (userButtons[item][0]['callback_data'] == 'stopSelecting') {
                point = false;
            }
        }
        if (point) {
            userButtons.push([{
                text: 'Stop selecting...',
                callback_data: 'stopSelecting'
            }]);
        }
        // bot.editMessageText('Select skills: ', users[msg.chat.id].options);
    }
    else if (action === 'stopSelecting') {
        bot.editMessageText(`For *start* getting new projects press on /trackProjects.`, {
            chat_id: msg.chat.id,
            message_id: msg.message_id,
            parse_mode: 'Markdown'
        });
    }
});
/**
 * Start getting projects by function from another file.
 */
bot.onText(/\/trackProjects/, function (msg: Message, match: RegExpExecArray | null) {
    deleteNeededMessages(msg);
    users[msg.chat.id].tracking.getProjectsByMySkills(msg.chat.id);
    bot.sendMessage(msg.chat.id, 'Now you *track* projects.\n\nIf you want to stop tacking, press on /stopTrackProjects.' +
        'If there are not new projects, the bot will not output anything', optionsMessage);
});
/**
 * Stop getting projects by function from another file.
 */
bot.onText(/\/stopTrackProjects/, function (msg: Message, match: RegExpExecArray | null) {
    users[msg.chat.id].tracking.running = false;
    bot.sendMessage(msg.chat.id, 'Now you * don\'t track* projects.\n\nIf you want to start tacking, press on /trackProjects.', optionsMessage);
});
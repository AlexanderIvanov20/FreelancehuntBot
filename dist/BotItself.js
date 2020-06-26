"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const path_1 = __importDefault(require("path"));
const Freelancehunt_1 = require("./Freelancehunt");
const UserModel_1 = require("./UserModel");
const pathToSkils = path_1.default.join(__dirname, '../', 'skills.json');
const bot = new node_telegram_bot_api_1.default(Freelancehunt_1.token, { polling: true });
let ids = [];
let skills = JSON.parse(fs_1.default.readFileSync(pathToSkils, { encoding: 'utf8' }));
let users = {};
/**
 * Configure inline options for select skills.
 */
function markupButtons(someButtons, msg) {
    let inlineButtons = {
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
async function deleteNeededMessages(msg) {
    bot.deleteMessage(msg.chat.id, (msg.message_id - 1).toString());
    bot.deleteMessage(msg.chat.id, (msg.message_id - 2).toString());
}
/**
 * On start event. Write to file id to further using for send new projects.
 */
bot.onText(/\/start/, function (msg) {
    const observer = new Freelancehunt_1.Observer(msg.chat.id);
    const user = new UserModel_1.User(observer);
    user.buttons = [];
    user.skills = [];
    users[msg.chat.id] = user;
    for (let item in skills) {
        ids.push(+(skills[item]['id']));
        users[msg.chat.id].buttons.push([
            {
                text: skills[item]['name'],
                callback_data: skills[item]['id']
            }
        ]);
    }
    let message = `Hello, *${msg.chat.first_name} ${msg.chat.last_name}*.\n\n` +
        `Select skills! To choose your skills click a button.`;
    let chooseButton = {
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
bot.on('callback_query', (callbackQuery) => {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    if (action === 'chooseSkills') {
        users[msg.chat.id].options = markupButtons(users[msg.chat.id].buttons, msg);
        bot.editMessageText('Select skills: ', users[msg.chat.id].options);
    }
    else if (ids.includes(+action)) {
        users[msg.chat.id].skills.push(action);
        let userButtons = users[msg.chat.id].buttons;
        let point = true;
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
        users[msg.chat.id].options = markupButtons(userButtons, msg);
        bot.editMessageText('Select skills: ', users[msg.chat.id].options);
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
bot.onText(/\/trackProjects/, function (msg) {
    deleteNeededMessages(msg);
    users[msg.chat.id].observer.currentSkills = users[msg.chat.id].skills;
    Freelancehunt_1.track.attach(users[msg.chat.id].observer);
    bot.sendMessage(msg.chat.id, 'Now you *track* projects.\n\nIf you want to stop tacking, press on /stopTrackProjects.' +
        'If there are not new projects, the bot will not output anything', Freelancehunt_1.optionsMessage);
    Freelancehunt_1.track.notify();
});
/**
 * Stop getting projects by function from another file.
 */
bot.onText(/\/stopTrackProjects/, function (msg) {
    Freelancehunt_1.track.dettach(users[msg.chat.id].observer);
    bot.sendMessage(msg.chat.id, 'Now you * don\'t track* projects.\n\nIf you want to start tacking, press on /trackProjects.', Freelancehunt_1.optionsMessage);
});
//# sourceMappingURL=BotItself.js.map
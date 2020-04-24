export { };
import TelegramBot, { SendMessageOptions, Message, CallbackQuery } from 'node-telegram-bot-api';
import fs from 'fs';
import { Tracking, generateUrlWithSkills, token, telegramOptionsMessage } from './FreelancehuntAPI';
import { User } from './UserModel';


const bot = new TelegramBot(token, { polling: true });
const pathToSkils: string = __dirname + '\\skills.json';
let ids: number[] = [];
let skills: any[] = JSON.parse(fs.readFileSync(pathToSkils, { encoding: 'utf8' }));


type ObjectUser = Record<string | number, User>;
let users: ObjectUser = {};


function markupButtons(someButtons: any[], msg: any) {
    /*
    Configure inline options for select skills.
    */
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


async function deleteNeededMessages(msg: Message): Promise<void> {
    /*
    Deleting message.
    */
    bot.deleteMessage(msg.chat.id, (msg.message_id - 1).toString());
    bot.deleteMessage(msg.chat.id, (msg.message_id - 2).toString());
}


bot.onText(/\/start/, function (msg: Message, match: RegExpExecArray | null) {
    /*
    On start event. Write to file id to further using for send new projects.
    */
    const user: User = new User(new Tracking(token, bot, telegramOptionsMessage), [], [], {});
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


bot.on('callback_query', (callbackQuery: CallbackQuery) => {
    /*
    Check and react on skills id.
    */
    const action: any = callbackQuery.data;
    const msg: any = callbackQuery.message;

    if (action === 'chooseSkills') {
        users[msg.chat.id].options = markupButtons(users[msg.chat.id].buttons, msg);
        bot.editMessageText('Select skills: ', users[msg.chat.id].options);
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


bot.onText(/\/trackProjects/, function (msg: Message, match: RegExpExecArray | null) {
    /*
    Start getting projects by function from another file.
    */
    deleteNeededMessages(msg);
    users[msg.chat.id].tracking.optionsRequest = {
        'method': 'GET',
        'url': generateUrlWithSkills(users[msg.chat.id].skills),
        'headers': {
            'Authorization': 'Bearer 1db7b5f0e42435bac8272098372e80624e182141'
        }
    };
    users[msg.chat.id].tracking.getProjectsByMySkills(msg.chat.id);
    bot.sendMessage(msg.chat.id, 'Now you *track* projects.\n\nIf you want to stop tacking, press on /stopTrackProjects.' +
        'If there are not new projects, the bot will not output anything', telegramOptionsMessage);
});


bot.onText(/\/stopTrackProjects/, function (msg: Message, match: RegExpExecArray | null) {
    /*
    Stop getting projects by function from another file.
    */
    users[msg.chat.id].tracking.running = false;
    bot.sendMessage(msg.chat.id, 'Now you * don\'t track* projects.\n\nIf you want to start tacking, press on /trackProjects.', telegramOptionsMessage);
});
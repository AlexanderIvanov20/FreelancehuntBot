export { };
import fs from 'fs';
import TelegramBot from 'node-telegram-bot-api';
import path from 'path';
import { UserActions } from './Users';


const skills: any[] = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, '../../', 'skills.json'),
        { encoding: 'utf8' }
    )
);
let formatedSkills: any[][] = [];
let ids: number[] = [];
for (const key in skills) {
    formatedSkills.push(
        [{ text: skills[key].name, callback_data: skills[key].id }]
    )
    ids.push(skills[key].id);
}


let users: any = {};

const token: string = '931369266:AAFiXlP3Wvxp8tjMoRX78JJ8xG3k_WZJN84';
const bot = new TelegramBot(token, { polling: true });
const userAct = new UserActions();


async function deleteMessages(msg: TelegramBot.Message): Promise<void> {
    bot.deleteMessage(msg.chat.id, (msg.message_id - 0).toString());
    bot.deleteMessage(msg.chat.id, (msg.message_id - 1).toString());
}


bot.onText(/\/start/, (msg: TelegramBot.Message): void => {
    userAct.isCreated(msg.chat.id).then((isUnique: boolean) => {
        if (isUnique) userAct.addUser(msg.chat.id, msg.chat.username);
    });

    console.log(skills);

    bot.sendMessage(
        msg.chat.id,
        `*Hello*.\n` +
        `This is a bot that helps you at _tracking projects_ on *Freelancehunt*.\n\n` +
        `If you want to start tracking press _the button_ below.`,
        {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Select skills", callback_data: "options" }]
                ]
            }
        }
    );
});


bot.on('callback_query', (callbackQuery: TelegramBot.CallbackQuery): void => {
    const action: any = callbackQuery.data;
    const msg: TelegramBot.Message = callbackQuery.message!;

    if (action == "options") {
        deleteMessages(msg);
        users[`${msg.chat.id}_skills`] = formatedSkills

        bot.sendMessage(
            msg.chat.id,
            `Check _special skills_\n\n` +
            `If you _finish selecting_, you can go yo *the next step*.`,
            {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: users[`${msg.chat.id}_skills`]
                }
            }
        );
    }

    else if (action == `start_track`) {
        
    }

    else if (ids.includes(+action)) {
        for (const key in users[`${msg.chat.id}_skills`]) {
            if (users[`${msg.chat.id}_skills`][key][0].callback_data == +action) {
                users[`${msg.chat.id}_skills`].splice(+key, 1);

                if (users.hasOwnProperty(`${msg.chat.id}_current_skills`)) {
                    users[`${msg.chat.id}_current_skills`].push(+action);
                } else {
                    users[`${msg.chat.id}_current_skills`] = [+action];
                }

                bot.editMessageText(
                    `Check <i>special skills</i>.\n\n` +
                    `If you <i>finish selecting</i>, you can go yo <b>the next step</b>.\n/stop_selecting`,
                    {
                        parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: users[`${msg.chat.id}_skills`]
                        },
                        message_id: msg.message_id,
                        chat_id: msg.chat.id
                    }
                );
            }
        }
    }
});


bot.onText(/\/stop_selecting/, (msg: TelegramBot.Message): void => {
    deleteMessages(msg);

    userAct.isCreated(msg.chat.id).then((isUnique: boolean) => {
        if (!isUnique) {
            userAct.getUser(msg.chat.id).then((user) => {
                user!.update({
                    ids: users[`${msg.chat.id}_current_skills`]
                });
            });
        }
    });

    bot.sendMessage(
        msg.chat.id,
        `*Ok*. You have finished selecting your _special skills_.\n\n` +
        `To start _tracking new projects_, press this button.`,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: `Start tracking`, callback_data: 'start_track' }]
                ]
            },
            parse_mode: `Markdown`
        }
    )
});
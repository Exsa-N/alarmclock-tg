const TelegramBot = require('node-telegram-bot-api');
const low = require('lowdb');
const tzlookup = require("tz-lookup");
const { DateTime } = require('luxon');
const CronJob = require('cron').CronJob;


const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

const adapterBackup = new FileSync('dbBackup.json');
const dbBackup = low(adapterBackup);

dbBackup.defaults({ admin: {}, user: {} }).write();
db.defaults({ admin: {}, user: {} }).write();

const token = /*'761592231:AAGi8zr5nUDJ-Fow0QMAYcIWfNQxEKEizWI'*/'463171731:AAG9Kz5WbDbk4GgFLrGQRdvCFfyLQCgYaU4';
const bot = new TelegramBot(token, {polling: true});

new CronJob('00 * * * * *', () => {
    let backUp = db.value();
    dbBackup.set('admin', backUp.admin).write();
    dbBackup.set('user', backUp.user).write();
}, null, true, 'Europe/Kiev');

//backUp db each minute with cron
//Add work with groups

let langPack = {
    en: {
        instruct: `Send me time to in format: <code>0-23:0-59 e.g ${getRandomInt(0, 24)}:${getRandomInt(10, 60)}</code> and I will send you some messages at this time `,
        keyboardMenu: [
            '⏰Set new alarm clock', 
            '⏲Turn on/off recent alarm clocks', 
            'Close', 'Help', 
            'Cancel all alarm signals', 'Delete alarm clocks',
            'Set signal repeat number', 'Set signal repeat interval'  
        ],
        timezone: `Firstly send you time zone:\n1. You can send your location.\n2. You can send your time zone in format <code>+/-3:00 e.g +02:00 for Kiev </code>\n3. You can use inline bot @ClockBot, just type: <code>@ClockBot [your country or your capital city or administrative district to which the time zone is attached]</code> e.g. <code>@ClockBot Kiev</code> `,
        greeting: `Hello, `,
        recentClocks: 'Recent alarm clocks',
        noRecentClocks: `You have not got recent alarms yet. Send me time to in format: <code>0-23:0-59 e.g ${getRandomInt(0, 24)}:${getRandomInt(10, 60)}</code> and I will send you some messages at this time `,
        allClocksCanceled: 'All alarm clocks are canceled! ',
        chooseToDelete: 'Choose alarm clocks to delete: ',
        alarmNumber: 'Choose alarm signal number: ',
        alarmInterval: 'Choose alarm signal interval: ',
        error: 'Sorry, error. ',
        alarmNumberSuc: 'Alarm signal number set successfully. ',
        alarmIntervalSuc: 'Alarm signal interval set successfully. ',
        alarmCanceledAndDel: 'Alarm clock canceled and deleted successfully. ',
        alarmDel: 'Alarm clock deleted successfully. ',
        alarmCanceled: 'Alarm clock canceled successfully. ',
        alarmSetSuc: 'Alarm clock set successfully. ',
        alarmSetUnSuc: 'Alarm clock can not be set. ',
        help: 'Check this: https://telegra.ph/AlarmClock-Bot-Eng-02-15 Or contact my owner: @ExsaNik ',
        langRequest: 'Please choose the language: ',
        lang: 'English',
        signal: 'Beep beep! ',
        gotTime: 'Got time: ',
        rmKeyboard: 'Remove keyboard. ',
        sdKeyboard: 'Send keyboard. ',
        location: 'Location',
        newTimezone: 'New timezone: '
    }, 
    ru: {
        instruct: `Отправьте мне время в формате: <code>0-23:0-59 e.g ${getRandomInt(0, 24)}:${getRandomInt(10, 60)}</code> и я отправлю вам несколько сообщений в это время. `,
        keyboardMenu: [
            '⏰Установить новый будильник', 
            '⏲Вкл/выкл недавних будильников', 
            'Закрыть', 'Помощь', 
            'Отменить все сигналы', 'Удалить будильники',
            'Установить кол-во повторов', 'Установить интервал между сигналами'  
        ],
        timezone: `Для начала отправьте мне свой часовой пояс:\n1. Отправьте свою геопозицию.\n2. Вы можете отправить временную зону вручную в формате <code>+/-3:00 например +02:00 для Киева</code>.\n3. Можете воспользоваться инлайн ботом @ClockBot, просто напечатайте: <code>@ClockBot [ваша страну или ваша столица или административный округ к которому привязан часовой пояс]</code> например <code>@ClockBot Киев</code> `,
        greeting: `Доброго времени суток, `,
        recentClocks: 'Недавние будильники ',
        noRecentClocks: `У вас ещё не были установлены будильники. Отправьте мне время в формате: <code>0-23:0-59 e.g ${getRandomInt(0, 24)}:${getRandomInt(10, 60)}</code> и я отправлю вам несколько сообщений в это время. `,
        allClocksCanceled: 'Все будильники отключены. ',
        chooseToDelete: 'Выберите будильник для удаления. ',
        alarmNumber: 'Выберите кол-во повторов сигнала: ',
        alarmInterval: 'Выберите интервал между сигналами. ',
        error: 'Извините, ошибочка. ',
        alarmNumberSuc: 'Кол-во повторов сигнала установлены успешно. ',
        alarmIntervalSuc: 'Интервал между сигналами установлен успешно. ',
        alarmCanceledAndDel: 'Будильник отменён и удалён успешно. ',
        alarmDel: 'Будильник удалён успешно. ',
        alarmCanceled: 'Будильник отменён успешно. ',
        alarmSetSuc: 'Будильник установлен успешно. ',
        alarmSetUnSuc: 'Будильник не может быть установлен. ',
        help: 'Взгляните: https://telegra.ph/AlarmClock-Bot-Rus-02-15 Или свяжитесь с моим создателем: @ExsaNik ', //Сделать доп русскую инструкцию
        langRequest: 'Пожалуйста выберите язык: ',
        lang: 'Русский',
        signal: 'Бип бип! ',
        gotTime: 'Время установлено: ',
        rmKeyboard: 'Убрать клавиатуру. ',
        sdKeyboard: 'Отправить клавиатуру. ',
        location: 'Геопозиция',
        newTimezone: 'Новый часовой пояс: '
    }
}

const alarmTimes = 7;
const alarmInterval = 1500;
const timeZone = 'noZone';
let timers = {};

function getMsToAlarm(hours, minutes, now)
{
    let Tms = hours * 3600000 + minutes * 60000;
    let Tnow  = now.c.hour * 3600000 + now.c.minute * 60000;
    let alarmMs = 0;

    if(Tms < Tnow)
        alarmMs = (60 - now.c.minute) * 60000 + (23 - now.c.hour) * 3600000 + Tms;
    else 
        alarmMs = Math.abs(Tms - Tnow);

    return alarmMs;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

function clearIntervalsForId(chatId)
{
    let len = 0;
    if(timers[chatId])
        len = timers[chatId].length;

    for(let i = 0; i < len; i++)
        clearTimeout(timers[chatId][i]);
    timers[chatId] = [];
}
function clearAllIntervals()
{
    for (let property in timers) 
        if (timers.hasOwnProperty(property)) 
            clearIntervalsForId(property)
    timers = {};
}
function restartAllIntervals(queueBackup)
{
    if(queueBackup)
    {
        clearAllIntervals();
        for(let i = 0; i < queueBackup.length; i++)
        {
            let tz = db.get(`user.${queueBackup[i].id}.timezone`).value();
            let now = DateTime.local().setZone(tz);
            let newMs = getMsToAlarm(queueBackup[i].hour, queueBackup[i].minute, now);
            if(newMs != queueBackup[i].ms)
            {            
                db.get(`user.${queueBackup[i].id}.queue`).find({ms: queueBackup[i].ms, hour: queueBackup[i].hour, minute: queueBackup[i].minute})
                    .assign({ms: newMs, hour: queueBackup[i].hour, minute: queueBackup[i].minute}).write();
                queueBackup[i].ms = newMs;
            }
            let almTimes = db.get(`user.${queueBackup[i].id}.repeat`).value();
            let almInterv = db.get(`user.${queueBackup[i].id}.interval`).value();
            let timeout = setTimeout(sendMess, newMs, 
                almTimes, queueBackup[i].id, queueBackup[i].ms, queueBackup[i].hour, queueBackup[i].minute, almInterv);
            if(!timers[`${queueBackup[i].id}`])
                timers[`${queueBackup[i].id}`] = [];
            timers[`${queueBackup[i].id}`].push(timeout);
        }
    }
}
function restartIntervalsForId(chatId)
{
    let queueBackup = db.get(`user.${chatId}.queue`).map( el => {el.id = chatId; return el}).value();
    clearIntervalsForId(chatId);
    restartAllIntervals(queueBackup);
}
function runWithStart()
{   
    let backUp = dbBackup.value();
    db.set('admin', backUp.admin).write();
    db.set('user', backUp.user).write();

    clearAllIntervals();
    
    let queues = db.get('user').value();
    let queueBackup = [];
    for (let property in queues) {
        if (queues.hasOwnProperty(property)) 
        {
            let temp = db.get(`user.${property}.queue`).map( el => {el.id = property; return el}).value();
            queueBackup = queueBackup.concat(temp);
        }
    }
    restartAllIntervals(queueBackup);
    

}runWithStart();

function debug(obj = {}) { return JSON.stringify(obj, null, 4) }

function sendMess(times, id, ms, hours, minutes, interval = alarmInterval) 
{
    let language = db.get(`user.${id}.lang`).value();
    let text = (language === 'ru') ? langPack.ru.signal : langPack.en.signal;

    var timerId = setInterval(function() {
        bot.sendMessage(id, text);
      }, (interval - 100));
      
      // через times сек остановить повторы
      setTimeout(function() {
        clearInterval(timerId);
      }, times*interval);   

    db.get(`user.${id}.queue`).remove({ms: ms, hour: hours, minute: minutes }).write();
}

function pushSignalToKeyboard(keyboardIn, alarm, turnOn, symb = '')
{
    let Ahour = (alarm.hour < 10) ? `0${alarm.hour}` : `${alarm.hour}`;
    let Amin = (alarm.minute < 10) ? `0${alarm.minute}` : `${alarm.minute}`;
    let delFlag = (symb === 'del') ? '❌' : '';
    
    if(!turnOn)
        keyboardIn.push({text: delFlag+`${Ahour}:${Amin}`, callback_data: `${alarm.hour} ${alarm.minute} - `+symb});
    else
        keyboardIn.push({text: delFlag+`⏰${Ahour}:${Amin}⏰`, callback_data: `${alarm.hour} ${alarm.minute} + `+symb});
}

function getSignalsForKeyboard(chatId, symb = '')
{
    let alarms = db.get(`user.${chatId}.alarm`).value();
    let keyboardIn = [];
    if(alarms)
    {
        let queues = db.get(`user.${chatId}.queue`).value();
        let len = parseInt(alarms.length/2)+1;
        for(let i = 0, k = -1; i < alarms.length; i++)
        {
            let turnOn = false;
            if(queues)
            {
                for(let j = 0; j < queues.length; j++)
                    if(queues[j].hour === alarms[i].hour && queues[j].minute === alarms[i].minute)
                    {
                        turnOn = true;
                        break;
                    }
            }

            if(i % 2 === 0)
                keyboardIn[++k] = [];
            pushSignalToKeyboard(keyboardIn[k], alarms[i], turnOn, symb);
        }
    }
    return keyboardIn;
}

function sendInlineKeyboard(chatId, keyboardIn, message, errMessage)
{
    if(keyboardIn.length > 0)
    {
        bot.sendMessage(chatId, message, {
            reply_markup:  {
                inline_keyboard:
                    keyboardIn
            }
        });
    }
    else
    {
        bot.sendMessage(chatId, errMessage, 
        {parse_mode: 'HTML'})
    }
}

function intervalRepeatKeyboard(repeatFlag, flagText, text, flagCallback, callback, step = 1, start = 1)
{
    let keyboardIn = [];
    for(let i = 0; i < 10; i++)
    {
        keyboardIn[i] = [];
        for(let j = 0; j < 2; j++)
        {
            if(start == repeatFlag)
                keyboardIn[i].push({text: start + flagText, callback_data: flagCallback + start});
            else
                keyboardIn[i].push({text: start + text, callback_data: callback + start});
            start+=step;
        }
    }
    return keyboardIn
}

function getLangMenu(language)
{
    let phrase = {};
    if(language === 'ru')
    {
        phrase = {
            m1: langPack.ru.keyboardMenu[0],
            m2: langPack.ru.keyboardMenu[1],
            m3: langPack.ru.keyboardMenu[4],
            m4: langPack.ru.keyboardMenu[5],
            m5: langPack.ru.keyboardMenu[6],
            m6: langPack.ru.keyboardMenu[7], 
        }
    }
    else
    {
        phrase = {
            m1: langPack.en.keyboardMenu[0],
            m2: langPack.en.keyboardMenu[1],
            m3: langPack.en.keyboardMenu[4],
            m4: langPack.en.keyboardMenu[5],
            m5: langPack.en.keyboardMenu[6],
            m6: langPack.en.keyboardMenu[7], 
        }
    }
    return phrase;
}
//TODO:
//Написать комментарии к коду
//Поискать еще способ уведомить юзера(мб звонок)


bot.onText(/\/start/, msg => {
    const chatId = msg.from.id;
    const name = msg.from.username || (msg.from.first_name + ' ' + msg.from.last_name);
    let language = (msg.from.language_code === 'ru') ? 'ru0' : 'en0';
    let message = (msg.from.language_code === 'ru') ? langPack.ru.greeting+msg.from.first_name+'.\nРуководство: https://telegra.ph/AlarmClock-Bot-Rus-02-15\n' + langPack.ru.langRequest : langPack.en.greeting+msg.from.first_name+'.\nРуководство: https://telegra.ph/AlarmClock-Bot-Eng-02-15\n' + langPack.en.langRequest;

    bot.sendMessage(chatId, message, {
        parse_mode: 'HTML', 
        reply_markup:{
            keyboard: [
                [langPack.en.lang],
                [langPack.ru.lang]
            ],
            resize_keyboard: true
        }
    });
    
    let dbUser = db.get(`user.${chatId}`).value();
    if(!dbUser)
    {
        let user = {
                "name": name,
                "id": chatId,
                "queue": [],
                "alarm": [],
                "active": true,
                "repeat": alarmTimes,
                "interval": alarmInterval,
                "lang": language,
                "timezone": timeZone,
                "location": 'noLocation'
        };
        db.set(`user.${chatId}`, user).write();
    }
});

bot.on('message', msg => {
    const chatId = msg.from.id;
    let text = msg.text || 'noText';

    if(text != '/start')
    {
        let language = db.get(`user.${chatId}.lang`).value();
        let phrase = getLangMenu(language); 
        if(language === 'ru')
        {
            phrase['t1'] = langPack.ru.recentClocks;
            phrase['t2'] = langPack.ru.noRecentClocks;
            phrase['t3'] = langPack.ru.allClocksCanceled;
            phrase['t4'] = langPack.ru.chooseToDelete;
            phrase['t5'] = langPack.ru.alarmNumber;
            phrase['t6'] = langPack.ru.error;
            phrase['t7'] = langPack.ru.alarmInterval;
            phrase['t8'] = langPack.ru.langRequest;
            phrase['t9'] = langPack.ru.instruct;
            phrase['t10'] = langPack.ru.timezone;
            phrase['t11'] = langPack.ru.location;
            phrase['t12'] = langPack.ru.newTimezone;
            phrase['t13'] = langPack.ru.keyboardMenu[2];
        }
        else
        {
            phrase['t1'] = langPack.en.recentClocks;
            phrase['t2'] = langPack.en.noRecentClocks;
            phrase['t3'] = langPack.en.allClocksCanceled;
            phrase['t4'] = langPack.en.chooseToDelete;
            phrase['t5'] = langPack.en.alarmNumber;
            phrase['t6'] = langPack.en.error;
            phrase['t7'] = langPack.en.alarmInterval;
            phrase['t8'] = langPack.en.langRequest;
            phrase['t9'] = langPack.en.instruct;
            phrase['t10'] = langPack.en.timezone;
            phrase['t11'] = langPack.en.location;
            phrase['t12'] = langPack.en.newTimezone
            phrase['t13'] = langPack.en.keyboardMenu[2];
        }

        let timeZone = text.match(/[+-](([0,1][0-9])|(2[0-3])):[0-5][0-9]/i) || false;
        let timeZoneState = db.get(`user.${chatId}.timezone`).value();

        if((language === 'ru0' || language === 'en0') && text != langPack.ru.lang && text != langPack.en.lang) 
        {
            text = 'noLang';
            phrase.t8 = (msg.from.language_code === 'ru') ? langPack.ru.langRequest : langPack.en.langRequest;
        }
        else if(text === langPack.ru.lang || text === langPack.en.lang)
            true;       //Делаю это чтобы не упустить изменение языка
        else if(timeZone && (language != 'ru0' || language != 'en0'))
            text = 'timezone';
        else if(timeZoneState === 'noZone' && (language != 'ru0' || language != 'en0') && msg.location === undefined)
            text = timeZoneState;
            

        console.log(debug(msg));
        switch(text)
        {
            case phrase.m1:
                bot.sendMessage(chatId, phrase.t9, {parse_mode: 'HTML'});
            break;
            case phrase.m2:
                keyboardIn = getSignalsForKeyboard(chatId);
                sendInlineKeyboard(chatId, keyboardIn, phrase.t1, phrase.t2); 
            break;
            case phrase.m3:
                db.set(`user.${chatId}.queue`, []).write();
                clearIntervalsForId(chatId);
                bot.sendMessage(chatId, phrase.t3);
            break;
            case phrase.m4:
                keyboardIn = getSignalsForKeyboard(chatId, 'del');
                sendInlineKeyboard(chatId, keyboardIn, phrase.t4, phrase.t2); 
            break;
            case phrase.m5:
                var repeatFlag = db.get(`user.${chatId}.repeat`).value();
                keyboardIn = intervalRepeatKeyboard(repeatFlag, `⭐️ `,  ` `, `repeat `, `repeat `, 1, 1);
                sendInlineKeyboard(chatId, keyboardIn, phrase.t5, phrase.t6); 
            break;
            case phrase.m6:
                repeatFlag = (db.get(`user.${chatId}.interval`).value())/1000;
                keyboardIn = intervalRepeatKeyboard(repeatFlag, ` sec ️️⭐️`,  ` sec`, `interval `, `interval `, 0.5, 1);
                sendInlineKeyboard(chatId, keyboardIn, phrase.t7, phrase.t6); 
            break;
            case langPack.ru.lang:
                db.set(`user.${chatId}.lang`, 'ru').write();
                if(timeZoneState === 'noZone')
                {
                    bot.sendMessage(chatId, langPack.ru.timezone, {
                        parse_mode: 'HTML', 
                        reply_markup:{
                            keyboard: [
                                [{text: langPack.ru.location, request_location: true}],
                            ],
                            resize_keyboard: true
                        }
                    });
                }
                else
                {
                    bot.sendMessage(chatId, "Ok", {
                        reply_markup:{
                            keyboard: [
                                [langPack.ru.keyboardMenu[0]],
                                [langPack.ru.keyboardMenu[1]],
                                [langPack.ru.keyboardMenu[4], langPack.ru.keyboardMenu[5]],
                                [langPack.ru.keyboardMenu[6], langPack.ru.keyboardMenu[7]]
                            ],
                            resize_keyboard: true
                        }
                    });
                }
                break;
            case langPack.en.lang:
                db.set(`user.${chatId}.lang`, 'en').write();
                if(timeZoneState === 'noZone')
                {
                    bot.sendMessage(chatId, langPack.en.timezone, {
                        parse_mode: 'HTML', 
                        reply_markup:{
                            keyboard: [
                                [{text: langPack.en.location, request_location: true}],
                            ],
                            resize_keyboard: true
                        }
                    });
                }
                else
                {
                    bot.sendMessage(chatId, "Ok", {
                        reply_markup:{
                            keyboard: [
                                [langPack.en.keyboardMenu[0]],
                                [langPack.en.keyboardMenu[1]],
                                [langPack.en.keyboardMenu[4], langPack.en.keyboardMenu[5]],
                                [langPack.en.keyboardMenu[6], langPack.en.keyboardMenu[7]]
                            ],
                            resize_keyboard: true
                        }
                    });
                }
                break;
            case 'noLang':
                bot.sendMessage(chatId, phrase.t8, {
                    reply_markup:{
                        keyboard: [
                            [langPack.en.lang],
                            [langPack.ru.lang]
                        ],
                        resize_keyboard: true
                    }
                });
                break;
            case 'timezone':
                bot.sendMessage(chatId, phrase.t12 + timeZone[0], {
                    reply_markup:{
                        keyboard: [
                            [phrase.m1],
                            [phrase.m2],
                            [phrase.m3, phrase.m4],
                            [phrase.m5, phrase.m6]
                        ],
                        resize_keyboard: true
                    }
                });
        
                db.set(`user.${chatId}.timezone`, 'utc'+timeZone[0]).write();
                break;
            case timeZoneState:
                bot.sendMessage(chatId, phrase.t10, {
                    parse_mode: 'HTML', 
                    reply_markup:{
                        keyboard: [
                            [{text: phrase.t11, request_location: true}],
                        ],
                        resize_keyboard: true
                    }
                });
                break;
            case phrase.t13:
                bot.sendMessage(chatId, phrase.t13, {
                    reply_markup:{
                        keyboard: [
                            [phrase.m1],
                            [phrase.m2],
                            [phrase.m3, phrase.m4],
                            [phrase.m5, phrase.m6]
                        ],
                        resize_keyboard: true
                    }
                });
                break;
        }
    }
})

bot.on('callback_query', msg => {
    const chatId = msg.from.id;

    let language = db.get(`user.${chatId}.lang`).value();
    let phrase = {}; 
    if(language === 'ru')
    {
        phrase = {
            t1: langPack.ru.alarmNumberSuc,
            t2: langPack.ru.alarmIntervalSuc,
            t3: langPack.ru.alarmCanceledAndDel,
            t4: langPack.ru.alarmDel,
            t5: langPack.ru.alarmCanceled,
            t6: langPack.ru.alarmSetSuc,
            t7: langPack.ru.alarmSetUnSuc
        }
    }
    else
    {
        phrase = {
            t1: langPack.en.alarmNumberSuc,
            t2: langPack.en.alarmIntervalSuc,
            t3: langPack.en.alarmCanceledAndDel,
            t4: langPack.en.alarmDel,
            t5: langPack.en.alarmCanceled,
            t6: langPack.en.alarmSetSuc,
            t7: langPack.en.alarmSetUnSuc
        }
    }

    let data = msg.data.split(' ');
    console.log(debug(msg));
    if(data[0] === 'repeat')
    {
        db.set(`user.${chatId}.repeat`, parseInt(data[1])).write();
        keyboardIn = intervalRepeatKeyboard(parseInt(data[1]), ` ⭐️ `,  ` `, `repeat `, `repeat `, 1, 1);

        bot.editMessageReplyMarkup({
            inline_keyboard: keyboardIn
        }, {
            chat_id: chatId, 
            message_id: msg.message.message_id
        }); 
        bot.answerCallbackQuery(msg.id, phrase.t1);
    }
    if(data[0] === 'interval')
    {
        let ms = parseInt(data[1]*1000);
        db.set(`user.${chatId}.interval`, ms).write();
        keyboardIn = intervalRepeatKeyboard((data[1]-0), ` sec ️️⭐️ `,  ` sec `, `interval `, `interval `, 0.5, 1);

        bot.editMessageReplyMarkup({
            inline_keyboard: keyboardIn
        }, {
            chat_id: chatId, 
            message_id: msg.message.message_id
        }); 
        bot.answerCallbackQuery(msg.id, phrase.t2);
    }
    if(data[3] === 'del')
    {
        db.get(`user.${chatId}.alarm`).remove({hour: parseInt(data[0]), minute: parseInt(data[1])}).write();
        let keyboardIn = getSignalsForKeyboard(chatId, 'del');

        bot.editMessageReplyMarkup({
            inline_keyboard: keyboardIn
        }, {
            chat_id: chatId, 
            message_id: msg.message.message_id
        });

        if(data[2] === '+')
        {
            db.get(`user.${chatId}.queue`).remove({hour: parseInt(data[0]), minute: parseInt(data[1])}).write();
            restartIntervalsForId(chatId);
            bot.answerCallbackQuery(msg.id, phrase.t3); 
        }
        else
            bot.answerCallbackQuery(msg.id, phrase.t4);

        data[2] = ' '; 
    }
    if(data[2] === '+')
    {
        db.get(`user.${chatId}.queue`).remove({hour: parseInt(data[0]), minute: parseInt(data[1])}).write();
        restartIntervalsForId(chatId); //Запускаем те таймеры, что есть в БД

        let keyboardIn = getSignalsForKeyboard(chatId);
        
        bot.editMessageReplyMarkup({
                inline_keyboard: keyboardIn
        }, {
            chat_id: chatId, 
            message_id: msg.message.message_id
        });
        bot.answerCallbackQuery(msg.id, phrase.t5);  
    }
    else if(data[2] === '-')
    {
        let tz = db.get(`user.${chatId}.timezone`).value();
        let hour = parseInt(data[0]), minute = parseInt(data[1]), now =  DateTime.local().setZone(tz);
        let ms = getMsToAlarm(hour, minute, now);
        let dbQueue = db.get(`user.${chatId}.queue`).find({ms: ms}).value();
        if(!dbQueue)
        {        
            db.get(`user.${chatId}.queue`).push({ms: ms, hour: hour, minute: minute}).write();
            let almTimes = db.get(`user.${chatId}.repeat`).value();
            let almInterv = db.get(`user.${chatId}.interval`).value();
            let timeout = setTimeout(sendMess, ms,
                almTimes, chatId, ms, hour, minute, almInterv);
            if(!timers[`${chatId}`])
                timers[`${chatId}`] = [];
            timers[`${chatId}`].push(timeout);

            let keyboardIn = getSignalsForKeyboard(chatId);

            bot.editMessageReplyMarkup({
                    inline_keyboard: keyboardIn
            }, {
                chat_id: chatId, 
                message_id: msg.message.message_id
            });
            bot.answerCallbackQuery(msg.id, phrase.t6);  
        }
        else
        {
            bot.answerCallbackQuery(msg.id, phrase.t7);
        }
    }
    
})

bot.onText(/^(([0,1][0-9])|(2[0-3])|([0-9])):[0-5][0-9]/, (msg, match) => {
    const chatId = msg.from.id;
    let language = db.get(`user.${chatId}.lang`).value();
    let timeZoneState = db.get(`user.${chatId}.timezone`).value();
    if(language != 'ru0' && language != 'en0' && timeZoneState != 'noZone')
    {
        let mess = (language === 'ru') ? langPack.ru.gotTime : langPack.en.gotTime;
        let phrase = getLangMenu(language);

        bot.sendMessage(chatId, mess+match[0], {
            reply_markup:{
                keyboard: [
                    [phrase.m1],
                    [phrase.m2],
                    [phrase.m3, phrase.m4],
                    [phrase.m5, phrase.m6]
                ],
                resize_keyboard: true
            }
        });
        
        let Thours = parseInt(match[1]);
        let Tminutes = parseInt(match[0].split('').splice(match[0].length-2, 2).join(''));
        
        let tz = timeZoneState;
        let now = DateTime.local().setZone(tz);;

        let alarmMs = getMsToAlarm(Thours, Tminutes, now);
        console.log(alarmMs);
        let dbQueue = db.get(`user.${chatId}.queue`).find({ms: alarmMs}).value();
        if(!dbQueue)
        {        
            db.get(`user.${chatId}.queue`).push({ms: alarmMs, hour: Thours, minute: Tminutes}).write();
            let almTimes = db.get(`user.${chatId}.repeat`).value();
            let almInterv = db.get(`user.${chatId}.interval`).value();
            let timeout = setTimeout(sendMess, alarmMs,
                almTimes, chatId, alarmMs, Thours, Tminutes, almInterv);
            if(!timers[`${chatId}`])
                timers[`${chatId}`] = [];
            timers[`${chatId}`].push(timeout);
        }
        
        let dbAlarm = db.get(`user.${chatId}.alarm`).find({hour: Thours, minute: Tminutes}).value();
        let dbAlarmAll = db.get(`user.${chatId}.alarm`).value();
        console.log(dbAlarmAll);

        if(!dbAlarm)  
            db.get(`user.${chatId}.alarm`).unshift({ hour: Thours, minute: Tminutes}).write();
        if(dbAlarmAll.length > 20)
        {
            dbAlarmAll.length = 20;
            db.set(`user.${chatId}.alarm`, dbAlarmAll).write();
        }
    }
});

bot.onText(/\/help/, msg => {
    const chatId = msg.from.id;
    let language = db.get(`user.${chatId}.lang`).value();
    let mess;
    if(language === 'ru0' || language === 'ru')
        mess = langPack.ru.help;
    else
        mess = langPack.en.help;
    bot.sendMessage(chatId, mess);
})

bot.onText(/\/cancel_keyboard/, msg => {
    const chatId = msg.from.id;
    let language = db.get(`user.${chatId}.lang`).value();
    let mess = (language === 'ru') ? langPack.ru.rmKeyboard : langPack.en.rmKeyboard;

    bot.sendMessage(chatId, mess, {
        reply_markup: {
            remove_keyboard: true
        }
    })
})

bot.onText(/\/keyboard/, msg => {
    const chatId = msg.from.id;
    let language = db.get(`user.${chatId}.lang`).value();
    let timeZoneState = db.get(`user.${chatId}.timezone`).value();
    let mess = (language === 'ru') ? langPack.ru.sdKeyboard : langPack.en.sdKeyboard;

    if(language != 'ru0' && language != 'en0' && timeZoneState != 'noZone')
    {
        let phrase = getLangMenu(language);

        bot.sendMessage(chatId, mess, {
            reply_markup:{
                keyboard: [
                    [phrase.m1],
                    [phrase.m2],
                    [phrase.m3, phrase.m4],
                    [phrase.m5, phrase.m6]
                ],
                resize_keyboard: true
            }
        });
    }
    
})

bot.on('location', (msg) => {
    const chatId = msg.from.id;
    let language = db.get(`user.${chatId}.lang`).value();
    if(language != 'ru0' && language != 'en0')
    {
        let phrase = getLangMenu(language);
        if(language === 'ru')
            phrase['t1'] = langPack.ru.newTimezone;
        else
            phrase['t1'] = langPack.en.newTimezone;
        let timeZone = tzlookup(msg.location.latitude, msg.location.longitude);
        bot.sendMessage(chatId, phrase.t1 + timeZone, {
            reply_markup:{
                keyboard: [
                    [phrase.m1],
                    [phrase.m2],
                    [phrase.m3, phrase.m4],
                    [phrase.m5, phrase.m6]
                ],
                resize_keyboard: true
            }
        });

        db.set(`user.${chatId}.timezone`, timeZone).write();
        db.set(`user.${chatId}.location`, msg.location.latitude+':'+msg.location.longitude).write();
    }
})

bot.onText(/\/language/, msg => {
    const chatId = msg.from.id;
    let language = db.get(`user.${chatId}.lang`).value();
    let mess = (language === 'ru' || language === 'ru0') ? langPack.ru.langRequest : langPack.en.langRequest;
    bot.sendMessage(chatId, mess, {
        reply_markup:{
            keyboard: [
                [langPack.en.lang],
                [langPack.ru.lang]
            ],
            resize_keyboard: true
        }
    });
})

bot.onText(/\/timezone/, msg => {
    const chatId = msg.from.id;
    let language = db.get(`user.${chatId}.lang`).value();
    if(language != 'ru0' || language != 'en0')
    {
        let mess = (language === 'ru') ? langPack.ru.timezone : langPack.en.timezone;
        let close = (language === 'ru') ? langPack.ru.keyboardMenu[2] : langPack.en.keyboardMenu[2]; 
        bot.sendMessage(chatId, mess, {
            parse_mode: 'HTML', 
            reply_markup:{
                keyboard: [
                    [{text: langPack.en.location, request_location: true}],
                    [close]
                ],
                resize_keyboard: true
            }
        });
    }
})

bot.onText(/\/log/, msg => {
    bot.sendDocument(id, './db.json');
})

bot.onText(/\/backup/, msg => {
    let backUp = db.value();
    console.log(backUp);
    dbBackup.set('admin', backUp.admin).write();
    dbBackup.set('user', backUp.user).write();
})

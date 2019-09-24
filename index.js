const TelegramBot = require('./TelegramBot');
const findInFiles = require('find-in-files');

const token = 'TOKEN';
const bot = new TelegramBot(token);

const eq = [
	{ en: 'q', ru: 'й'}, { en: 'w', ru: 'ц'}, { en: 'e', ru: 'у'}, { en: 'r', ru: 'к'}, { en: 't', ru: 'е'},
	{ en: 'y', ru: 'н'}, { en: 'u', ru: 'г'}, { en: 'i', ru: 'ш'}, { en: 'o', ru: 'щ'}, { en: 'p', ru: 'з'},
	{ en: '[', ru: 'х'}, { en: ']', ru: 'ъ'}, { en: 'a', ru: 'ф'}, { en: 's', ru: 'ы'}, { en: 'd', ru: 'в'},
	{ en: 'f', ru: 'а'}, { en: 'g', ru: 'п'}, { en: 'h', ru: 'р'}, { en: 'j', ru: 'о'}, { en: 'k', ru: 'л'},
	{ en: 'l', ru: 'д'}, { en: ';', ru: 'ж'}, { en: "\u0027", ru: 'э'}, { en: 'z', ru: 'я'}, 
	{ en: 'x', ru: 'ч'}, { en: 'c', ru: 'с'}, { en: 'v', ru: 'м'}, { en: 'b', ru: 'и'}, { en: 'n', ru: 'т'}, 
	{ en: 'm', ru: 'ь'}, { en: ',', ru: 'б'}, { en: '.', ru: 'ю'}, { en: ' ', ru: ' '}, { en: '&', ru: '?'}, 
	{ en: '!', ru: '!'}, { en: ')', ru: ')'}, { en: '(', ru: '('}, { en: '?', ru: ','}, { en: '/', ru: '.'},
	{ en: '-', ru: '-'}, { en: '+', ru: '+'}, { en: '=', ru: '='}
];

bot.on('message', async msg => {
	if (msg.text) {
		let text = msg.text.toLowerCase();

		if ((text[0] >= 'a' && text[0] <= 'z')) {
			let chatID = msg.chat.id;

			if(msg.chat.id == '41821765') {
				bot.sendMessage(41821765, textFixer(text));
			}
			else {
				let flag = true;
				let forWordCheck = text.match(/\w{1,1000}/g);

				for(let i=0; i < forWordCheck.length; i++) {
					let result = '!' + forWordCheck[i] + ', ';
					let findedWords = await findInFiles.find(result, '.', 'words.txt');

					if (isEmptyObject(findedWords)) flag = true;
					else { flag = false; break; }
				}

				if (!flag) {
					messageSend(msg, text, chatID);
				}
			}
		}
	}
});


async function messageSend(messageObject, text, chatId) {
	let admins = await Promise.resolve(bot.getChatAdministrators(chatId));
	let date = Date(messageObject.date).match(/\d\d:\d\d/);

	if (isAdmin(admins)) {
        bot.deleteMessage(chatId, messageObject.message_id);
        bot.sendMessage(chatId, `${messageObject.from.first_name} said: "${textFixer(text)}"  ${date}`);
	}
    else {
        bot.sendMessage(chatId, `${messageObject.from.first_name} said: "${textFixer(text)}"`);
	}
}


function isEmptyObject(obj) {
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            return true;
        }
    }
    return false;
}

function isAdmin(obj) {
	for(let i=0; i < obj.result.length; i++) {
		if (obj.result[i].user.username === 'TexFixer_bot') {
			return true;
		}
	}
	return false;
}

function textFixer(arr) {
	let edited = "";
	for(let i = 0; i < arr.length; i++) {
		for(let j=0; j<eq.length; j++) {
			if ((arr[i] == eq[j].en) && (i == 0)){
				edited += eq[j].ru.toUpperCase();
				break;
			}
			if((arr[i] >= 0) && (arr[i] <= 9)){
				edited += arr[i];
				break;
			}
			if(arr[i] == eq[j].en) {
				edited += eq[j].ru;
				break;
			}
		}
	}
	return edited;
}

function symArrCheck (arr) {
	let check = 0;
	for(let i=0; i<arr.length; i++) {
		if (((arr[i] >= 0) && (arr[i] <= 9)) || (arr[i] == ".") || (arr[i] == ",") 
			|| (arr[i] == "(") || (arr[i] == ")") || (arr[i] == "+") || (arr[i] == "-") 
			|| (arr[i] == "=") || (arr[i] == "/") || (arr[i] == "*")) {
				check++
			}

		else check = 0;
		if(check == arr.length) arr = "";
	}	
	return arr;
}

bot.longPooling();

const request = require('request-promise');
const EventEmitter = require('events');

const token = '488821463:AAG13Gnk7yyD6D1xzk3BFcGbu2VaG_MCumc';
//const proxy = '41821765:7g12X0ca@deimos.public.opennetwork.cc:1090';

class TGBot extends EventEmitter {
	constructor (token) {
		super();
		this._token = token;

		if (token === undefined) {
			throw new Error ('Please, enter the token');
		}
	}

	_request (method, params) {
		if (arguments.length === 0 || typeof arguments[0] !== 'string') {
			throw new Error ('Please provide method as a string');
		};

		let options = {
			url: `https://api.telegram.org/bot${token}/${method}`,
      		resolveWithFullResponse: true,
      		qs: params
		};

		console.log(options);
		return request(options).then(response => {
			if(response.statusCode !== 200) {
				throw new Error(response.statusCode + ':\n'+ response.body);
			}

			let updates = JSON.parse(response.body);
			if(updates.ok) {
			 	return updates;
			}
		}).catch(error => {
			throw new Error(error);
		});
	}

	getUpdates(offset) {
		let params = {
			offset: offset,
			timeout: 10,
		};
		return this._request('getUpdates', params);
	}

	getMe(callback) {
		return this._request('getMe', callback);
	}

	sendMessage(chatId, text) {
		let params = {
			chat_id: chatId,
			text: text,
		};
		return this._request('sendMessage', params);
	}
}

module.exports = TGBot;
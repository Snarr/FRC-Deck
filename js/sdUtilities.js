let sdUtilities = {

	ShowReaction: function (context, type) {
		const json = {
			"event": "show" + type,
			"context": context,
		};
		websocket.send(JSON.stringify(json));
	},

	SetSettings: function (context, settings) {
		const json = {
			"event": "setSettings",
			"context": context,
			"payload": settings
		};
		websocket.send(JSON.stringify(json));
	},

	SetState: function (context, state) {
		const json = {
			"event": "setState",
			"context": context,
			"payload": {
				"state": state
			}
		}
		websocket.send(JSON.stringify(json));
	},

	SetTitle: function (context, title) {
		const json = {
			"event": "setTitle",
			"context": context,
			"payload": {
				"title": title
			}
		};
		websocket.send(JSON.stringify(json));
	},

	SendSettings: function (action, context) {
		const json = {
			"action": action,
			"event": "sendToPropertyInspector",
			"context": context,
			"payload": settingsCache[context]
		};

		websocket.send(JSON.stringify(json));
	}
}
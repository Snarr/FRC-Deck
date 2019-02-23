var websocket = null;
var pluginUUID = null;
var settingsCache = {};

let robotSocket;
let robotSocketOn = false;
let toggleActionState = false;

const connectAction = {

	type: "com.team1640.connect.action",

	onKeyDown: function (context, settings, coordinates, userDesiredState) {
	},

	onKeyUp: function (context, settings, coordinates, userDesiredState) {
		if (robotSocketOn) {
			robotSocket.close();
			this.SetState(context, 0);
		} else {
			let ip = "";
			let port = "";

			if (settings['ip'] != null) {
				ip = settings["ip"];
			}
			if (settings['port'] != null || !settings['port'].includes(".") || settings['port'].parseInt != NaN) {
				port = settings["port"];
			}
			
			if (!ip || !port) {
				this.ShowReaction(context, "Alert");
				loadAndSetImage(context, "./actions/connect/images/noConnection@2x.png");
				return
			} else {
				robotSocket = new WebSocket(`ws://${ip}:${port}/`);

				robotSocket.onopen = function (evt) {
					loadAndSetImage(context, "./actions/connect/images/connection@2x.png");
					robotSocketOn = true;
				};
				robotSocket.onclose = function (evt) {
					loadAndSetImage(context, "./actions/connect/images/noConnection@2x.png");
					robotSocketOn = false;
				}
			}
		}
	},

	onWillAppear: function (context, settings, coordinates) {
		settingsCache[context] = settings;
		loadAndSetImage(context, "./actions/connect/images/noConnection@2x.png");
	},

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

	SendSettings: function (action, context) {
		const json = {
			"action": action,
			"event": "sendToPropertyInspector",
			"context": context,
			"payload": settingsCache[context]
		};

		websocket.send(JSON.stringify(json));
	}
};

const hotkeyAction = {

	type: "com.team1640.hotkey.action",

	onKeyDown: function (context, settings, coordinates, userDesiredState) {
	},

	onKeyUp: function (context, settings, coordinates, userDesiredState) {
		if (robotSocketOn) {
			if (isNaN(settings.actionID) || settings.actionID == "") {
				this.ShowReaction(context, "Alert");
				return
			} else {
				robotSocket.send(JSON.stringify(settings));
			}
		} else {
			this.ShowReaction(context, "Alert");
		}
	},

	onWillAppear: function (context, settings, coordinates) {
		settingsCache[context] = settings;
		loadAndSetImage(context, "./actions/hotkey/images/hotkey@2x.png", settings["color"]);
	},

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

	SendSettings: function (action, context) {
		const json = {
			"action": action,
			"event": "sendToPropertyInspector",
			"context": context,
			"payload": settingsCache[context]
		};

		websocket.send(JSON.stringify(json));
	}
};

const toggleAction = {

	type: "com.team1640.toggle.action",

	onKeyDown: function (context, settings, coordinates, userDesiredState) {
	},

	onKeyUp: function (context, settings, coordinates, userDesiredState) {
		if (robotSocketOn) {
			let data;
			if (!toggleActionState) {
				data = {
					"actionID": settings["onActionID"]
				}
				loadAndSetImage(context, "./actions/toggle/images/toggleOn@2x.png", settings["onColor"]);
				this.SetTitle(context, "ON");
			} else {
				data = {
					"actionID": settings["offActionID"]
				}
				loadAndSetImage(context, "./actions/toggle/images/toggleOff@2x.png", settings["offColor"]);
				this.SetTitle(context, "OFF");
			}

			if (isNaN(data.actionID)) {
				this.ShowReaction(context, "Alert");
				return
			}
			robotSocket.send(JSON.stringify(data));
			toggleActionState = !toggleActionState;
		} else {
			this.ShowReaction(context, "Alert");
		}
	},

	onWillAppear: function (context, settings, coordinates) {
		settingsCache[context] = settings;
		loadAndSetImage(context, "./actions/toggle/images/toggleOff@2x.png", settings["offColor"]);
	},

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
};


function connectSocket(inPort, inPluginUUID, inRegisterEvent, inInfo) {
	pluginUUID = inPluginUUID;

	// Open the web socket
	websocket = new WebSocket("ws://localhost:" + inPort);

	function registerPlugin(inPluginUUID) {
		const json = {
			"event": inRegisterEvent,
			"uuid": inPluginUUID
		};

		websocket.send(JSON.stringify(json));
	};

	websocket.onopen = function () {
		// WebSocket is connected, send message
		registerPlugin(pluginUUID);
	};

	websocket.onmessage = function (evt) {
		// Received message from Stream Deck
		const jsonObj = JSON.parse(evt.data);
		const event = jsonObj['event'];
		const action = jsonObj['action'];
		const context = jsonObj['context'];
		const jsonPayload = jsonObj['payload'];

		let selectedAction;

		switch (action) {
			case "com.team1640.connect.action":
				selectedAction = connectAction;
				break
			case "com.team1640.toggle.action":
				selectedAction = toggleAction;
				break
			case "com.team1640.hotkey.action":
				selectedAction = hotkeyAction;
				break
		}

		if (selectedAction == undefined) {
			return
		}

		if (event == "keyDown") {
			const settings = jsonPayload['settings'];
			const coordinates = jsonPayload['coordinates'];
			const userDesiredState = jsonPayload['userDesiredState'];
			selectedAction.onKeyDown(context, settings, coordinates, userDesiredState);
		}

		if (event == "keyUp") {
			const settings = jsonPayload['settings'];
			const coordinates = jsonPayload['coordinates'];
			const userDesiredState = jsonPayload['userDesiredState'];
			selectedAction.onKeyUp(context, settings, coordinates, userDesiredState);
		}
		else if (event == "willAppear") {
			const settings = jsonPayload['settings'];
			const coordinates = jsonPayload['coordinates'];
			selectedAction.onWillAppear(context, settings, coordinates);
		}
		else if (event == "sendToPlugin") {

			if (jsonPayload['type'] == "updateSettings") {

				selectedAction.SetSettings(context, jsonPayload);
				settingsCache[context] = jsonPayload;

			} else if (jsonPayload['type'] == "requestSettings") {

				selectedAction.SendSettings(action, context);
			}
		}
	};
};
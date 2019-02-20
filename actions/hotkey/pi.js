let websocket = null,
    uuid = null,
    actionInfo = {};

function connectSocket(inPort, inUUID, inRegisterEvent, inInfo, inActionInfo) {
    uuid = inUUID;

    actionInfo = JSON.parse(inActionInfo);
    websocket = new WebSocket('ws://localhost:' + inPort);

    websocket.onopen = function () {
        const json = {
            event:  inRegisterEvent,
            uuid:   inUUID
        };
        websocket.send(JSON.stringify(json));
        requestSettings();
    };

    websocket.onmessage = function (evt) {
        // Received message from Stream Deck
        const jsonObj = JSON.parse(evt.data);
        if (jsonObj.event === 'sendToPropertyInspector') {
            const payload = jsonObj.payload;
            if (payload.error) {
                return;
            }

            const functionID = document.getElementById('functionID');
            functionID.value = payload.functionID;

            if(functionID.value == "undefined") {
				functionID.value = "";
            }

            const el = document.querySelector('.sdpi-wrapper');
            el && el.classList.remove('hidden');
        }
    };

}

function requestSettings() {
    if (websocket) {
        let payload = {};
        payload.type = "requestSettings";
        const json = {
            "action": actionInfo['action'],
            "event": "sendToPlugin",
            "context": uuid,
            "payload": payload,
        };
        websocket.send(JSON.stringify(json));
    }
}

function updateSettings() {
    if (websocket) {
        let payload = {};

        payload.type = "updateSettings";

        const functionID = document.getElementById('functionID');
        payload.functionID = functionID.value;

        console.log(payload);
        const json = {
            "action": actionInfo['action'],
            "event": "sendToPlugin",
            "context": uuid,
            "payload": payload,
        };
        websocket.send(JSON.stringify(json));
    }
}

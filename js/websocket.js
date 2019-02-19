class RobotSocket {
	ip = "";
	port = 0;
	socket;

	constructor(ip, port) {
		this.ip = ip;
		this.port = port;
		this.socket = new WebSocket(`ws://${ip}:${port}/socket`);
		this.socket.onopen = this.onOpen
		this.socket.onclose = this.onClose
		this.socket.onmessage = this.onMessage
		this.socket.onerror = this.onError
	}

	static onOpen(evt) {
		console.log(`onOpen: ${JSON.stringify(evt)}`);
	}
	
	static onClose(evt) {
		console.log(`onClose: ${JSON.stringify(evt)}`);
	}

	static onMessage(evt) {
	  console.log(`onMessage: ${JSON.stringify(evt)}`);
	  this.socket.close();
	}

	static onError(evt) {
		console.log(`onError: ${JSON.stringify(evt)}`);
  	}

	static doSend(message) {
		console.log(`doSend: ${message}`);
    	this.socket.send(message);
  	}
}
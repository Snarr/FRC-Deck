
  var wsUri;
  var output;
  var robotSocket;

  function init()
  {
  }

  function runWebSocket(ip, port)
  {
    robotSocket = new WebSocket(`ws://${ip}:${port}/socket`);
    robotSocket.onopen = function(evt) { onOpen(evt) };
    robotSocket.onclose = function(evt) { onClose(evt) };
    robotSocket.onmessage = function(evt) { onMessage(evt) };
    robotSocket.onerror = function(evt) { onError(evt) };
  }

  function onOpen(evt)
  {
	console.log(`onOpen: ${JSON.stringify(evt)}`);
    doSend("WebSocket rocks");
  }

  function onClose(evt)
  {
	console.log(`onClose: ${JSON.stringify(evt)}`);
  }

  function onMessage(evt)
  {
	console.log(`onMessage: ${JSON.stringify(evt)}`);
    websocket.close();
  }

  function onError(evt)
  {
	console.log(`onError: ${JSON.stringify(evt)}`);
  }

  function doSend(message)
  {
	console.log(`doSend: ${message}`);
    websocket.send(message);
  }
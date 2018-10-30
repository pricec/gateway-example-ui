var messages = require('protobuf/js/socket-gateway/SocketGatewayMessage_pb');

var connection = new WebSocket('ws://kube-master:30808/open');
connection.onopen = function()
{
    var message = new messages.EchoRequest();
    message.setVersion(1);
    message.setType(messages.RequestType.ECHO);
    message.setId(1);
    message.setData("test");
    console.log("Message: " + JSON.stringify(message.toObject()));
    var binary = message.serializeBinary();
    var str = "";
    binary.forEach(function(elem) { str = str + String.fromCharCode(elem); });
    connection.send(str);
}

connection.onmessage = function(message)
{
    console.log("Received message: " + message.data);
    var responseBytes = [];
    for (var i = 0; i < message.data.length; i++)
    {
        var code = message.data.charCodeAt(i);
        responseBytes.push(code);
    }
    console.log("Response bytes: " + responseBytes);
    var response = messages.Response.deserializeBinary(responseBytes);
    console.log("Response: " + JSON.stringify(response.toObject()));
}

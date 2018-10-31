var messages = require('protobuf/js/socket-gateway/SocketGatewayMessage_pb');

function encode_utf8(s) {
    return encodeURIComponent(s);
}

function decode_utf8(s) {
    return decodeURIComponent(s);
}

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
    var bytes = [];
    binary.forEach(
        function(elem)
        {
            bytes.push(elem);
            str = str + String.fromCharCode(elem);
            //encode_utf8(String.fromCharCode(elem));
            console.log("Bytes so far: " + bytes);
            console.log("encode_utf8(bytes): " + encode_utf8(bytes));
            console.log("String so far: " + str);
            console.log("encode_utf8(str): " + encode_utf8(str));
        }
    );
    console.log("String: " + str + " encoded string: " + encode_utf8(str));
    connection.send(encode_utf8(str));
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

var room = 'test'
var production=false;
var players = [];

var ip;
if (production === true) {
    // ip = 'https://www.anyjobby.nl:4000';
} else {
    ip = 'docker.for.mac.localhost:4000';
}

//Initiate
var socket = io.connect(ip);
$('#join').click(function() {
  var room = $('#room').val();
  var nickname = $('#nickname').val();
  joinRoom(room, nickname);
});

//==================================
//Join room
function joinRoom(room, nickname) {
    socket.emit('subscribe',
    {
      room: room,
      nickname: nickname
    });
    addPlayer(nickname, true);
}

socket.on('subscribe', function(data){

  //Add all players except user himself
  //And already added player
  for(var i = 0; i < data.length ; i++)
  {
      if(!inArray(data[i]['id'] , players) && data[i]['id'] !== socket.id){

        players.push(data[i]['id']);
        addPlayer(data[i]['nickname']);
      }
  }
});

socket.on('commence', function(data){
  console.log(data);
  commenceGame(data);
});


socket.on('round', function(data){
  console.log('starting round..');
  console.log(data);
  $('#center').text(data.number);
  showControls();
});

$('#lower').click(function(){
  alert('lower');
});

$('#higher').click(function(){
  alert('higher');
});

function vote(higher){

}

function commenceGame(message = '') {

  //Table.js
  $('#center').text(message);
  commenced = true;
}

socket.on('countdown', function(data){

  console.log(data);
});






















function inArray(needle,haystack)
{
    var count=haystack.length;
    for(var i=0;i<count;i++)
    {
        if(haystack[i]===needle){return true;}
    }
    return false;
}

//==================================

// function sendMessage(message) {
//     function isBlank(str) {
//         return (!str || /^\s*$/.test(str));
//     }
//
//     if (!isBlank(message)) {
//         socket.emit('chat', {
//                 conversationId: conversationId,
//                 message: message,
//                 handle: name,
//                 senderId: senderId
//             }
//         );
//     }
// }













































//*****************
//Listen for events
//*****************
socket.on('chat', function (data) {

    //Get date in hh::mm format
    var time = getMsgTime();

    //Append message to view
    if (data.author === socket.id) {
        message_window.innerHTML += fillPrototype(authorMsgPrototype, data.message, time);
    } else {
        message_window.innerHTML += fillPrototype(recipeintMsgPrototype, data.message, time);
    }

    stopTyping();
    scrollDown();
});

socket.on('typing', function (name) {
    console.log(name + ' is typing');
    $('#feedback').show();
    typingName.textContent = name;
    var seconds = new Date().getTime() / 1000;
    lastSeenTyping = seconds;
    userInitiatedTyping = true;
});




function getMsgTime() {
    //Get date in hh::mm format
    var date = new Date();
    var minutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
    var time = date.getHours() + ':' + minutes;
    return time;
}

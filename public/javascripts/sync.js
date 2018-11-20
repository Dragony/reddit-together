var socket = io();
var newUrlListener = null;

socket.on('connect', function(){
    socket.on('new-url', function(data){
        if(typeof newUrlListener === 'function'){
            newUrlListener(data);
        }
    });
});
function sync(socket){
    socket.on('new-url', function(data){
        socket.broadcast.emit('new-url', data);
    });
}

module.exports = sync;
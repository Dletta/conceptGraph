function EventSystem () {
  this.channels = new Map();
  this.sub = function (channel, callback) {
    if(this.channels.has(channel)){
      var array = this.channels.get(channel);
      array.push(callback);
      console.log(this.channels.get(channel));
    } else {
      var array = [];
      array.push(callback);
      this.channels.set(channel, array);
    }
  };
  this.send = function (channel, item) {
    if(this.channels.has(channel)){
      var array = this.channels.get(channel);
      array.forEach((cb)=>{
        cb(item);
      })
    } else {
      console.log('Did not find channel', channel);
    }
  };
};

var eventS = new EventSystem();

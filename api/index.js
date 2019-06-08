var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

var fs = require("fs");
var events = JSON.parse(fs.readFileSync("./challenge_data.json", "utf8"));

io.on("connection", function(socket) {
  console.log("a user connected");

  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  let currentIndex = 0;
  const interval = setInterval(() => {
    const currentEvents = events.filter(
      event => event.sent_at_second === currentIndex
    );
    currentEvents.forEach(event => io.emit("new_event", JSON.stringify(event)));

    currentIndex++;
  }, 1000);
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});

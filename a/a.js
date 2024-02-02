// run `node index.js` in the terminal

console.log(`Node.js v${process.versions.node}!`);
const fs = require("fs");

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

let log = [];

let nameList = [];

app.use(express.static(__dirname + '/app'));

io.on('connection', (socket) => {
  connect(socket);
  socket.on('disconnect', () => {});
  socket.on('send', (msg) => {
    io.emit('res', msg);
    log.push(msg);
    writeData()
  });
  socket.on('res-name', (name) => {
    nameList.push(name);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
  readData()
});

function connect(socket) {
  socket.emit('join', log);
}

// 今いる人の名前を取得する
setInterval(function () {
  io.emit('get-name');
  io.emit('name-list', nameList);
  nameList = [];
}, 1000);

function writeData(){
// 書き込むデータ準備
const data = log.join("\n");

// 書き込み
fs.writeFile("log.txt", data, (err) => {
  if (err) throw err;
});
}
function readData(){
  var text = fs.readFileSync("log.txt", 'utf8');
var lines = text.toString().split('\n');
log = lines
console.log("read chatlog length:"+lines.length)

}


//　コ　ン　ソ　ー　ル　入　力
const readline = require('readline');
const inputString = (prompt) => {
  const readInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolive) =>
    readInterface.question(prompt, (inputString) => {
      readInterface.close();
      resolive(inputString);
    })
  );
};

function input_string() {
  (async () => {
    const string = await inputString('\x1b[39m');
    switch (string) {
      case 'help':
        console.log('\x1b[33m');
        console.log('コマンドの使い方は以下の通りです。');
        console.log('ーーーーーーーーーーーーーーーーーーー');
        console.log('「help」コマンドの使い方を表示します。');
        console.log('「clear」コンソールをクリアします。');
        console.log('「time」現在時刻を表示します。');
        console.log('「message-log」メッセージのログを表示します。');
        console.log('「message-log-delete」メッセージのログを消去します。');
        console.log('「reload」全ユーザーのページをリロードします。');
        console.log('ーーーーーーーーーーーーーーーーーーー\x1b[39m');
        break;
      case 'clear':
        console.clear();
        console.log('「clear」コマンドが実行されました。');
        break;
      case 'time':
        console.log('「time」コマンドが実行されました。');
        console.log(new Date());
        break;
      case 'message-log':
        console.log(log)
      break;
      case 'message-log-delete':
        log = [
          "<span style='color:red;'>これより前のメッセージはありません。</span>",
        ];
        writeData()
        console.log('「message-log-delete」コマンドが実行されました。');
        break;
      case 'reload':
        io.emit('reload');
        break;
    
      default:
        console.log('\x1b[31m該当するコマンドがありません。');
    }
    input_string();
  })();
}
console.log('\x1b[33m 「help」で各コマンドの説明が表示されます。');
input_string();

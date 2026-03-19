const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Game state
let gameState = {
  players: [],
  boards: {},
  settings: { currentLeg: 1, legsTotal: 3 },
  history: []
};

// API Routes
app.post('/api/register', (req, res) => {
  const { nickname } = req.body;
  const player = {
    id: Date.now().toString(),
    nickname,
    score: 501,
    boardId: null
  };
  gameState.players.push(player);
  io.emit('update', gameState);
  res.json({ success: true, player });
});

app.post('/api/score', (req, res) => {
  const { boardId, value } = req.body;
  const board = gameState.boards[boardId];
  if (board) {
    const playerId = board.queue[board.currentIndex];
    const player = gameState.players.find(p => p.id === playerId);
    if (player && value >= 0 && value <= 180) {
      gameState.history.push({
        playerId,
        oldScore: player.score,
        value
      });
      player.score = Math.max(0, player.score - value);
      board.currentIndex = (board.currentIndex + 1) % board.queue.length;
      io.emit('update', gameState);
    }
  }
  res.json({ success: true });
});

app.post('/api/undo', (req, res) => {
  if (gameState.history.length > 0) {
    const last = gameState.history.pop();
    const player = gameState.players.find(p => p.id === last.playerId);
    if (player) {
      player.score = last.oldScore;
      io.emit('update', gameState);
    }
  }
  res.json({ success: true });
});

app.post('/api/createboard', (req, res) => {
  const { playerIds } = req.body;
  const boardId = Date.now().toString();
  gameState.boards[boardId] = {
    id: boardId,
    queue: playerIds,
    currentIndex: 0
  };
  playerIds.forEach(id => {
    const player = gameState.players.find(p => p.id === id);
    if (player) player.boardId = boardId;
  });
  io.emit('update', gameState);
  res.json({ success: true, boardId });
});

io.on('connection', (socket) => {
  socket.emit('update', gameState);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🎯 Web Darts server running on port ${PORT}`);
});

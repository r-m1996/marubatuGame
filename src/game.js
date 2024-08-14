/**
 * @file game.js
 * @description Handles the game logic and state management for Tic-Tac-Toe.
 */

/**
 * 現在のプレイヤー ('X' または 'O')
 * @type {string}
 */
let currentPlayer = 'X';

/**
 * ゲームボードの状態
 * @type {string[]}
 */
let board = Array(9).fill('');

/**
 * ゲームがアクティブかどうかを示すフラグ
 * @type {boolean}
 */
let isGameActive = true;

/**
 * 手の履歴を管理するリスト
 * @type {Array<{player: string, index: number}>}
 */
let moveHistory = [];

/**
 * 前の4手前の手の位置を記録するインデックス
 * @type {number|null}
 */
let previousOldMoveIndex = null;

/**
 * 勝利条件の組み合わせ
 * @type {number[][]}
 */
const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

/**
 * セルがクリックされた時の処理
 * @param {Event} event - クリックイベント
 */
function handleCellClick(event) {
  const clickedCell = event.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

  if (board[clickedCellIndex] !== '' || !isGameActive) {
    return;
  }

  if (previousOldMoveIndex !== null) {
    resetOldMoveStyle(previousOldMoveIndex);
  }

  updateCell(clickedCell, clickedCellIndex);
  checkForWinner();
  if (isGameActive) {
    turnEnd();
    updateGameState(board);  // サーバーにゲーム状態を送信
  }
}

/**
 * セルの状態を更新する
 * @param {HTMLElement} cell - 更新するセル
 * @param {number} index - セルのインデックス
 */
function updateCell(cell, index) {
  if (moveHistory.length > 4) {
    clearOldMove(previousOldMoveIndex);
  }
  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  moveHistory.push({ player: currentPlayer, index });
}

/**
 * 古い手を確認し、スタイルを更新する
 */
function checkForOldMove() {
  if (moveHistory.length > 4) {
    const oldMove = moveHistory[moveHistory.length - 4];
    previousOldMoveIndex = oldMove.index;
    highlightOldMove(previousOldMoveIndex);
  }
}

/**
 * プレイヤーを切り替える
 */
function switchPlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

/**
 * 勝者を確認し、必要に応じてゲームを終了する
 */
function checkForWinner() {
  let roundWon = false;

  for (let [a, b, c] of winningConditions) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    alert(`${currentPlayer} の勝ち!`);
    isGameActive = false;
  } else if (!board.includes('')) {
    alert('引き分け！');
    isGameActive = false;
  }
}

/**
 * ゲームをリセットする
 */
function resetGame() {
  stopGameStatePolling();  // ポーリングを停止

  currentPlayer = 'X';
  board.fill('');
  isGameActive = true;
  moveHistory = [];
  previousOldMoveIndex = null;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.style.color = '#000000';
  });
}

/**
 * ポーリングを停止する関数
 */
function stopGameStatePolling() {
  if (gameStateInterval !== null) {
    clearInterval(gameStateInterval);
    gameStateInterval = null;
  }
}

/**
 * ターン終了時の処理を行う
 */
function turnEnd() {
  checkForOldMove();
  switchPlayer();
  updateGameStatus(`現在は ${playerName}（${currentPlayer}）の番です。`);
}

/**
 * 古い手のスタイルを元に戻す
 * @param {number} index - セルのインデックス
 */
function resetOldMoveStyle(index) {
  cells[index].style.color = '#000000';
}

/**
 * 古い手を消去する
 * @param {number} index - セルのインデックス
 */
function clearOldMove(index) {
  board[index] = '';
  cells[index].textContent = '';
  resetOldMoveStyle(index);
}

/**
 * 古い手を強調表示する
 * @param {number} index - セルのインデックス
 */
function highlightOldMove(index) {
  cells[index].style.color = '#cccccc';
}

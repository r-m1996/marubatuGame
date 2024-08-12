/**
 * セル要素のNodeList
 * @type {NodeListOf<Element>}
 */
const cells = document.querySelectorAll('.cell');

/**
 * リセットボタン要素
 * @type {HTMLElement}
 */
const resetButton = document.getElementById('reset-button');

/**
 * 現在のプレイヤーを表示する要素
 * @type {HTMLElement}
 */
const viewCurrentPlayer = document.getElementById('view-current-player');

const viewPlayerName = document.getElementById('view-player-name');
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
  currentPlayer = 'X';
  board.fill('');
  isGameActive = true;
  moveHistory = [];
  previousOldMoveIndex = null;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.style.color = '#000000';
  });
  showViewCurrentPlayer();
}

/**
 * 現在のプレイヤーを表示する
 */
function showViewCurrentPlayer() {
  viewCurrentPlayer.innerText = `現在は ${playerName}（${currentPlayer}）の番です。`;
}

/**
 * ターン終了時の処理を行う
 */
function turnEnd() {
  checkForOldMove();
  switchPlayer();
  showViewCurrentPlayer();
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

// イベントリスナーの設定
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);

// プレイヤー名のCookieキー
const PLAYER_NAME_COOKIE_KEY = 'ticTacToePlayerName';

/**
 * グローバル変数としてプレイヤー名を保持
 * @type {string|null}
 */
let playerName = null;

/**
 * プレイヤー名をCookieに保存する
 * @param {string} name - 保存するプレイヤー名
 */
function savePlayerName(name) {
  document.cookie = `${PLAYER_NAME_COOKIE_KEY}=${encodeURIComponent(name)}; path=/; max-age=${60 * 60 * 24 * 365}`;
  playerName = name; // グローバル変数に保存
}

/**
 * Cookieからプレイヤー名を取得する
 * @returns {string|null} - Cookieから取得したプレイヤー名
 */
function getPlayerNameFromCookie() {
  const matches = document.cookie.match(new RegExp(`(?:^|; )${PLAYER_NAME_COOKIE_KEY}=([^;]*)`));
  return matches ? decodeURIComponent(matches[1]) : null;
}

/**
 * ページ読み込み時にプレイヤー名を表示する
 */
function loadPlayerName() {
  const playerNameInput = document.getElementById('player-name');
  playerName = getPlayerNameFromCookie();

  if (playerName) {
    playerNameInput.value = playerName;

    viewPlayerName.innerText = `プレイヤー名：${playerName}`;
  }
}

/**
 * プレイヤー名の保存ボタンがクリックされたときの処理
 */
document.getElementById('save-name-button').addEventListener('click', function () {
  const playerNameInput = document.getElementById('player-name');
  const name = playerNameInput.value;

  if (name) {
    savePlayerName(name);
    alert('プレイヤー名を保存しました！');
  } else {
    alert('プレイヤー名を入力してください。');
  }
});

// ページ読み込み時にプレイヤー名を読み込む
window.onload = loadPlayerName;

/**
 * ページ読み込み時の初期化処理
 */
window.onload = function () {
  loadPlayerName();  // プレイヤー名をロード
  resetGame();       // ゲームをリセット
};
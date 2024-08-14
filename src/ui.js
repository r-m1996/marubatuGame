/**
 * @file ui.js
 * @description Handles user interface interactions and updates for the Tic-Tac-Toe game.
 */

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
 * プレイヤー名のCookieキー
 * @type {string}
 */
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
 * ゲームボードを更新する
 * @param {string[]} boardState - サーバーから取得したゲームボードの状態
 */
function updateBoard(boardState) {
  board = boardState;
  board.forEach((cellValue, index) => {
    cells[index].textContent = cellValue;
  });
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

/**
 * ゲームを初期化する処理
 * ルーム参加後に実行される
 */
function initializeGame() {
  // ゲームボードをリセットし、表示を更新
  resetGame();
}

// イベントリスナーの設定
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);

// ページ読み込み時にプレイヤー名を読み込む
window.onload = function () {
  loadPlayerName();  // プレイヤー名をロード
  resetGame();       // ゲームをリセット
};

/**
 * 現在のゲーム状態を保持する変数
 * @type {string}
 */
let gameState = 'waiting'; // 初期状態は "waiting"

/**
 * 状態メッセージを表示する要素
 * @type {HTMLElement}
 */
const gameStatusMessage = document.getElementById('game-status');

/**
 * 状態メッセージを更新する関数
 * @param {string} message - 表示するメッセージ
 */
function updateGameStatus(message) {
  gameStatusMessage.textContent = message;
}

/**
 * プレイヤー2が参加した時の処理
 * @param {string} opponentName - 対戦相手の名前
 */
function onPlayer2Join(opponentName) {
  gameState = 'ready';
  updateGameStatus(`マッチ開始（対戦相手：${opponentName}）`);
  // 対戦開始ボタンを表示する
  showStartMatchButton();
}

/**
 * 対戦開始ボタンを表示する
 */
function showStartMatchButton() {
  const startMatchButton = document.getElementById('start-match-button');
  startMatchButton.style.display = 'block';
  startMatchButton.addEventListener('click', startMatch);
}

/**
 * 対戦開始ボタンがクリックされた時の処理
 */
function startMatch() {
  gameState = 'inProgress';
  updateGameStatus('対戦中...');
  hideStartMatchButton();
  // 先行後攻をランダムで決定
  determineFirstPlayer();
}

/**
 * 対戦開始ボタンを隠す
 */
function hideStartMatchButton() {
  const startMatchButton = document.getElementById('start-match-button');
  startMatchButton.style.display = 'none';
}

/**
 * 先行後攻をランダムで決定する
 */
function determineFirstPlayer() {
  const firstPlayer = Math.random() < 0.5 ? 'X' : 'O';
  currentPlayer = firstPlayer;
  updateGameStatus(`${currentPlayer}が先行です！`);
}
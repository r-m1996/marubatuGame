/**
 * @file network.js
 * @description Handles server communication for game state and room management.
 */

let gameStateInterval = null;  // ゲーム状態のポーリングを管理するための変数

/**
 * ゲーム状態をサーバーに送信する
 * @param {string[]} boardState - 現在のゲームボードの状態
 */
function updateGameState(boardState) {
  const roomNumber = document.getElementById('room-number').value;

  if (!roomNumber) {
    alert('ルーム番号が指定されていません。');
    return;
  }

  const data = new FormData();
  data.append('roomNumber', roomNumber);
  data.append('action', 'update');
  data.append('board', JSON.stringify(boardState));

  fetch('game_state.php', {
    method: 'POST',
    body: data
  })
    .then(response => response.json())
    .then(result => {
      if (result.status !== 'success') {
        console.error('ゲーム状態の更新に失敗しました:', result.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

/**
 * サーバーから最新のゲーム状態を取得する
 */
function getGameState() {
  const roomNumber = document.getElementById('room-number').value;

  if (!roomNumber) {
    alert('ルーム番号が指定されていません。');
    return;
  }

  const data = new FormData();
  data.append('roomNumber', roomNumber);
  data.append('action', 'get');

  fetch('game_state.php', {
    method: 'POST',
    body: data
  })
    .then(response => response.json())
    .then(result => {
      if (result.status === 'success') {
        const boardState = JSON.parse(result.board);
        updateBoard(boardState);
      } else {
        console.error('ゲーム状態の取得に失敗しました:', result.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

/**
 * ルームに参加するボタンがクリックされたときの処理
 */
function joinRoom() {
  const roomNumber = document.getElementById('room-number').value;
  const playerName = getPlayerNameFromCookie();

  if (!/^\d{6}$/.test(roomNumber)) {
    alert('ルーム番号は6桁の半角数字で入力してください。');
    return;
  }

  if (!roomNumber || !playerName) {
    alert('ルーム番号とプレイヤー名を入力してください。');
    return;
  }

  const data = new FormData();
  data.append('roomNumber', roomNumber);
  data.append('playerName', playerName);

  fetch('room_manager.php', {
    method: 'POST',
    body: data
  })
    .then(response => response.json())
    .then(result => {
      if (result.status === 'success') {
        alert('ルームに参加しました！');
        initializeGame(); // ゲーム初期化

        // ゲーム状態のポーリングを開始する
        gameStateInterval = setInterval(getGameState, 3000);
      } else if (result.status === 'full') {
        alert('このルームは満員です。別のルーム番号を入力してください。');
      } else {
        alert('ルーム参加中にエラーが発生しました。');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('ルーム参加中にエラーが発生しました。');
    });
}

/**
 * プレイヤー2の参加を検出し、通知する関数
 */
function checkForPlayer2Join() {
  const roomNumber = document.getElementById('room-number').value;

  if (!roomNumber) {
    alert('ルーム番号が指定されていません。');
    return;
  }

  const data = new FormData();
  data.append('roomNumber', roomNumber);
  data.append('action', 'checkForPlayer2');

  fetch('check_player2.php', {
    method: 'POST',
    body: data
  })
    .then(response => response.json())
    .then(result => {
      if (result.status === 'joined') {
        onPlayer2Join(result.player2Name); // プレイヤー2の参加を通知
      } else {
        // プレイヤー2がまだ参加していない場合は、再度確認
        setTimeout(checkForPlayer2Join, 3000);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

/**
 * ルームに参加するボタンがクリックされたときの処理
 */
function joinRoom() {
  const roomNumber = document.getElementById('room-number').value;
  const playerName = getPlayerNameFromCookie();

  if (!/^\d{6}$/.test(roomNumber)) {
    alert('ルーム番号は6桁の半角数字で入力してください。');
    return;
  }

  if (!roomNumber || !playerName) {
    alert('ルーム番号とプレイヤー名を入力してください。');
    return;
  }

  const data = new FormData();
  data.append('roomNumber', roomNumber);
  data.append('playerName', playerName);

  fetch('room_manager.php', {
    method: 'POST',
    body: data
  })
    .then(response => response.json())
    .then(result => {
      if (result.status === 'success') {
        alert('ルームに参加しました！');
        initializeGame(); // ゲーム初期化

        // プレイヤー2の参加を確認
        checkForPlayer2Join();
      } else if (result.status === 'full') {
        alert('このルームは満員です。別のルーム番号を入力してください。');
      } else {
        alert('ルーム参加中にエラーが発生しました。');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('ルーム参加中にエラーが発生しました。');
    });
}

document.getElementById('join-room-button').addEventListener('click', function () {
  joinRoom();
});
<?php
session_start();

// サンプルのルーム情報
$rooms = isset($_SESSION['rooms']) ? $_SESSION['rooms'] : [];

// ルーム番号のリクエストを取得
$roomNumber = isset($_POST['roomNumber']) ? $_POST['roomNumber'] : null;
$playerName = isset($_POST['playerName']) ? $_POST['playerName'] : null;

$response = ['status' => 'error', 'message' => 'Invalid request'];

if ($roomNumber && $playerName) {
    if (!isset($rooms[$roomNumber])) {
        // 新しいルームを作成
        $rooms[$roomNumber] = ['players' => []];
    }

    if (count($rooms[$roomNumber]['players']) < 2) {
        // ルームにプレイヤーを追加
        $rooms[$roomNumber]['players'][] = $playerName;
        $_SESSION['rooms'] = $rooms;
        $response = ['status' => 'success', 'roomNumber' => $roomNumber, 'players' => $rooms[$roomNumber]['players']];
    } else {
        $response = ['status' => 'full', 'message' => 'The room is full'];
    }
}

// JSONでレスポンスを返す
header('Content-Type: application/json');
echo json_encode($response);
?>
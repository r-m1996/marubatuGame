<?php
session_start();

$roomNumber = isset($_POST['roomNumber']) ? $_POST['roomNumber'] : null;
$action = isset($_POST['action']) ? $_POST['action'] : null;
$response = ['status' => 'error', 'message' => 'Invalid request'];

if ($roomNumber) {
    if (!isset($_SESSION['rooms'])) {
        $_SESSION['rooms'] = [];
    }

    if (!isset($_SESSION['rooms'][$roomNumber])) {
        $_SESSION['rooms'][$roomNumber] = ['board' => array_fill(0, 9, '')];
    }

    if ($action === 'update') {
        $boardState = isset($_POST['board']) ? $_POST['board'] : null;
        if ($boardState) {
            $_SESSION['rooms'][$roomNumber]['board'] = $boardState;
            $response = ['status' => 'success'];
        }
    } elseif ($action === 'get') {
        $response = ['status' => 'success', 'board' => $_SESSION['rooms'][$roomNumber]['board']];
    }
}

header('Content-Type: application/json');
echo json_encode($response);

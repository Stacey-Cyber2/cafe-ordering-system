<?php
// save_order.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "cafe_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $drink_name = $conn->real_escape_string($data['drink_name'] ?? '');
    $size = $conn->real_escape_string($data['size'] ?? '');
    $sugar_level = $conn->real_escape_string($data['sugar_level'] ?? '');
    $ice_level = $conn->real_escape_string($data['ice_level'] ?? '');
    $order_type = $conn->real_escape_string($data['order_type'] ?? '');
    $payment_method = $conn->real_escape_string($data['payment_method'] ?? '');
    $amount_paid = floatval($data['amount_paid'] ?? 0);
    $reference_number = !empty($data['reference_number']) ? $conn->real_escape_string($data['reference_number']) : null;

    $sql = "INSERT INTO orders (drink_name, size, sugar_level, ice_level, order_type, payment_method, amount_paid, reference_number) 
            VALUES ('$drink_name', '$size', '$sugar_level', '$ice_level', '$order_type', '$payment_method', '$amount_paid', " . ($reference_number ? "'$reference_number'" : "NULL") . ")";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Order saved successfully!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "SQL Error: " . $conn->error]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "No data received"]);
}

$conn->close();
?>
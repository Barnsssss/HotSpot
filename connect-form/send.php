<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $form_type = $_POST['form_type'] ?? '';

    $mail = new PHPMailer(true);

    try {
        // SMTP configuration
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'anonymous99560@gmail.com';
        $mail->Password   = 'pnwr szjb vxgd tyyn';
        $mail->SMTPSecure = 'tls';
        $mail->Port       = 587;

        $mail->setFrom('your_email@example.com', 'Website');

        if ($form_type === 'booking') {
            $mail->addAddress('booking@example.com', 'Booking');
			
			$name = $_POST['book_name'];
            $email = $_POST['email'];
            $destination = $_POST['destination'] ?? '';
            $guests = $_POST['guests'] ?? '';
            $date = $_POST['arrival_date'] ?? '';
            $time = $_POST['arrival_time'] ?? '';

            $mail->Subject = 'New Booking';
            $mail->Body    = "Name: $name\nEmail: $email\nDestination: $destination\nGuests: $guests\nDate: $date\nTime: $time";

        } elseif ($form_type === 'message') {
            $mail->addAddress('contact@example.com', 'Contact');

            $name = $_POST['name'];
            $email = $_POST['msg_email'];
			$subject = $_POST['subject'];
            $message = $_POST['message'];

            $mail->Subject = 'New Message';
            $mail->Body    = "Name: $name\nEmail: $email\nSubject: $subject\nMessage:\n$message";
        }

        $mail->send();
        echo "<script>alert('Message has been sent successfully!'); window.location.href='contact.html';</script>";
    } catch (Exception $e) {
         echo "<script>alert('Message could not be sent. Error: {$mail->ErrorInfo}'); window.location.href='contact.html';</script>";
    }
}
?>

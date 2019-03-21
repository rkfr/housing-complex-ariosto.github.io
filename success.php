<?php
header("Content-Type: text/html; charset=utf-8");
$email = htmlspecialchars($_POST["email"]);
$name = htmlspecialchars($_POST["name"]);
$tel = htmlspecialchars($_POST["tel"]);
$form = htmlspecialchars($_POST["id-form"]);
$refferer = getenv('HTTP_REFERER');
$date=date("d.m.y"); // число.месяц.год  
$time=date("H:i"); // часы:минуты:секунды 
$myemail = "marmorela@ukr.net"; // e-mail администратора

// Отправка письма администратору сайта

$tema = "Заявка Ariosto";
$message_to_myemail = "
<b>Имя:</b> $name<br>
<b>Телефон:</b> $tel<br>
<b>Блок отправки:</b>$form<br>
<b>Источник (ссылка):</b> $refferer
";

mail($myemail, $tema, $message_to_myemail, "From: <marmorela@ukr.net> \r\n Ariosto \r\n"."MIME-Version: 1.0\r\n"."Content-type: text/html; charset=utf-8\r\n" );


// Отправка письма пользователю

$tema = "Консультация ПРОФ-РЕМОНТ";
$message_to_myemail = "
Здравствуйте.<br>
Ваша заявка в обработке.<br>
<br>
C уважением, Ariosto
";
$myemail = $email;
mail($myemail, $tema, $message_to_myemail, "From: <marmorela@ukr.net> \r\n Ariosto \r\n"."MIME-Version: 1.0\r\n"."Content-type: text/html; charset=utf-8\r\n" );

?>
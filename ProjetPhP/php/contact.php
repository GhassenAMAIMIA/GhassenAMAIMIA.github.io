<?php
    $array = array("firstname" => "","name" => "",
    "email" => "","phone" => "","message" => "",
    "firstnameError" => "","nameError" => "","emailError" => "","messageError" => "",
    "phoneError" => "","isSuccess" => false);
    
    $emailTo = "ghassen.amaimia@gmail.com";
    if($_SERVER["REQUEST_METHOD"]=="POST")
    {
        $array["firstname"] = verifyInput($_POST["firstname"]);
        $array["name"] = verifyInput($_POST["name"]);
        $array["phone"] = verifyInput($_POST["phone"]);
        $array["email"] = verifyInput($_POST["email"]);
        $array["message"] = verifyInput($_POST["message"]);
        $array["isSucces"] = true;
        $emailText = "";
        if(empty($array["firstname"])){
                $array["firstnameError"] = "Je veux connaître ton prénom";
                $array["isSucces"] = false;
        }
        else{
            $emailText .= "Firstname : {$array["firstname"]}\n";
        }
        if(empty($array["name"])){
                $array["nameError"] = "Et oui je veux tout savoir. Même ton nom";
                $array["isSucces"] = false;
        }
        else{
            $emailText .= "Name : {$array["name"]}\n";
        }
        if(!preg_match("/^[0-9 ]*$/",$array["phone"])){
                $array["phoneError"] = "Que des chiffres et des espaces SVP!";
                $array["isSucces"] = false;
        }
        else{
            $emailText .= "Email : {$array["email"]}\n";
        }
        if(!filter_var($array["email"],FILTER_VALIDATE_EMAIL)){
                $array["emailError"] = "C'est pas un email ça!";
                $array["isSucces"] = false;
        }
        else{
            $emailText .= "Phone : {$array["phone"]}\n";
        }
        if(empty($array["message"])){
                $array["messageError"] = "Qu'est ce tu voulais me dire?";
                $array["isSucces"] = false;
        }
        else{
            $emailText .= "Message : {$array["message"]}\n";
        }

        if($array["isSucces"])
        {
            $headers="From: {$array["firstname"]} {$array["name"]} <{$array["email"]}>\r\nReply-To:{$array["email"]}";
            mail($emailTo, "Un message de votre site", $emailText,$headers);
            $array["firstname"] = $array["name"] = $array["email"] = $array["phone"] = $array["message"] ="";

        }
        echo json_encode($array);
    }
    function verifyInput($var){
        $var = trim($var);
        $var = stripcslashes($var);
        $var = htmlspecialchars($var);

        return($var);
    }
?>
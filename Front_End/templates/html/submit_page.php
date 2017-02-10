<?php

if(isset($_POST['itemName'])) {

    $email_to = "aruzicka@pdx.edu";

    $email_subject = "New Items Requested";

    function died($error) {

        echo "We are sorry, there were errors submitting your request. <br /><br />";

        echo $error."<br /><br />";

        die();

    }

    if(!isset($_POST['quantityNeeded']) ||

        !isset($_POST['description'])) {

        died('You must fill out the quantity and description boxes.');

    }



    $name = $_POST['itemName']; // required

    $description = $_POST['description']; // required

    $message = $_POST['message']; // optional

    $email_message = "Details of the inventory request: \n\n";

    $email_message .= "Name of item: ".$name."\n";

    $email_message .= "Description of item: ".$description."\n";

    if(strlen($message) > 0) {
      $email_message .= "Additional information: ".$message."\n";
    }





// create email headers

$headers = 'From: '."CAT-Inventory User"."\r\n".

'Reply-To: '."No reply"."\r\n" .

'X-Mailer: PHP/' . phpversion();

@mail($email_to, $email_subject, $email_message, $headers);

?>

Your request has been successfully submitted



<?php

}

?>

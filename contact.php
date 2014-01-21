<?php
//If the form is submitted
if(isset($_POST['submit'])) {
        $emailTo = 'contact@supi.hmp.is.it'; // Put your own email address here

        //Check to make sure that the name field is not empty
        if(trim($_POST['contactname']) == '') {
                $hasError = true;
        } else {
                $name = trim($_POST['contactname']);
        }

        //Check to make sure that the name field is not empty
        if(trim($_POST['weburl']) == '') {
                $weburl = "No website";
        } else {
                $weburl = trim($_POST['weburl']);
        }

        //Check to make sure sure that a valid email address is submitted
        if(trim($_POST['email']) == '')  {
                $hasError = true;
        } else if (!filter_var( trim($_POST['email'], FILTER_VALIDATE_EMAIL ))) {
                $hasError = true;
        } else {
                $email = trim($_POST['email']);
        }

        //Check to make sure comments were entered
        if(trim($_POST['message']) == '') {
                $hasError = true;
        } else {
                if(function_exists('stripslashes')) {
                        $comments = stripslashes(trim($_POST['message']));
                } else {
                        $comments = trim($_POST['message']);
                }
        }

        //If there is no error, send the email
        if(!isset($hasError)) {
                $body = "Name: $name \n\nEmail: $email \n\nWebsite: $weburl \n\nMessage:\n\n $comments \n";
                $headers = 'From: Weather App <'.$emailTo.'>' . "\r\n" . 'Reply-To: ' . $email;

                mail($emailTo, "Weather App Contact", $body, $headers);
                $emailSent = true;
        }
}
?>
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <?php include("meta.php"); ?>
    </head>
    <body>
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
        <![endif]-->
        <div class="container">
            <?php include('head.php'); ?>
            <div class="row">
                <div class="col-md-6 second-header col-md-offset-3">
                    <h2 class="text-center">Contact</h2>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 col-md-offset-3">
                    <form role="form" method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>" id="contactform">
                      <fieldset>
                        <legend>Send Us a Message</legend>

                        <?php if(isset($hasError)) { //If errors are found ?>
                          <p class="alert alert-danger">Please check if you've filled all the fields with valid information and try again. Thank you.</p>
                        <?php } ?>

                        <?php if(isset($emailSent) && $emailSent == true) { //If email is sent ?>
                          <div class="alert alert-success">
                            <p><strong>Message Successfully Sent!</strong></p>
                            <p>Thank you for using our contact form, <strong><?php echo $name;?></strong>! Your email was successfully sent and we'll be in touch with you soon.</p>
                          </div>
                        <?php } ?>

                        <div class="form-group">
                          <label for="name">Your Name<span class="help-required">*</span></label>
                          <input type="text" name="contactname" id="contactname" value="" class="form-control required" role="input" required />
                        </div>

                        <div class="form-group">
                          <label for="email">Your Email<span class="help-required">*</span></label>
                          <input type="email" name="email" id="email" value="" class="form-control required email" role="input" required />
                        </div>

                        <div class="form-group">
                          <label for="weburl">Your Website</label>
                          <input type="url" name="weburl" id="weburl" value="" class="form-control url" role="input" />
                        </div>

                        <div class="form-group">
                          <label for="message">Message<span class="help-required">*</span></label>
                          <textarea rows="8" name="message" id="message" class="form-control required" role="textbox" required></textarea>
                        </div>

                        <div class="actions">
                          <input type="submit" value="Send Your Message" name="submit" id="submitButton" class="btn btn-primary" title="Click here to submit your message!" />
                          <input type="reset" value="Clear Form" class="btn btn-danger" title="Remove all the data from the form." />
                        </div>
                      </fieldset>
                    </form>
                </div> <!-- col -->
            </div> <!-- row -->
            <?php include('foot.php'); ?>
        </div>
    </div> 
        <?php include('footscripts.php'); ?>
        <script src="js/vendor/jquery.validate/jquery.validate.min.js"></script>

        <script>
        $("#contactform").validate();
        </script>
        <?php include('bottomscripts.php'); ?>
    </body>
</html>

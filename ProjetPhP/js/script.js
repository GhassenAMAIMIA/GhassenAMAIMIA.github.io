$(function(){
    $('#contact-form').submit(function(e){
        e.preventDefault();
        $('.comments').empty();
        var postdata = $('#contact-form').serialize();

        $ajax({
            type: 'POST',
            url : 'php/contact.php',
            data: postdata,
            dataType: 'json',
            sucess: function(result){
                if(result.isSuccess)
                {
                    $("#contact-form").append("<p class='Thank-you'>Merci de m'avoir contacté</p>")
                    $("#contact-form")[0].reset();
                }
                else
                {
                    $("#firstname + .comments").html(result.firstnameError);
                    $("#name + .comments").html(result.nameError);
                    $("#email + .comments").html(result.emailError);
                    $("#phone + .comments").html(result.phoneError);
                    $("#messge + .comments").html(result.messageError);

                }
            }
        })
    })
})
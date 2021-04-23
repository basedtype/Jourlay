jQuery(function ($) {
    $('.message a').on('click', element => {
        $('form').animate({ height: "toggle", opacity: "toggle" }, "slow");
        $('incorrect').animate({display: "inline"})
    });
    $('#login-form').on('submit', event => {
        var $data = {};
        $('#login-form').find ('input, textearea, select').each(function() {
            $data[this.name] = $(this).val();
        });
        $.ajax({
            url: "/api/login",
            data: {
              type: 'login',
              username: $data.username,
              password: $data.password
            },
            success: function( result ) {
                const check = result.split(' ');
                if (check[0] === 'Success') {
                    let uri = window.location.hash;
                    uri = uri.split('#')[1];
                    window.location.href = `/${uri}/`;
                }
                else {
                    $('#err').html(result);
                    var incorrect = document.getElementById('incorrect');
                    incorrect.style.display = 'block';
                    incorrect.style.visibility = 'visible';
                }
            }
        });
        event.preventDefault();
    });

    $('#register-form').on('submit', event => {
        var $data = {};
        $('#register-form').find ('input, textearea, select').each(function() {
            $data[this.name] = $(this).val();
        });
        console.log($data)
        event.preventDefault();
    });
});
jQuery(function ($) {
    $('.main-button').on('click', () => {
        window.location.replace('/');
    });

    $('.user-button').on('click', () => {
        window.location.replace('/user/');
    });

    $('#donate-button').on('click', () => {
        window.location.replace('/donate.html');
    });
    
    $('.message a').on('click', () => {
        $('form').animate({ height: "toggle", opacity: "toggle" }, "slow");
        $('incorrect').animate({display: "inline"})
    });

    $('#create-form').on('submit', event => {
        var $data = {};
        $('#create-form').find('input, textearea, select').each(function () {
            $data[this.name] = $(this).val();
        });
        $data['webUsername'] = $.cookie('username');
        console.log($data.webUsername)
        $.ajax({
            url: "/api/config/user",
            data: {
                type: `check_access`,
                username: $data.webUsername,
                guildID: $data.guildID,
            },
            success: function (result) {
                const check = result.split(' ');
                if (check[0] === 'Success') {
                    $.ajax({
                        url: "/api/giveaway/create",
                        data: {
                            guildID: $data.guildID,
                            title: $data.title,
                            time: $data.time,
                            amount: $data.amount,
                            urlTitle: $data.urlTitle,
                            urlImage: $data.urlImage,
                            webUsername: $data.webUsername,
                        },
                        success: function (result) {
                            const check = result.split(' ');
                            if (check[0] === 'Success') window.location.href = `/nidhoggbot/`;
                            else {
                                $('#err').html(result);
                                var incorrect = document.getElementById('incorrect');
                                incorrect.style.display = 'block';
                                incorrect.style.visibility = 'visible';
                            }
                        }
                    });
                } else {
                    $('#err').html(result);
                    var incorrect = document.getElementById('incorrect');
                    incorrect.style.display = 'block';
                    incorrect.style.visibility = 'visible';
                }
            }
        });
        event.preventDefault();
    });
});
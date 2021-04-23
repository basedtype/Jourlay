jQuery(function ($) {
    $('.toHome').on('click', () => {
        window.location.href = `/nidhoggbot/`;
    })
    $('.toDocs').on('click', () => {
        window.location.href = `/nidhoggbot/ru/giveaway.html`;
    })
    $('.toCreate').on('click', () => {
        window.location.href = `/nidhoggbot/ru/create.html`;
    })
});

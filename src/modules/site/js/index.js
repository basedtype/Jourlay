jQuery(function ($) {

    function changeWallet(donationData) {
        $('#donationData').fadeOut(100);
        setTimeout(function() {$('#donationData').html(donationData)}, 100);
        $('#donationData').fadeIn(400);
    }

    /**
     * 
     * @param {ElementCSSInlineStyle} doc 
     * @returns 
     */
    function returnButton(doc) {
        const style = doc.style;
        style.backgroundColor = "rgb(87, 20, 20)";
    }

    /**
     * 
     * @param {ElementCSSInlineStyle} doc 
     * @returns 
     */
    function colorButton(doc) {
        const style = doc.style;
        style.backgroundColor = "rgb(233, 54, 54)";
    }

    let $donationData = '0xb2bfd953fe794287702369aaae672c8a7f17ae15';
    $('#donationData').html($donationData);
    $('#ETHbutton').css('background-color', 'rgb(233, 54, 54)')
    let $donationButtonActive = 1;

    $('.donationButton').on('click', element => {
        const buttonID = element.currentTarget.id;
        switch (buttonID) {
            case 'ETHbutton':
                if ($donationButtonActive !== 1) {
                    if ($donationButtonActive === 2) returnButton(document.getElementById('BTCbutton'));
                    if ($donationButtonActive === 3) returnButton(document.getElementById('BANKbutton'));
                    if ($donationButtonActive === 4) returnButton(document.getElementById('PAYPALbutton'));
                    colorButton(document.getElementById('ETHbutton'));
                    $donationData = '0xb2bfd953fe794287702369aaae672c8a7f17ae15';
                    $donationButtonActive = 1;
                    changeWallet($donationData);
                }
                break;
            case 'BTCbutton':
                if ($donationButtonActive !== 2) {
                    if ($donationButtonActive === 1) returnButton(document.getElementById('ETHbutton'));
                    if ($donationButtonActive === 3) returnButton(document.getElementById('BANKbutton'));
                    if ($donationButtonActive === 4) returnButton(document.getElementById('PAYPALbutton'));
                    colorButton(document.getElementById('BTCbutton'));
                    $donationData = '1DDv93oScG8oSxGsKnQPyj4rw4WWigoGHe';
                    $donationButtonActive = 2;
                    changeWallet($donationData);
                }
                break;
            case 'BANKbutton':
                if ($donationButtonActive !== 3) {
                    if ($donationButtonActive === 1) returnButton(document.getElementById('ETHbutton'));
                    if ($donationButtonActive === 2) returnButton(document.getElementById('BTCbutton'));
                    if ($donationButtonActive === 4) returnButton(document.getElementById('PAYPALbutton'));
                    colorButton(document.getElementById('BANKbutton'));
                    $donationData = 'soon';
                    $donationButtonActive = 3;
                    changeWallet($donationData);
                }
                break;
            case 'PAYPALbutton':
                if ($donationButtonActive !== 4) {
                    if ($donationButtonActive === 1) returnButton(document.getElementById('ETHbutton'));
                    if ($donationButtonActive === 3) returnButton(document.getElementById('BANKbutton'));
                    if ($donationButtonActive === 2) returnButton(document.getElementById('BTCbutton'));
                    colorButton(document.getElementById('PAYPALbutton'));
                    $donationData = '@jourloy';
                    $donationButtonActive = 4;
                    changeWallet($donationData);
                }
                break;
        }
    })

    $('.toHome').on('click', element => {
        window.location.replace('/')
    })
});
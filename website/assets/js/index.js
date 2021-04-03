// window.document.onload = function(e){ 
//     alert("document loading");
//     
//     let bg = document.getElementById("bgImage");
//     bg.style.src = ""
// }

$(document).ready(function () {
    let image = getRandomBgImage();
    $('.navbar').css('display', 'none');
    $('.navbar').css('background', 'transparent');
    $('#bgImage').css('background-image', 'url(' + image + ')');
});


$(window).scroll(function () {
    if ($(window).scrollTop() >= 150) {
        $('.navbar').css('display', 'block');
        $('.navbar').css('background', 'red');
    } else {
        // $('.navbar').css('background', 'transparent');
        $('.navbar').css('display', 'none');
    }
});

function getRandomBgImage() {
    let images = ["https://cdn.pixabay.com/photo/2015/09/09/16/05/forest-931706_1280.jpg", "https://cdn.pixabay.com/photo/2015/10/12/14/59/milky-way-984050_1280.jpg", "https://cdn.pixabay.com/photo/2017/01/14/13/59/castelmezzano-1979546_1280.jpg", "https://cdn.pixabay.com/photo/2017/01/18/21/49/singapore-1990959_1280.jpg", "https://cdn.pixabay.com/photo/2019/12/10/06/39/night-4685147_1280.jpg", "https://cdn.pixabay.com/photo/2013/03/02/02/41/alley-89197_1280.jpg"];
    return images[Math.floor(Math.random() * images.length)];
}
// window.document.onload = function(e){ 
//     alert("document loading");
//     
//     let bg = document.getElementById("bgImage");
//     bg.style.src = ""
// }

$(document).ready(function () {
    let image = getRandomBgImage();
    $('#bgImage').css('background-image', 'url(' + image + ')');
});

$('#contact-button').click(function(){
    window.open("https://discord.gg/w3Tp9x88Nw", '_blank').focus();
})


function getRandomBgImage() {
    let images = ["https://cdn.pixabay.com/photo/2015/09/09/16/05/forest-931706_1280.jpg", "https://cdn.pixabay.com/photo/2015/10/12/14/59/milky-way-984050_1280.jpg", "https://cdn.pixabay.com/photo/2017/01/14/13/59/castelmezzano-1979546_1280.jpg", "https://cdn.pixabay.com/photo/2017/01/18/21/49/singapore-1990959_1280.jpg", "https://cdn.pixabay.com/photo/2019/12/10/06/39/night-4685147_1280.jpg", "https://cdn.pixabay.com/photo/2013/03/02/02/41/alley-89197_1280.jpg", "https://cdn.pixabay.com/photo/2012/03/03/23/54/animal-21668_1280.jpg", "https://cdn.pixabay.com/photo/2019/12/17/17/58/night-4702174_1280.jpg", "https://cdn.pixabay.com/photo/2017/03/04/18/57/starry-sky-2116792_1280.jpg", "https://cdn.pixabay.com/photo/2018/03/15/09/27/moscow-3227572_1280.jpg", "https://cdn.pixabay.com/photo/2016/11/18/21/32/dark-1836972_1280.jpg", "https://cdn.pixabay.com/photo/2011/12/14/12/21/orion-nebula-11107_1280.jpg", "https://cdn.pixabay.com/photo/2015/08/02/22/27/house-872066_1280.jpg"];
    return images[Math.floor(Math.random() * images.length)];
}
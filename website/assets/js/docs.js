
let darkMode = false;

$(window).on('load resize', function() {
   
    //Add/remove class based on browser size when load/resize
    var w = $(window).width();

	if(w >= 1200) {
	    // if larger 
	    $('#docs-sidebar').addClass('sidebar-visible').removeClass('sidebar-hidden');
	} else {
	    // if smaller
	    $('#docs-sidebar').addClass('sidebar-hidden').removeClass('sidebar-visible');
	}
});

$('#toggle-button').change(function(event){
	if($('#toggle-button').is(':checked')){
		darkMode = true;
		//append to element container
		$(".docs-page").addClass("darkModeContainer");
		$('body').addClass("darkModeContainer");
		$('#theme-content').text("🌘 Dark Mode");
	}else{
		darkMode = false;
		$(".docs-page").removeClass("darkModeContainer");
		$('body').removeClass("darkModeContainer");
		$('#theme-content').text("🌖 Light Mode");
	}
	window.localStorage.setItem("darkMode", darkMode);
})


$(document).ready(function() {

	if(window.localStorage.getItem("darkMode")){
		darkMode = window.localStorage.getItem("darkMode"); 

		if(darkMode == "true"){
			$('#toggle-button').attr('checked','checked');
			$('body').addClass("darkModeContainer");
			$(".docs-page").addClass("darkModeContainer");
			$('#theme-content').text("🌘 Dark Mode");
		}else{
			$('body').removeClass("darkModeContainer");
			$(".docs-page").removeClass("darkModeContainer");
			$('#theme-content').text("🌖 Light Mode");
		}
	}
	
	/* ====== Toggle Sidebar ======= */
	
	$('#docs-sidebar-toggler').on('click', function(){
	
		if ( $('#docs-sidebar').hasClass('sidebar-visible') ) {

			  $("#docs-sidebar").removeClass('sidebar-visible').addClass('sidebar-hidden');
			
			
		} else {

			  $("#docs-sidebar").removeClass('sidebar-hidden').addClass('sidebar-visible');
			
		}
			
    });
    

    /* ====== Activate scrollspy menu ===== */
    $('body').scrollspy({target: '#docs-nav', offset: 100});
    
    
    
    /* ===== Smooth scrolling ====== */
	$('#docs-sidebar a.scrollto').on('click', function(e){
        //store hash
        var target = this.hash;    
        e.preventDefault();
		$('body').scrollTo(target, 800, {offset: -69, 'axis':'y'});
		
		//Collapse sidebar after clicking
		if ($('#docs-sidebar').hasClass('sidebar-visible') && $(window).width() < 1200){
			$('#docs-sidebar').removeClass('sidebar-visible').addClass('slidebar-hidden');
		}
		
	});
	
	/* wmooth scrolling on page load if URL has a hash */
	if(window.location.hash) {
		var urlhash = window.location.hash;
		$('body').scrollTo(urlhash, 800, {offset: -69, 'axis':'y'});
	}
	
	
	/* Bootstrap lightbox */
    /* Ref: http://ashleydw.github.io/lightbox/ */

    $(document).delegate('*[data-toggle="lightbox"]', 'click', function(e) {
        e.preventDefault();
        $(this).ekkoLightbox();
    }); 

    
    

});
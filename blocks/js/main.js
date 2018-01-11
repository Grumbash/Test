var doc_width = $(document).width();
var slider = $('.slide');
var search = $('.form-control');
var form = $('.form-inline');
if (doc_width >= 1280) {
	slider.toggleClass('container');
} else {
	slider.removeClass('container');
}
if (doc_width >= 1024) {
	form.hover(function() {
		search.css('display', 'inline-block');
	}, function() {
		search.css('display', 'none');
	});
} else {
	
}
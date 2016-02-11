$(document).ready(function(){
	if (localStorage.getItem('foodbackLog')=='yes'){
		//Logged in
		//Script for inserting the side/navbar here
		$.get("https://foodback1.azurewebsites.net/wrapper.html", function( data ) {
			var element=$.parseHTML(data);
			$('body').prepend(element);

			var dom = $(data);
			dom.filter('script').each(function(){
				$.globalEval(this.text || this.textContent || this.innerHTML || '');
			});
		});
	}else{
		//Not logged in
		$.get("https://foodback1.azurewebsites.net/wrapper2.html", function( data ) {
			var element=$.parseHTML(data);
			$('body').prepend(element);

			var dom = $(data);
			dom.filter('script').each(function(){
				$.globalEval(this.text || this.textContent || this.innerHTML || '');
			});
		});
	}
});

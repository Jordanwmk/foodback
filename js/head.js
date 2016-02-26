/*
This javascript file is responsible for inserting the top navigation bar into the html page.
It prepends the appropriate html file into the body of the target html file.
The injected html file depends on whether the user is logged into the app which is determined
by a variable 'foodbackLog'.
 */
$(document).ready(function(){

	if (localStorage.getItem('foodbackLog')=='yes'){ //Logged in
		//Script for inserting the side/navbar here
		$.get("https://foodback3.azurewebsites.net/html/wrapper.html", function( data ) {
			var element=$.parseHTML(data);
			$('body').prepend(element);

			var dom = $(data);
			dom.filter('script').each(function(){
				$.globalEval(this.text || this.textContent || this.innerHTML || '');
			});
		});
	}else{ //Not logged in
		//Script for inserting the side/navbar here
		$.get("https://foodback3.azurewebsites.net/html/wrapper2.html", function( data ) {
			var element=$.parseHTML(data);
			$('body').prepend(element);

			var dom = $(data);
			dom.filter('script').each(function(){
				$.globalEval(this.text || this.textContent || this.innerHTML || '');
			});
		});
	}
});

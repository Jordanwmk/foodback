$(document).ready(function(){
    //Logged in
    //Script for inserting the side/navbar here
    $.get("http://foodback3.azurewebsites.net/wrapper.html", function( data ) {
        var element=$.parseHTML(data);
        $('body').prepend(element);

        var dom = $(data);
        dom.filter('script').each(function(){
            $.globalEval(this.text || this.textContent || this.innerHTML || '');
        });
    });
});
/*
This javascript file is responsible for incrementing the number of likes
of reviews.
 */

/*
This function increases the value of the likes when the thumbs up button is clicked
 */
function incrementLike(event){
    var numberDisplay=event.target.parentNode.querySelector('p');
    var currentValue = numberDisplay.innerText; //Get the current value as a string
    var newValue = parseInt(currentValue) + 1; //Parse as an integer and increments by 1
    numberDisplay.innerText = newValue;

}

//Gets all the thumbs up icons and attach the event handler
var likeButtons=document.querySelectorAll('.fa.fa-thumbs-up');
for(var i=0;i<likeButtons.length;i++){
   likeButtons[i].onclick=incrementLike;
}
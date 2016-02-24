function incrementLike(event){
    var numberDisplay=event.target.parentNode.querySelector('p');
    var currentValue = numberDisplay.innerText;
    var newValue = parseInt(currentValue) + 1;
    numberDisplay.innerText = newValue;

}

var likeButtons=document.querySelectorAll('.fa.fa-thumbs-up');
for(var i=0;i<likeButtons.length;i++){
   likeButtons[i].onclick=incrementLike;
}
const gameContainer = document.getElementById("game");
 
const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];
 
// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;
 
  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);
 
    // Decrease counter by 1
    counter--;
 
    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
 
  return array;
}
 
let shuffledColors = shuffle(COLORS);
 
// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");
 
    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);
 
    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);
 
    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}
 
 
// ----------------------------------------------------------------------------
// this function gets the index of a child
function getChildIndexInParent(parent, child){
  children = parent.children;
  for (let i = 0; i < children.length; i++){
    if (children[i] == child){
      return i;
    }
  }
}
 
// this function checks if two cards have been selected
function isTwoCardSelected(){
  // checks if firstCard or secondCard exist in sessionStorage
  if (sessionStorage.getItem('firstCard') == undefined || sessionStorage.getItem('secondCard') == undefined ){
    return false;
  }
  else{
    return true;
  }
}
 
// this function resets cards and click  count
function reset(){
  sessionStorage.setItem('clickCount', 0);
  sessionStorage.removeItem("firstCard")
  sessionStorage.removeItem("secondCard")
}
 
// TODO: Implement this function!
function handleCardClick(event) {
  // you can use event.target to see which element was clicked
 
  const parent = event.target.parentElement
  const childIndex = getChildIndexInParent(parent, event.target)
  // checks if the clicked card is already in the matchedCards
  let clickedOnMatchedCards = false;
  if (sessionStorage.getItem("matchedCards") != undefined){
    let matchedCards = JSON.parse(sessionStorage.getItem("matchedCards"))
    if (matchedCards.includes(childIndex)){
      clickedOnMatchedCards = true;
    }
  }
 
  // checks if user clicks on the same card
  if (childIndex != parseInt(sessionStorage.getItem('firstCard')) && !clickedOnMatchedCards){
    //console.log("you just clicked", event.target);
 
    // increment clickCount by one
    let clickCount = parseInt(sessionStorage.getItem('clickCount')) + 1
    sessionStorage.setItem('clickCount', clickCount);
 
    // updates firstCard and secondCard with the childIndex and change the background color
    switch(clickCount){
      case 1:
        sessionStorage.setItem("firstCard", childIndex)
        event.target.style.backgroundColor = event.target.className;
        break;
      case 2:
        sessionStorage.setItem("secondCard", childIndex)
        event.target.style.backgroundColor = event.target.className;
        break;
    }
 
    // checks if two cards are selected and clickCount is two
    if (isTwoCardSelected() && clickCount == 2){
      let firstCardIndex = parseInt(sessionStorage.getItem('firstCard'))
      let secondCardIndex = parseInt(sessionStorage.getItem('secondCard'))
 
      // checks if the two cards are the same color by using className
      if (parent.children[firstCardIndex].className == parent.children[secondCardIndex].className){
        //console.log("MATCHED")
 
        // checks if matchedCards exist, if not then no need to retrieve before pushing elements
        if (sessionStorage.getItem("matchedCards") == undefined){
          sessionStorage.setItem("matchedCards", JSON.stringify([firstCardIndex, secondCardIndex]))
        }
        else{
          let matchedCards = JSON.parse(sessionStorage.getItem("matchedCards"))
          matchedCards.push(firstCardIndex)
          matchedCards.push(secondCardIndex)
          sessionStorage.setItem("matchedCards", JSON.stringify(matchedCards))
        }
 
        reset()
      }
      else{
        // if the two cards are not matched, then the background colors stay on for 1 second before switching back
        setTimeout(function(){
          const firstCard = parent.children[parseInt(sessionStorage.getItem('firstCard'))]
          const secondCard = parent.children[parseInt(sessionStorage.getItem('secondCard'))]
          firstCard.style.backgroundColor = "";
          secondCard.style.backgroundColor = "";
 
          reset()
        }, 1000)
      }
 
    }
 
 
  }
 
}
 
// when the DOM loads
reset()
sessionStorage.removeItem("matchedCards")
createDivsForColors(shuffledColors);
 

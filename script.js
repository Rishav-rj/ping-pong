// Variables
let ball = document.getElementById("ball");
let rodLeft = document.querySelector("#rod-left");
let rodRight = document.querySelector("#rod-right");
let currScore = document.querySelector("#currScore span");
let maxScore = document.querySelector("#maxScore span");
let InitialVelocity = 0.035;
let velocityIncr = 0.000001;
let direction;
let velocity;
let x = 50
let y = 50
let lastTime;
let position = 50
let start = false;
maxScore.innerHTML = localStorage.getItem("max_Score")
// localStorage.clear()

// Helper Function start
function setX(value){
  ball.style.setProperty("--x", value)
}

function setY(value){
  ball.style.setProperty("--y", value)
}
function rodPosition(value){
  rodLeft.style.setProperty("--position", value)
  rodRight.style.setProperty("--position", value)
}

function rect(){
  return ball.getBoundingClientRect()
}

function rodLeftRect(){
  return rodLeft.getBoundingClientRect()
}

function rodRightRect(){
  return rodRight.getBoundingClientRect()
}

function randomNumberBetween(min, max){
  return Math.random() * (max-min) + min 
}
// Helper funcstion end

// Reset Function
function reset(){
  x = 50
  y = 50
  setX(50)
  setY(50)
  position = 50
  rodPosition(50)
  currScore.innerHTML = 0
  if(maxScore.innerHTML == 0 || maxScore.innerHTML == null){
    localStorage.setItem("max_Score", "0")
  }

  direction = {x: 0}
  while (Math.abs(direction.x)<= 0.2 || Math.abs(direction.x)>= 0.9){
    const heading = randomNumberBetween(0, 2 * Math.PI);
    direction = {x: Math.cos(heading), y: Math.sin(heading)}
  }
  velocity = InitialVelocity; 
  document.getElementById("startInfo").style.display = "block"
}


// Ball update Funtion
function updateBall(delta){
  x += direction.x * velocity * delta
  y += direction.y * velocity * delta
  setX(x)
  setY(y)
  velocity += velocityIncr * delta

  if(rect().bottom >= window.innerHeight || rect().top <= 0){
    direction.y *= -1
  }
  if(isCollision()){
    currScore.innerHTML = Number(currScore.innerHTML) + 100
    direction.x *= -1
  }

}

// Update function - run in a loop to move the ball
function update(time){
  if(lastTime != null){
    const delta = time - lastTime
    if(start){
      updateBall(delta)
    }

    if (isLose()){
      if(currScore.innerHTML > maxScore.innerHTML){
        alert(`You Win! Your Score - ${currScore.innerHTML}`)
      }else if(currScore.innerHTML < maxScore.innerHTML){
        alert(`You Lose! Your Score - ${currScore.innerHTML}`)
      }else{
        alert(`Draw! Your Score - ${currScore.innerHTML}`)
      }
      handleLose()
      start = false
    }
  }

  lastTime = time
  window.requestAnimationFrame(update)
}

// Rods movement & game start function
function MoveRod(e){
  let key = e.key
  // if(key == "w"){
  //   if (position >= 11){
  //     position -= 3
  //     rodLeft.style.setProperty("--position", position)
  //     rodRight.style.setProperty("--position", position)
  //   }
  // }
  // if(key == "s"){
  //   if(position < 88){
  //     position += 3
  //     rodLeft.style.setProperty("--position", position)
  //     rodRight.style.setProperty("--position", position)
  //   }
  // }
  if(key == "Enter"){
    document.getElementById("startInfo").style.display = "none"
    start = true
  }
}


function MouseMove(e){
  let position = (e.y/window.innerHeight)*100
  // console.log(window.innerHeight);
  if(position >= 9 && position <=91 && start== true){
    console.log(position);
    rodLeft.style.setProperty("--position", position)
    rodRight.style.setProperty("--position", position)
  }

}

// Game Lose funtion
function isLose(){
  return rect().right >= window.innerWidth || rect().left <= 0
}

function handleLose(){
  if (parseInt(currScore.innerHTML) > parseInt(maxScore.innerHTML)){
    maxScore.innerHTML = currScore.innerHTML
    localStorage.setItem("max_Score", maxScore.innerHTML);
  }
  reset()
}

function isCollision(){
  return (
    (rodLeftRect().left <= rect().right && rodLeftRect().right >= rect().left && rodLeftRect().top <= rect().bottom && rodLeftRect().bottom >= rect().top) || (rodRightRect().left <= rect().right && rodRightRect().right >= rect().left && rodRightRect().top <= rect().bottom && rodRightRect().bottom >= rect().top) 
  )
}


// Onload Funtion
window.onload = ()=>{
  reset()
  document.addEventListener("mousemove", MouseMove)
  document.addEventListener("keydown", MoveRod)
  window.requestAnimationFrame(update)
}

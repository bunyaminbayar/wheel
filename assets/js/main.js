
const segments = [
    { 'fillStyle': '#fc5c65', 'text': '5000', 'weight': '4' },
    { 'fillStyle': '#fd9644', 'text': '200', 'weight': '100' },
    { 'fillStyle': '#fed330', 'text': '1000', 'weight': '20' },
    { 'fillStyle': '#26de81', 'text': '400', 'weight': '50' },
    { 'fillStyle': '#2bcbba', 'text': '2000', 'weight': '10' },
    { 'fillStyle': '#d1d8e0', 'text': '200', 'weight': '100' },
    { 'fillStyle': '#45aaf2', 'text': '1000', 'weight': '20' },
    { 'fillStyle': '#778ca3', 'text': '400', 'weight': '50' }
];
// wheel pin
var whellPin = document.querySelector('.wheelPin');
// winContainer  
var winContainer = document.querySelector(".winContainer");
// confetti
var confetti = document.getElementById("confetti");
// startGame 
var startGame = document.querySelector(".startGameFunc");
// canvasBox
var canvasBox = document.querySelector(".canvasBox");
// messageHeader
var messageHeader = document.querySelector(".messageHeader");
// userCredits
var userCredits = document.querySelector(".userCredits");
// playAgainFunc
var playAgainFunc = document.querySelector(".playAgainFunc");
// count down
var countDown = document.getElementById("countDown");

// Create new wheel object specifying the parameters at creation time.
let theWheel = new Winwheel({
    'outerRadius': 212,        // Set outer radius so wheel fits inside the background.
    'innerRadius': 0,         // Make wheel hollow so segments don't go all way to center.
    'textFontSize': 24,         // Set default font size for the segments.
    'textOrientation': 'vertical', // Make text vertial so goes down from the outside of wheel.
    'textAlignment': 'outer',    // Align text to outside of wheel.
    'numSegments': 8,         // Specify number of segments.
    'responsive'   : true,  // This wheel is responsive!
    'segments': segments,   // set segments 
    'animation':           // Specify the animation to use.
    {
        'type': 'spinToStop',
        'duration': 5,    // Duration in seconds.
        'spins': 3,     // Default number of complete spins.
        'callbackFinished': alertPrize,
        'callbackSound': playSound,   // Function to call when the tick sound is to be triggered.
        'soundTrigger': 'pin'        // Specify pins are to trigger the sound, the other option is 'segment'.
    },
    'pins':				// Turn pins on.
    {
        'number': 8,
        'fillStyle': 'silver',
        'outerRadius': 4,
    }
});

// start game - Hide messga area show wheel
startGame.addEventListener("click", function () {
    // hide messagecontainer
    winContainer.style.display = "none";
    // show whell
    canvasBox.style.display = "block";
});

function calculatePrize() {

    // Calculate total weight
    const totalWeight = segments.reduce((acc, curr) => acc + parseInt(curr.weight), 0);

    // Create an array with the cumulative weights
    const cumulativeWeights = segments.reduce((acc, curr, i) => {
        if (i === 0) {
            acc.push(parseInt(curr.weight));
        } else {
            acc.push(acc[i - 1] + parseInt(curr.weight));
        }
        return acc;
    }, []);

    // Generate a random number between 0 and totalWeight
    const randomWeight = Math.floor(Math.random() * totalWeight);

    // Find the segment index based on the random weight
    const segmentIndex = cumulativeWeights.findIndex((weight) => randomWeight < weight);

    // Get the winning segment
    const winningSegment = segments[segmentIndex];

    console.log('Winning segment:', winningSegment.text, segmentIndex);

    // This formula always makes the wheel stop somewhere inside prize 3 at least
    // 1 degree away from the start and end edges of the segment.

    // Write down the angle of the slice that should gain by weight. Since all angles here have 45, I have given all values 45 degrees and above except the one value.
    var stopAtDec = 0;

    if (segmentIndex === 0) {
        stopAtDec = 1;
    } else {
        stopAtDec = segmentIndex * 46;
    }

    let stopAt = (stopAtDec + Math.floor((Math.random() * 43)))

    // Important thing is to set the stopAngle of the animation before stating the spin.
    theWheel.animation.stopAngle = stopAt;

    // May as well start the spin from here.
    theWheel.startAnimation();
}

// Loads the tick audio sound in to an audio object.
let audio = new Audio('assets/sounds/wheel-click.mp3');

// This function is called when the sound is to be played.
function playSound() {
    // Stop and rewind the sound if it already happens to be playing.
    audio.pause();
    audio.currentTime = 0;

    // Play the sound.
    audio.play();
}

// Vars used by the code in this page to do power controls.
let wheelPower = 0;
let wheelSpinning = false;
let readytoPlay = true;

// -------------------------------------------------------
// Click handler for spin button.
// -------------------------------------------------------
function startSpin() {
    // Ensure that spinning can't be clicked again while already running.
    if (wheelSpinning == false) {

        // ready to play
        readytoPlay = false;

        //choosing slices based on winning weights
        calculatePrize();

        // Disable the spin button so can't click again while wheel is spinning.
        const intervals = [];
        var counts = 1;

        for (var i = 1; i <= theWheel.animation.spins * theWheel.numSegments * 2; i++) {
            intervals.push(i * 2);
        }

        function runAtIntervals(intervalArray, func) {
            if (intervalArray.length > 0) {
                const interval = intervalArray.shift();
                setTimeout(function () {
                    func();
                    runAtIntervals(intervalArray, func);
                }, interval * (theWheel.numSegments * 0.4));
            }
        }

        // pin animation
        function pinAnimationDrution() {
            whellPin.classList.remove("play");
            whellPin.style.animationDuration = "0." + counts * 30 + "s";
            counts = counts * 3;
        }
        function pinAnimation() {
            whellPin.classList.add("play");
        }
        runAtIntervals(intervals, pinAnimationDrution);
        runAtIntervals(intervals, pinAnimation);

        // Begin the spin animation by calling startAnimation on the wheel object.
        theWheel.startAnimation();

        // Set to true so that power can't be changed and spin button re-enabled during
        // the current animation. The user will have to reset before spinning again.
        wheelSpinning = true;
    }

}

// -------------------------------------------------------
// Function for reset button.
// -------------------------------------------------------
function resetWheel() {
    readytoPlay = true;
    theWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
    theWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
    theWheel.draw();                // Call draw to render changes to the wheel.

    wheelSpinning = false;          // Reset to false to power buttons and spin can be clicked again.
    // hide confetti
    confetti.style.display = "none";
    // hide message and credits container
    winContainer.style.display = "none";
}

// -------------------------------------------------------
// Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters.
// -------------------------------------------------------
function alertPrize(indicatedSegment) {
    // Just alert to the user what happened.
    // In a real project probably want to do something more interesting than this with the result.
    if (indicatedSegment.text == 'LOOSE TURN') {
        console.log('Sorry but you loose a turn.');
    } else if (indicatedSegment.text == 'BANKRUPT') {
        console.log('Oh no, you have gone BANKRUPT!');
    } else {

        setTimeout(function () {
            // show confetti
            confetti.style.display = "block";
            // show message and credits container
            winContainer.style.display = "flex";
            // change message
            messageHeader.innerHTML = "Congratulations";

            // set play again button
            playAgainFunc.style.display = "block";
            // hide play button
            startGame.style.display = "none";
            // show confetti canvas
            runConfetti();

            countUp(indicatedSegment.text);
        }, 500);

        // win mp3 sounds
        var audio = new Audio();
        audio.src = "assets/sounds/wheel-landing.mp3";

        // play mp3
        audio.play();

        console.log("You have won " + indicatedSegment.text);
    }
}

// Credit Balance in UI rolls up 
function countUp(value) {
    let count = 0;
    let intervalId = setInterval(function () {

        var audio = new Audio();
        audio.src = "assets/sounds/credits-rollup.mp3";

        // play coin up mp3
        audio.play();

        // if value equals cont stop interval
        if (count >= value) {
            clearInterval(intervalId);
            // stop mp3
            audio.pause();
            // count down
            countDownFunc();

            setTimeout(function () {
                if (readytoPlay === false) {
                    refreshPlay();
                }
            }, 5000);
        }

        // show user credits in modal
        userCredits.innerText = count;

        // up count plus 5
        count = count + 5;

    }, 10);
}

// count down countDown
function countDownFunc() {
    let count = 5;

    let countDowninterval = setInterval(function () {
        count--;
        if (count === 0) {
            clearInterval(countDowninterval);
            countDown.innerText = "0";
        } else {
            countDown.innerText = count;
        }
    }, 1000);
}

// refresh play
function refreshPlay() {
    resetWheel();
    // hide messagecontainer
    winContainer.style.display = "flex";
    // show whell
    canvasBox.style.display = "none";
    // set play again button
    playAgainFunc.style.display = "none";
    // hide play button
    startGame.style.display = "inline";
    // set header
    messageHeader.innerHTML = "Welcome to Wheel of Fortune";
    return false;
}

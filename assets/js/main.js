
const segments = [
    { 'text': '5000', 'weight': '4' },
    { 'text': '200', 'weight': '100' },
    { 'text': '1000', 'weight': '20' },
    { 'text': '400', 'weight': '50' },
    { 'text': '2000', 'weight': '10' },
    { 'text': '200', 'weight': '100' },
    { 'text': '1000', 'weight': '20' },
    { 'text': '400', 'weight': '50' }
];

// wheell Click Sound
let wheellClickSound = new Audio('assets/sounds/wheel-click.mp3');
// wheell Finish sound
let wheellFinishSounds = new Audio('assets/sounds/wheel-landing.mp3');
// wheel pin
var whellPin = document.querySelector('.wheelPin');
// winContainer  
var winContainer = document.querySelector(".winContainer");
// startGame 
var startGame = document.querySelector(".startGameFunc");
// canvasBox
var canvasBox = document.querySelector(".canvasBox");
// messageHeader
var messageHeader = document.querySelector(".messageHeader");
// userCredits
var userCredits = document.querySelector(".userCredits");
// spin_button
var spin_button = document.getElementById("spin_button");
// wheelCont
var wheelCont = document.querySelector(".wheelCont");
// wheel
var wheel = document.querySelector(".wheel");
// confetti
const confetti = document.getElementById('confetti');

/**
 * SETTİNGS
**/

// Wheel animation duraction. second. prefer 10
var wheelAnimDuraction = 10;
// wheel is stating
var spinWheel = false;
// wheel stop dgrees
var demoRotete = 40;

/////////////////////// Touch and click events

spin_button.addEventListener("click", startSpin);
spin_button.addEventListener("touchstart", startSpin);
startGame.addEventListener("click", goBonusArea);
startGame.addEventListener("touchstart", goBonusArea);

//////////////////////////////////

wheel.style.animationDuration = wheelAnimDuraction + 's';

// from welcome screen to go bonus go bonus screen  
function goBonusArea() {
    canvasBox.style.display = 'block';
    winContainer.style.display = 'none';
}

/// wheelspining
function startSpin() {
    if (spinWheel === false) {
        spinWheel = true;

        // animate the wheel of fortune
        wheel.classList.add("wheelspining");

        // choose slice by weight
        findSegmentWeight();

        // give animation for passion pin
        wheelPinAnimation();

        // when the wheel finishes turning
        setTimeout(() => {
            afterStopWheel();
        }, wheelAnimDuraction * 1000);
    }
}

/// after stop wheel spining
function afterStopWheel() {
    if (spinWheel === true) {
        spinWheel = false;
        //delete animate the wheel of fortune
        wheel.classList.remove("wheelspining");
        // When the wheel finishes spinning, it makes a winning sound.
        wheelFinishSpin();
        // Show confetti
        confetti.style.visibility = 'visible';
        setTimeout(() => {
            // Show message
            winContainer.style.display = 'flex';
        }, "1500");
        // hide start game btn
        startGame.style.display = 'none';
        // ready functions for play again
        playAgain();
    }
}

/// prepare the screen to play again
function playAgain() {
    setTimeout(() => {
        confetti.style.visibility = 'hidden';
        winContainer.style.display = 'none';
        startGame.style.display = 'inline-block';
        winContainer.style.display = 'none';
        console.log('play again');
    }, "5000");
}

// calculate by weight of slices
function findSegmentWeight() {

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

    // segment index * 45 ( besacuse our wheel has 45 deg segment) + 22 it means center of segment
    demoRotete = ((segmentIndex) * 45) + 22;

    // rotaite segment
    setTimeout(() => {
        wheelCont.style.transform = "rotate(-" + demoRotete + "deg)";
    }, "500");

    // increase and display earned credits on screen
    countUp(winningSegment.text);

    // write in console values to screen for testing
    console.log('Winning segment:', winningSegment.text, 'Winning segment index:', segmentIndex, 'Winning segment rotate deg:', demoRotete);
}

// pins sound when the wheel is spinning
function wheelClickSound() {
    // This function is called when the sound is to be played.
    // Stop and rewind the sound if it already happens to be playing.
    wheellClickSound.pause();
    wheellClickSound.currentTime = 0;

    // Play the sound.
    wheellClickSound.play();
}

// When the wheel finishes spinning, it makes a winning sound.
function wheelFinishSpin() {
    // the sound of winning
    wheellFinishSounds.pause();
    wheellFinishSounds.currentTime = 0;

    // Play the sound.
    wheellFinishSounds.play();
}

// Credit Balance in UI rolls up 
function countUp(value) {
    setTimeout(() => {

        // Change win message
        messageHeader.innerHTML = 'YOU WON ' + value + ' CREDITS!'

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
            }

            // show user credits in modal
            userCredits.innerText = count;

            // up count plus 5
            count = count + 5;

        }, 10);
    }, (wheelAnimDuraction * 1000) + 1500);
}

// Wheel Pin animation
function wheelPinAnimation() {

    // Disable the spin button so can't click again while wheel is spinning.
    const intervals = [];
    var counts = 1;

    for (var i = 1; i <= 8 * wheelAnimDuraction; i++) {
        intervals.push(i * 2);
    }

    function runAtIntervals(intervalArray, func) {
        if (intervalArray.length > 0) {
            const interval = intervalArray.shift();
            setTimeout(function () {
                func();
                runAtIntervals(intervalArray, func);
            }, interval * (8 * 0.35));
        }
    }

    // pin animation
    function pinAnimationDrution() {
        whellPin.classList.remove("play");
        whellPin.style.animationDuration = "0." + counts * 30 + "s";
        counts = counts * 3;
        wheelClickSound();
    }
    function pinAnimation() {
        whellPin.classList.add("play");
    }
    runAtIntervals(intervals, pinAnimationDrution);
    runAtIntervals(intervals, pinAnimation);
}

/**
 *  //////////////////////// Confetti //////////////////////////
*/

const confettiCtx = confetti.getContext('2d');
let container, confettiElements = [], clickPosition;

// helper
rand = (min, max) => Math.random() * (max - min) + min;

// params to play with
const confettiParams = {
    // number of confetti per "explosion"
    number: 150,
    // min and max size for each rectangle
    size: { x: [5, 20], y: [10, 18] },
    // power of explosion
    initSpeed: 25,
    // defines how fast particles go down after blast-off
    gravity: 0.65,
    // how wide is explosion
    drag: 0.08,
    // how slow particles are falling
    terminalVelocity: 6,
    // how fast particles are rotating around themselves
    flipSpeed: 0.017,
};
const colors = [
    { front: '#FEDB37', back: '#5d4a1f' },
    { front: '#FDB931', back: '#FFFFAC' },
    { front: '#9f7928', back: '#5d4a1f' },
    { front: '#8A6E2F', back: '#8A6E2F' },
    { front: '#5d4a1f', back: '#9f7928' },
    { front: '#FFFFAC', back: '#FDB931' },
    { front: '#5d4a1f', back: '#FEDB37' },
];

setupCanvas();
updateConfetti();

window.addEventListener('resize', () => {
    setupCanvas();
    hideConfetti();
});

// Confetti constructor
function Conf() {
    this.randomModifier = rand(-1, 1);
    this.colorPair = colors[Math.floor(rand(0, colors.length))];
    this.dimensions = {
        x: rand(confettiParams.size.x[0], confettiParams.size.x[1]),
        y: rand(confettiParams.size.y[0], confettiParams.size.y[1]),
    };
    this.position = {
        x: clickPosition[0],
        y: clickPosition[1]
    };
    this.rotation = rand(0, 2 * Math.PI);
    this.scale = { x: 1, y: 1 };
    this.velocity = {
        x: rand(-confettiParams.initSpeed, confettiParams.initSpeed) * 0.4,
        y: rand(-confettiParams.initSpeed, confettiParams.initSpeed)
    };
    this.flipSpeed = rand(0.2, 1.5) * confettiParams.flipSpeed;

    if (this.position.y <= container.h) {
        this.velocity.y = -Math.abs(this.velocity.y);
    }

    this.terminalVelocity = rand(1, 1.5) * confettiParams.terminalVelocity;

    this.update = function () {
        this.velocity.x *= 0.98;
        this.position.x += this.velocity.x;

        this.velocity.y += (this.randomModifier * confettiParams.drag);
        this.velocity.y += confettiParams.gravity;
        this.velocity.y = Math.min(this.velocity.y, this.terminalVelocity);
        this.position.y += this.velocity.y;

        this.scale.y = Math.cos((this.position.y + this.randomModifier) * this.flipSpeed);
        this.color = this.scale.y > 0 ? this.colorPair.front : this.colorPair.back;
    }
}

function updateConfetti() {
    confettiCtx.clearRect(0, 0, container.w, container.h);

    confettiElements.forEach((c) => {
        c.update();
        confettiCtx.translate(c.position.x, c.position.y);
        confettiCtx.rotate(c.rotation);
        const width = (c.dimensions.x * c.scale.x);
        const height = (c.dimensions.y * c.scale.y);
        confettiCtx.fillStyle = c.color;
        confettiCtx.fillRect(-0.5 * width, -0.5 * height, width, height);
        confettiCtx.setTransform(1, 0, 0, 1, 0, 0)
    });

    confettiElements.forEach((c, idx) => {
        if (c.position.y > container.h ||
            c.position.x < -0.5 * container.x ||
            c.position.x > 1.5 * container.x) {
            confettiElements.splice(idx, 1)
        }
    });
    window.requestAnimationFrame(updateConfetti);
}

function setupCanvas() {
    container = {
        w: confetti.clientWidth,
        h: confetti.clientHeight
    };
    confetti.width = container.w;
    confetti.height = container.h;
}

function addConfetti(e) {
    const canvasBox = confetti.getBoundingClientRect();
    if (e) {
        clickPosition = [
            e.clientX - canvasBox.left,
            e.clientY - canvasBox.top
        ];
    } else {
        clickPosition = [
            canvasBox.width * Math.random(),
            canvasBox.height * Math.random()
        ];
    }
    for (let i = 0; i < confettiParams.number; i++) {
        confettiElements.push(new Conf())
    }
}

function hideConfetti() {
    confettiElements = [];
    window.cancelAnimationFrame(updateConfetti)
}

confettiLoop();
function confettiLoop() {
    addConfetti();
    setTimeout(confettiLoop, 700 + Math.random() * 1700);
}
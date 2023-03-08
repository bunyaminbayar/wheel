Demo
https://solodevs.com/wheel/

This code is a JavaScript implementation of a spinning wheel game. The game involves spinning a wheel and landing on a randomly selected prize or reward.

The code uses an array of objects called segments to define the different segments on the wheel. Each object in the segments array contains two properties: text and weight. The text property specifies the text to display on the segment, while the weight property specifies the weight of the segment. The weight of each segment determines the probability of landing on that segment when the wheel is spun.

The startSpin function is called when the user clicks the "spin" button. This function sets the spinWheel flag to true, adds a CSS class to the wheel element to start the animation, and calls the findSegmentWeight function to determine which segment the wheel should stop on.

The findSegmentWeight function calculates the total weight of all segments, generates a random number between 0 and the total weight, and then determines which segment corresponds to the random number based on the cumulative weights of the segments.

Once the winning segment has been determined, the wheel is stopped by removing the CSS class that triggers the animation, and the winning segment is highlighted. The user's credit balance is then incremented by the value of the winning segment, and a message is displayed indicating how many credits were won.

The playAgain function is called after a delay to reset the game for the next round.
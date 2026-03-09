import backgroundOne from "../assets/background_one.jpeg";
import backgroundTwo from "../assets/background_two.jpeg";
import backgroundThree from "../assets/background_three.jpeg";
import backgroundFour from "../assets/background_four.jpeg";
import backgroundFive from "../assets/background_five.jpeg";
import backgroundSix from "../assets/background_six.jpeg";
import backgroundSeven from "../assets/background_seven.jpeg";
import backgroundEight from "../assets/background_eight.jpeg";

const backgroundImage = document.getElementById("background_image");

const availableImages = [
  backgroundOne,
  backgroundTwo,
  backgroundThree,
  backgroundFour,
  backgroundFive,
  backgroundSix,
  backgroundSeven,
  backgroundEight,
];

export function placeRandomBackground() {
  const randomIndex = Math.floor(Math.random() * availableImages.length);
  backgroundImage.src = availableImages[randomIndex];
}

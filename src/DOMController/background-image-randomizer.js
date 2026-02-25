import BackgroundOne from "../assets/Background_One.jpg";
import BackgroundTwo from "../assets/Background_Two.jpg";
import BackgroundThree from "../assets/Background_Three.jpg";
import BackgroundFour from "../assets/Background_Four.jpg";
import BackgroundFive from "../assets/Background_Five.jpg";
import BackgroundSix from "../assets/Background_Six.jpg";

const backgroundImage = document.getElementById("background_image");

const availableImages = [
  BackgroundOne,
  BackgroundTwo,
  BackgroundThree,
  BackgroundFour,
  BackgroundFive,
  BackgroundSix,
];

document.addEventListener("DOMContentLoaded", () => placeRandomBackground());

function placeRandomBackground() {
  const randomIndex = Math.floor(Math.random() * availableImages.length);
  backgroundImage.src = availableImages[randomIndex];
}

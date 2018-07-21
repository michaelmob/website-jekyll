const assets = "/assets/images/backgrounds";
const backgrounds = {
  "anton-repponen": `${assets}/anton-repponen-103080-unsplash.jpg`,
  "ivana-cajina": `${assets}/ivana-cajina-403437-unsplash.jpg`,
};


/*
 * Load image before setting class to an element.
 */
const loadImage = function(value, $element) {
  $element.className = "hidden";

  // Pre-load image
  const image = new Image();
  image.onload = function() {
    $element.className = value;
  };

  image.src = backgrounds[value];
};


/*
 * Select random choice from background options and load background.
 */
const setRandomBackground = function() {
  const $body = document.querySelector("body");
  const $footer = document.querySelector("footer");
  const options = Object.keys(backgrounds);
  const choice = options[Math.floor(Math.random() * options.length)];
  loadImage(choice, $body);
}

setRandomBackground();

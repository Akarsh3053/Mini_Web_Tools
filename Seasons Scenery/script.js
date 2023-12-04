const menuButton = document.querySelector("#menu-button");
const seasonTxt = document.querySelector("#menu-button > span");

const seasonMenu = document.querySelector("#menu-season");
const seasonButtons = document.querySelectorAll("#menu-season > button");

let currSeason = getCurrentSeason();
let menuActive = false;

// Animates in the current season
function init() {
  seasonTitleChange(currSeason);
  currSeason = currSeason.toLowerCase();
  transitionAnimation("spring", currSeason, true);
}
init();

// Menu click event
menuButton.addEventListener("click", () => {
  if (!menuActive) {
    menuInAnimation();
  } else {
    menuOutAnimation();
  }
});

// Change season depending on choice
seasonButtons.forEach((button) => {
  // change style on click
  button.addEventListener("click", () => {
    const clickedSeasonText = button.innerHTML.toLowerCase();
    let prevSeasonText = "";

    seasonButtons.forEach((button) => {
      btnSeasonText = button.innerHTML.toLowerCase();
      if (btnSeasonText === currSeason) {
        prevSeasonText = btnSeasonText;
        button.classList = "";
      }
    });

    button.classList.add("selected");

    menuOutAnimation();
    currSeason = button.innerHTML.toLowerCase();

    transitionAnimation(prevSeasonText, currSeason);
    seasonTitleChange(button.innerHTML);
  });

  // initial style
  const initSeasonText = button.innerHTML.toLowerCase();
  if (initSeasonText === currSeason) {
    button.classList.add("selected");
  }
});

// Gets the initial season depending on the IRL month
function getCurrentSeason() {
  const currentDate = new Date();
  const month = currentDate.getMonth();

  let season;
  if (month >= 2 && month <= 4) {
    // March, April, May
    season = "Spring";
  } else if (month >= 5 && month <= 7) {
    // June, July, August
    season = "Summer";
  } else if (month >= 8 && month <= 10) {
    // September, October, November
    season = "Autumn";
  } else {
    // December, January, February
    season = "Winter";
  }

  return season;
}

// Makes menu jump in from behind menu button
function menuInAnimation() {
  menuActive = true;
  gsap.to(seasonMenu, {
    y: -60,
    scale: 1,
    duration: 0.8,
    ease: "elastic.out(0.8, 0.6)"
  });
}

// Makes menu jump back behind menu button
function menuOutAnimation() {
  menuActive = false;
  gsap.to(seasonMenu, {
    y: 0,
    scale: 0,
    duration: 0.8,
    ease: "elastic.in(0.8, 0.6)"
  });
}

// Makes menu button title fade out/in when changing season
function seasonTitleChange(newSeason) {
  gsap.to(seasonTxt, {
    opacity: 0,
    onComplete: function () {
      seasonTxt.innerHTML = newSeason;
      gsap.to(seasonTxt, {
        opacity: 1
      });
    }
  });
}

// The bulk of the animation that makes each layer pop in on transition
function transitionAnimation(oldSeason, newSeason, init = false) {
  const timeline = gsap.timeline();

  const oldSeasonBg = document.querySelector(`#${oldSeason}`);
  const oldImages = document.querySelectorAll(`#${oldSeason} > img`);

  // Artificial delay
  if (!init) {
    timeline.to(oldSeasonBg, {
      duration: 1
    });
  }

  // Bouncy out effect
  oldImages.forEach((image) => {
    timeline.to(image, {
      scale: 0,
      ease: "elastic.in(0.8, 0.8)"
    });
  });

  // Fade out background
  timeline.to(oldSeasonBg, {
    opacity: 0
  });

  const newSeasonBg = document.querySelector(`#${newSeason}`);
  const newImages = document.querySelectorAll(`#${newSeason} > img`);

  // Fade in background
  timeline.to(newSeasonBg, {
    opacity: 1
  });

  // Bouncy in effect
  [...newImages].reverse().forEach((image) => {
    timeline.to(image, {
      scale: 1,
      ease: "elastic.out(0.8, 0.8)"
    });
  });

  timeline.play();
}

// The parallax effect listener to get the cursor position
document.addEventListener("mousemove", (event) => {
  const { clientX, clientY } = event;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Calculate mouse position as a percentage of the screen
  const mouseXPercentage = clientX / screenWidth;
  const mouseYPercentage = clientY / screenHeight;

  // Apply the effect to each layer of each season
  applyParallaxToSeason(currSeason, mouseXPercentage, mouseYPercentage);
});

// The parallax effect application to affect each layer depending on the season
function applyParallaxToSeason(seasonId, mouseXPercent, mouseYPercent) {
  const season = document.getElementById(seasonId);
  const background = season.querySelector(".background");
  const middleground = season.querySelector(".middleground");
  const foreground = season.querySelector(".foreground");

  // Apply different intensities for each layer using GSAP
  gsapMoveLayer(background, mouseXPercent, mouseYPercent, 0.05);
  gsapMoveLayer(middleground, mouseXPercent, mouseYPercent, 0.1);
  gsapMoveLayer(foreground, mouseXPercent, mouseYPercent, 0.15);
}

// The parallax effect itself to move layers via gsap
function gsapMoveLayer(layer, mouseXPercent, mouseYPercent, intensity) {
  if (!layer) return;

  const xOffset = (mouseXPercent - 0.5) * intensity * 100;
  const yOffset = (mouseYPercent - 0.5) * intensity * 100;

  gsap.to(layer, {
    x: xOffset,
    y: yOffset,
    ease: "none", // Use "none" for a smoother, direct tracking effect
    duration: 0.1 // You can adjust the duration for a more or less responsive effect
  });
}
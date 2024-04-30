const cursorDot = document.querySelector(".cursor");
var mouseDown = 0;

// Select the circle element
const circleElement = document.querySelector('.cursor');

// Create objects to track mouse position and custom cursor position
const mouse = { x: 0, y: 0 }; // Track current mouse position
const previousMouse = { x: 0, y: 0 } // Store the previous mouse position
const circle = { x: 0, y: 0 }; // Track the circle position

// Initialize variables to track scaling and rotation
let currentScale = 0; // Track current scale value
let currentAngle = 0; // Track current angle value

// Update mouse position on the 'mousemove' event
window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

// Smoothing factor for cursor movement speed (0 = smoother, 1 = instant)
const speed = 0.35;

// Start animation
const tick = () => {
  // MOVE
  // Calculate circle movement based on mouse position and smoothing
  circle.x += (mouse.x - circle.x) * speed;
  circle.y += (mouse.y - circle.y) * speed;

  // SQUEEZE
  // 1. Calculate the change in mouse position (deltaMouse)
  const deltaMouseX = mouse.x - previousMouse.x;
  const deltaMouseY = mouse.y - previousMouse.y;
  // Update previous mouse position for the next frame
  previousMouse.x = mouse.x;
  previousMouse.y = mouse.y;
  // 2. Calculate mouse velocity using Pythagorean theorem and adjust speed
  const mouseVelocity = Math.min(Math.sqrt(deltaMouseX**2 + deltaMouseY**2) * 4, 150);
  // 3. Convert mouse velocity to a value in the range [0, 0.5]
  const scaleValue = (mouseVelocity / 150) * 0.4;
  // 4. Smoothly update the current scale
  currentScale += (scaleValue - currentScale) * speed;
  // 5. Create a transformation string for scaling
  const scaleTransform = `scale(${1 + currentScale}, ${1 - currentScale})`;

  // ROTATE
  // 1. Calculate the angle using the atan2 function
  const angle = Math.atan2(deltaMouseY, deltaMouseX) * 180 / Math.PI;
  // 2. Check for a threshold to reduce shakiness at low mouse velocity
  if (mouseVelocity > 20) {
    currentAngle = angle;
  }
  // 3. Create a transformation string for rotation
  const rotateTransform = `rotate(${currentAngle}deg)`;

  // Apply all transformations to the circle element in a specific order: translate -> rotate -> scale
  circleElement.style.transform = `translate(-50%, -50%) ${rotateTransform} ${scaleTransform}`;
  circleElement.style.left = `${circle.x}px`;
  circleElement.style.top = `${circle.y}px`;

  // Request the next frame to continue the animation
  window.requestAnimationFrame(tick);
}

// Start the animation loop
tick();

window.addEventListener(
    "mousedown",
    function (e) {
        if (!(e.target.tagName == "A") && !(e.target.tagName == "BUTTON")) {
            cursorDot.animate({
                width: `1.5rem`,
                height: `1.5rem`,
            }, { duration: 200, fill: "forwards", easing: "cubic-bezier(0.3, 0.2, 0.2, 1.4)" });
        } else {
            cursorDot.animate({
                width: `0.5rem`,
                height: `0.5rem`,
            }, { duration: 200, fill: "forwards", easing: "cubic-bezier(0.3, 0.2, 0.2, 1.4)" });
        }
        this.document.activeElement.blur();
        mouseDown++;
    }
)

window.addEventListener(
    "mouseup",
    function (e) {
        if (!(e.target.tagName == "A") && !(e.target.tagName == "BUTTON")) {
            cursorDot.style.top = `-1.25rem`
            cursorDot.style.left = `-1.25rem`
            cursorDot.animate({
                width: `2.5rem`,
                height: `2.5rem`,
            }, { duration: 200, fill: "forwards", easing: "cubic-bezier(0.3, 0.2, 0.2, 1.4)" });
        } else {
            cursorDot.style.top = `-0.5rem`
            cursorDot.style.left = `-0.5rem`
            cursorDot.animate({
                width: `1rem`,
                height: `1rem`,
            }, { duration: 200, fill: "forwards", easing: "cubic-bezier(0.3, 0.2, 0.2, 1.4)" });
        }
        mouseDown--;
    }
)

function cursor() {
    const clickables = document.querySelectorAll("a, button");

    clickables.forEach(clickable => {
        clickable.addEventListener(
            "mouseover",
            function (e) {
                let classList = cursorDot.classList
                classList.remove('bg-transparent')
                classList.add('bg-accent')
                if (mouseDown == 1) {
                    cursorDot.animate({
                        width: `0.5rem`,
                        height: `0.5rem`,
                    }, { duration: 200, fill: "forwards", easing: "cubic-bezier(0.3, 0.2, 0.2, 1.4)" });
                } else {
                    cursorDot.animate({
                        width: `1rem`,
                        height: `1rem`,
                    }, { duration: 200, fill: "forwards", easing: "cubic-bezier(0.3, 0.2, 0.2, 1.4)" });
                }
            }
        )
        clickable.addEventListener(
            "mouseleave",
            function (e) {
                let classList = cursorDot.classList
                classList.add('bg-transparent')
                classList.remove('bg-accent')
                if (mouseDown == 1) {
                    cursorDot.animate({
                        width: `1.5rem`,
                        height: `1.5rem`,
                    }, { duration: 200, fill: "forwards", easing: "cubic-bezier(0.3, 0.2, 0.2, 1.4)" });
                } else {
                    cursorDot.animate({
                        width: `2.5rem`,
                        height: `2.5rem`,
                    }, { duration: 200, fill: "forwards", easing: "cubic-bezier(0.3, 0.2, 0.2, 1.4)" });
                }
            }
        )
    });
}

cursor()

document.addEventListener("htmx:afterRequest", function (e) { cursor() })
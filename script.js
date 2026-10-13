const lessons = [
  {
    id: "mouse",
    title: "Mouse Adventure",
    icon: "🖱️",
    subtitle: "Let's move and click!",
    instruction: "Move your real mouse, then click the star button!",
  },
  {
    id: "keyboard",
    title: "Keyboard Adventure",
    icon: "⌨️",
    subtitle: "Let's find a key!",
    instruction: "Press the letter A on your keyboard!",
  },
  {
    id: "colors",
    title: "Color Adventure",
    icon: "🎨",
    subtitle: "Let's explore colors!",
    instruction: "Find the color I say!",
  },
  {
    id: "numbers",
    title: "Number Adventure",
    icon: "🍎",
    subtitle: "Let's count together!",
    instruction: "Count the apples and choose the right number!",
  },
  {
    id: "safety",
    title: "Safety Adventure",
    icon: "🛡️",
    subtitle: "Let's stay safe online!",
    instruction: "Never share your password. Ask a trusted adult!",
  },
];

let completedLessons = new Set();
let currentLesson = "";
let currentInstruction = "";
let voiceEnabled = true;
let mouseMoved = false;
let lessonWon = false;
let colorAnswer = "";
let appleAnswer = 3;
let challengeIndex = 0;
let challengeScore = 0;
let challengeAnswered = false;
let mouseListenerAdded = false;

const $ = (id) => document.getElementById(id);

// Voice assistant
function speak(message) {
  if (!voiceEnabled || !("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = "en-US";
  utterance.rate = 0.85;
  utterance.pitch = 1.15;

  window.speechSynthesis.speak(utterance);
}

function toggleVoice() {
  voiceEnabled = !voiceEnabled;

  if (!voiceEnabled && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  $("soundBtn").textContent = voiceEnabled ? "🔊 Voice On" : "🔇 Voice Off";

  if (voiceEnabled) {
    speak("Voice assistant is on!");
  }
}

function speakWelcome() {
  speak(
    "Hello, little learner! Welcome to LittleTech. Let's learn computers together!",
  );
}

function repeatInstruction() {
  speak(currentInstruction || "Let's learn and have fun together!");
}

// Screen navigation
function showScreen(id) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });

  $(id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function startLearning() {
  speakWelcome();

  const next = lessons.find((lesson) => !completedLessons.has(lesson.id));

  if (next) {
    openLesson(next.id);
  } else {
    startChallenge();
  }
}

function goHome() {
  showScreen("home");
  updateProgress();
  speak("Choose a picture to start learning!");
}

// Lesson setup
function openLesson(id) {
  const lesson = lessons.find((item) => item.id === id);
  if (!lesson) return;

  currentLesson = id;
  lessonWon = false;

  showScreen("lesson");

  $("lessonIcon").textContent = lesson.icon;
  $("lessonTitle").textContent = lesson.title;
  $("lessonSubtitle").textContent = lesson.subtitle;
  $("speechBubble").textContent = lesson.instruction;
  $("lessonFeedback").textContent = "";
  $("lessonFeedback").className = "feedback";
  $("nextLessonBtn").classList.add("hidden");

  document.querySelectorAll(".activity").forEach((activity) => {
    activity.classList.add("hidden");
  });

  $(id + "Activity").classList.remove("hidden");

  currentInstruction = lesson.instruction;

  if (id === "mouse") setupMouse();
  if (id === "keyboard") setupKeyboard();
  if (id === "colors") setupColors();
  if (id === "numbers") setupNumbers();
  if (id === "safety") {
    currentInstruction =
      "Someone online asks for your password. Tell a trusted adult. Never share it!";
  }

  $("speechBubble").textContent = currentInstruction;
  speak(currentInstruction);
}

// Feedback and lesson completion
function winLesson(message) {
  if (lessonWon) return;

  lessonWon = true;

  $("lessonFeedback").textContent = "🎉 " + message;
  $("lessonFeedback").className = "feedback success";
  $("nextLessonBtn").classList.remove("hidden");

  speak(message);
  confetti();

  if (currentLesson === "keyboard") {
    $("keyFeedback").textContent = "⭐ Great job!";
  }
}

function completeLesson() {
  if (!lessonWon) return;

  completedLessons.add(currentLesson);
  updateProgress();

  const next = lessons.find((lesson) => !completedLessons.has(lesson.id));

  if (next) {
    openLesson(next.id);
  } else {
    goHome();
    $("speechBubble").textContent =
      "You finished all your adventures! Ready for the final challenge?";
    speak(
      "Amazing! You finished all five adventures. Let's go to the final challenge!",
    );

    $("startChallengeBtn").classList.remove("hidden");
  }
}

// Progress display
function updateProgress() {
  const count = completedLessons.size;
  const percent = (count / lessons.length) * 100;

  $("homeProgress").style.width = percent + "%";
  $("homeProgressText").textContent = count + " / " + lessons.length;

  $("challengeStars").textContent = Array.from(
    { length: lessons.length },
    (_, i) => (i < count ? "⭐" : "☆"),
  ).join(" ");
}

// Add final challenge button to home
const challengeButton = document.createElement("button");
challengeButton.id = "startChallengeBtn";
challengeButton.className = "primary-btn hidden";
challengeButton.textContent = "🏆 Start Final Challenge";
challengeButton.style.display = "block";
challengeButton.style.margin = "20px auto";
challengeButton.onclick = startChallenge;
$("home").appendChild(challengeButton);

// MOUSE GAME
function setupMouse() {
  mouseMoved = false;

  if (!mouseListenerAdded) {
    document.addEventListener("mousemove", () => {
      if (currentLesson !== "mouse" || lessonWon) return;

      if (!mouseMoved) {
        mouseMoved = true;
        $("speechBubble").textContent = "Great! Now click the star button!";
        speak("Great! Now click the star button!");
      }
    });

    mouseListenerAdded = true;
  }
}

function mouseClicked() {
  if (currentLesson !== "mouse") return;

  if (!mouseMoved) {
    $("lessonFeedback").textContent = "🖱️ Move your mouse first, then click!";
    $("lessonFeedback").className = "feedback";
    speak("Move your mouse first, then click the star!");
    return;
  }

  winLesson("Amazing! You learned how to move and click!");
}

// KEYBOARD GAME
function setupKeyboard() {
  $("keyFeedback").textContent = "Press A on your real keyboard!";
}

document.addEventListener("keydown", (event) => {
  if (currentLesson !== "keyboard" || lessonWon) return;

  if (event.key.toLowerCase() === "a") {
    winLesson("Excellent! You found the A key!");
  } else {
    $("keyFeedback").textContent = "Try finding the A key!";
  }
});

// COLOR GAME
const colors = ["red", "green", "blue", "yellow"];

function setupColors() {
  colorAnswer = colors[Math.floor(Math.random() * colors.length)];

  const colorNames = {
    red: "red",
    green: "green",
    blue: "blue",
    yellow: "yellow",
  };

  currentInstruction = "Find " + colorNames[colorAnswer] + "!";

  $("speechBubble").textContent = currentInstruction;
  speak(currentInstruction);
}

function chooseColor(color) {
  if (currentLesson !== "colors" || lessonWon) return;

  if (color === colorAnswer) {
    winLesson("Wonderful! You found the correct color!");
  } else {
    $("lessonFeedback").textContent = "🌈 Try another color!";
    $("lessonFeedback").className = "feedback error";
    speak("Try another color!");
  }
}

// NUMBER GAME
function setupNumbers() {
  appleAnswer = Math.floor(Math.random() * 4) + 1;

  $("appleGroup").textContent = Array(appleAnswer).fill("🍎").join(" ");

  currentInstruction = "How many apples can you see?";
  $("speechBubble").textContent = currentInstruction;
  speak(currentInstruction);
}

function chooseNumber(number) {
  if (currentLesson !== "numbers" || lessonWon) return;

  if (number === appleAnswer) {
    winLesson("Perfect! You counted the apples correctly!");
  } else {
    $("lessonFeedback").textContent = "🍎 Count again!";
    $("lessonFeedback").className = "feedback error";
    speak("Count the apples again!");
  }
}

// INTERNET SAFETY GAME
function chooseSafety(isSafe) {
  if (currentLesson !== "safety" || lessonWon) return;

  if (isSafe) {
    winLesson("Good choice! Always protect your password!");
  } else {
    $("lessonFeedback").textContent =
      "🛡️ Try again! Never share your password.";
    $("lessonFeedback").className = "feedback error";
    speak("Try again! Never share your password. Tell a trusted adult.");
  }
}

// FINAL CHALLENGE
const challenges = [
  {
    question: "Find the mouse!",
    options: ["🖱️", "🍎", "🌈"],
    answer: "🖱️",
    voice: "Find the mouse!",
  },
  {
    question: "Which letter did we learn?",
    options: ["B", "A", "Z"],
    answer: "A",
    voice: "Find the letter A!",
  },
  {
    question: "Find the red color!",
    options: ["🟢", "🔴", "🔵"],
    answer: "🔴",
    voice: "Find the red color!",
  },
  {
    question: "How many apples?",
    options: ["🍎 🍎", "🍎 🍎 🍎", "🍎"],
    answer: "🍎 🍎 🍎",
    voice: "How many apples? Count carefully!",
  },
  {
    question: "Should you share your password?",
    options: ["👍 Yes", "🛡️ No"],
    answer: "🛡️ No",
    voice: "Should you share your password? Choose no!",
  },
];

function startChallenge() {
  if (completedLessons.size < lessons.length) {
    speak("Finish all five adventures first!");
    return;
  }

  challengeIndex = 0;
  challengeScore = 0;
  challengeAnswered = false;

  showScreen("challenge");
  showChallenge();
}

function showChallenge() {
  const item = challenges[challengeIndex];

  challengeAnswered = false;

  $("challengeCounter").textContent =
    "Challenge " + (challengeIndex + 1) + " of " + challenges.length;

  $("challengeQuestion").textContent = item.question;
  $("challengeFeedback").textContent = "";
  $("challengeFeedback").className = "feedback";
  $("challengeNext").classList.add("hidden");

  const options = $("challengeOptions");
  options.innerHTML = "";

  item.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "challenge-option";
    button.textContent = option;
    button.onclick = () => answerChallenge(option);
    options.appendChild(button);
  });

  speak(item.voice);
}

function answerChallenge(answer) {
  if (challengeAnswered) return;

  const item = challenges[challengeIndex];
  challengeAnswered = true;

  if (answer === item.answer) {
    challengeScore++;

    $("challengeFeedback").textContent = "🎉 Correct! Brilliant!";
    $("challengeFeedback").className = "feedback success";

    speak("Correct! Brilliant!");
    confetti();
  } else {
    $("challengeFeedback").textContent = "💜 Good try! Let's keep learning!";
    $("challengeFeedback").className = "feedback error";

    speak("Good try! Keep learning!");
  }

  document.querySelectorAll(".challenge-option").forEach((button) => {
    button.disabled = true;
    button.style.opacity = "0.65";
  });

  $("challengeNext").textContent =
    challengeIndex === challenges.length - 1
      ? "🏆 Get My Certificate"
      : "Next ⭐";

  $("challengeNext").classList.remove("hidden");
}

function nextChallenge() {
  if (!challengeAnswered) return;

  challengeIndex++;

  if (challengeIndex < challenges.length) {
    showChallenge();
  } else {
    showCertificate();
  }
}

// CERTIFICATE
function showCertificate() {
  showScreen("certificate");

  $("certificateScore").textContent =
    "Score: " + challengeScore + " / " + challenges.length;

  $("childName").value = "";

  speak(
    "Congratulations! You completed LittleTech. " +
      "You are a Computer Beginner! Great job!",
  );

  confetti();
}

function downloadCertificate() {
  const name = $("childName").value.trim();

  // Add the optional name to the certificate before printing.
  let nameLine = $("printName");

  if (!nameLine) {
    nameLine = document.createElement("h2");
    nameLine.id = "printName";
    nameLine.style.color = "#6246bd";
    nameLine.style.margin = "0 0 15px";
    $("childName").insertAdjacentElement("afterend", nameLine);
  }

  nameLine.textContent = name || "Little Explorer";
  $("childName").style.display = "none";

  window.print();

  // Restore the name field after the print dialog.
  $("childName").style.display = "";
}

function celebrateAgain() {
  speak(
    "Congratulations! You are a LittleTech Computer Beginner. You did an amazing job!",
  );
  confetti();
}

function restartApp() {
  completedLessons.clear();
  currentLesson = "";
  lessonWon = false;
  challengeScore = 0;

  updateProgress();
  $("startChallengeBtn").classList.add("hidden");
  $("childName").value = "";

  const printName = $("printName");
  if (printName) printName.remove();

  $("childName").style.display = "";

  showScreen("home");
  speakWelcome();
}

// Celebration effect
function confetti() {
  const emojis = ["⭐", "🎉", "💖", "🌈", "✨"];

  for (let i = 0; i < 22; i++) {
    const piece = document.createElement("span");

    piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    piece.style.position = "fixed";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.top = "-30px";
    piece.style.fontSize = 18 + Math.random() * 18 + "px";
    piece.style.pointerEvents = "none";
    piece.style.zIndex = "9999";

    document.body.appendChild(piece);

    const drift = (Math.random() - 0.5) * 180;
    const duration = 1300 + Math.random() * 1200;

    const animation = piece.animate(
      [
        { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
        {
          transform: `translate(${drift}px, 105vh) rotate(540deg)`,
          opacity: 0,
        },
      ],
      { duration, easing: "ease-in", fill: "forwards" },
    );

    animation.onfinish = () => piece.remove();
  }
}

// Initial setup
updateProgress();

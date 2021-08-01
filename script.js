var sw_version = "1.0.1";

class Game {
  constructor(min, max, questions, timer) {
    this.min = min;
    this.max = max;
    this.questions = questions;
    this.timer = timer;
    this.correct = 0;
    this.count = 0;
    this.incorrect = 0;
    this.intervals = [];
    this.unattempted = 0;
    this.percentile = 0;
    this.timer = timer;
    this.currectPage = "welcome";
  }
  pseudoRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    var num = Math.floor(Math.random() * (max - min + 1) + min);
    if (num % 2 == 0) {
      return this.pseudoRandom(min, max);
    }
    else {
      return num;
    }
  }
  generateQuestion() {
    clearTimeout(this.intervals[0]);
    clearTimeout(this.intervals[1]);
    clearTimeout(this.intervals[2]);
    clearTimeout(this.intervals[3]);
    this.resetTimer();
    if (this.count == this.questions) {
      this.calculatePercentile();
      this.gameOver();
      return;
    }
    var qes = this.pseudoRandom(this.min, this.max);
    q("#ques").textContent = qes;
    A(".option").forEach(el => {
      el.removeAttribute("done", "true");
      el.classList.remove("correct-option");
      el.classList.remove("wrong-option");
      el.disabled = false;
    });
    this.intervals[3] = setTimeout(() => {
      this.setTimer(this.timer, () => { this.checkAnswer("cat"); });
    }, 500);
    q("#question_number").textContent = this.count + 1;
  }
  checkAnswer(e) {
    clearTimeout(this.timeOut);
    clearInterval(this.timeInterval);
    clearTimeout(this.intervals[0]);
    clearTimeout(this.intervals[1]);
    clearTimeout(this.intervals[2]);
    clearTimeout(this.intervals[3]);
    var ans = q("#ques").textContent;

    if (e == "cat") {
      this.unattempted += 1;
      this.count += 1;
      this.intervals[0] = setTimeout(() => {
        this.generateQuestion();
      }, 500);
      return;
    }

    if (this.count == this.questions) {
      this.calculatePercentile();
      this.gameOver();
      return;
    }

    var opt = e.target;
    A(".option").forEach(el => {
      el.setAttribute("done", "true");
      el.disabled = true;
    });
    if (isPrime(parseInt(ans))) {
      if (opt.dataset.index == 0) {
        opt.classList.add("correct-option");
        this.correct += 1;
        this.count += 1;
      }
      else {
        this.incorrect += 1;
        this.count += 1;
        opt.classList.add("wrong-option");
      }
      this.intervals[1] = setTimeout(() => {
        this.generateQuestion();
      }, 500);
    }
    else {
      if (opt.dataset.index == 1) {
        opt.classList.add("correct-option");
        this.correct += 1;
        this.count += 1;
      }
      else {
        this.incorrect += 1;
        this.count += 1;
        opt.classList.add("wrong-option");
      }
      this.intervals[2] = setTimeout(() => {
        this.generateQuestion();
      }, 500);
    }
  }
  reset() {
    this.count = 0;
    this.correct = 0;
    this.incorrect = 0;
    this.percentile = 0;
    clearTimeout(this.timeOut);
    clearTimeout(this.intervals[0]);
    clearTimeout(this.intervals[1]);
    clearTimeout(this.intervals[2]);
    clearTimeout(this.intervals[3]);
    clearInterval(this.timeInterval);
    this.navigate("welcome");
  }
  calculatePercentile() {
    this.percentile = Math.round((this.correct / this.questions) * 100);
    q("#score_percentage").textContent = this.percentile;
  }
  gameOver() {
    q("#total_questions").textContent = this.questions;
    q("#correct_answers").textContent = this.correct;
    q("#wrong_answers").textContent = this.incorrect;
    q("#unattempted_questions").textContent = this.unattempted;
    q("#score_percentage").textContent = this.percentile + "%";
    if (this.percentile == 100) {
      q("#game_over_summary").textContent += " Congo! You are a Prime Matser. (Not Crime master! lol)";
    }
    this.navigate("results");
  }
  instructions() {
    this.navigate("instructions");
  }
  start() {
    this.generateQuestion();
    this.navigate("app");
  }
  navigate(page) {
    if (this.currectPage == page) {
      return;
    }
    q("#" + this.currectPage).hidden = true;
    q("#" + page).hidden = false;
    this.currectPage = page;
  }
  resetTimer() {
    q("#timer").style.width = "100%";
  }
  setTimer(seconds, callback) {
    var totalTime = seconds * 1000;
    var remainingTime = totalTime;
    this.timeInterval = setInterval(() => {
      remainingTime -= 10;
      var percent = remainingTime / totalTime * 100
      q("#timer").style.width = `${percent}%`;
    }, 10)
    this.timeOut = setTimeout(() => {
      try {
        callback();
      }
      catch (e) {
        console.log(e)
      }
    }, totalTime);
  }
}

var game;

A(".level") && A(".level").forEach(el => {
  el.addEventListener("click", e => {
    var min = parseInt(el.dataset.config.split("-")[0]);
    var max = parseInt(el.dataset.config.split("-")[1]);
    game = new Game(min, max, 10, 5);
    game.instructions();
  });
});

q("#game_start_btn").addEventListener("click", e => {
  game.start();
});

q("#play_again").addEventListener("click", e => {
  game.reset();
});

A(".option").forEach(el => {
  el.addEventListener("click", e => {
    game.checkAnswer(e);
  });
});


function q(e) { return document.querySelector(e); }
function A(q) { return document.querySelectorAll(q); }

function isPrime(n) {
  if (n < 2) {
    return false;
  }
  if (n == 2) {
    return true;
  }
  if (n % 2 == 0) {
    return false;
  }
  var x = 3;
  while (x * x <= n) {
    if (n % x == 0) {
      return false;
    }
    x += 2;
  }
  return true;
}

function range(start, stop, step) {
  if (typeof stop == 'undefined') {
    // one param defined
    stop = start;
    start = 0;
  }

  if (typeof step == 'undefined') {
    step = 1;
  }

  if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
    return [];
  }

  var result = [];
  for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
    result.push(i);
  }

  return result;
};

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js?v=' + sw_version);
  console.log("Service Worker Registered!");
}
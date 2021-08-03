var sw_version = "1.0.6";

class Game {
  constructor(level, min, max, questions, timer) {
    this.min = min;
    this.max = max;
    this.questions = questions;
    this.data_questions = [];
    this.user_answers = [];
    this.solutions = [];
    this.timer = timer;
    this.correct = 0;
    this.level = level;
    this.count = 0;
    this.incorrect = 0;
    this.intervals = [];
    this.unattempted = 0;
    this.percentile = 0;
    this.timer = timer;
    this.currentpage = "welcome";
  }
  pseudoRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    var num = Math.floor(Math.random() * (max - min + 1) + min);
    if (num % 2 == 0 || num == 1 || num <= 0) {
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
    this.data_questions.push(parseInt(qes));
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
      this.user_answers.push(null);
      let qes = this.data_questions[this.data_questions - 1];
      if (isPrime(parseInt(qes))) {
        this.solutions.push(true);
      }
      else {
        this.solutions.push(false);
      }
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
    if (opt.dataset.index == 0) {
      this.user_answers.push(true);
    }
    else {
      this.user_answers.push(false);
    }
    if (isPrime(parseInt(ans))) {
      this.solutions.push(true);
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
      this.solutions.push(false);
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
  calculateReview(d, type, extra) {
    if (type == "icon") {
      if (extra !== undefined && (d === null || extra === null)) {
        return "info";
      }
      if (d == true) {
        return "check_circle";
      }
      if (d == false) {
        return "cancel";
      }
    }
    if (type == "color") {
      if (extra !== undefined && (d === null || extra === null)) {
        return "orange";
      }
      if (d == true) {
        return "green";
      }
      if (d == false) {
        return "red";
      }
    }
    if (type == "text") {
      if (extra !== undefined && (d === null || extra === null)) {
        return "Nothing";
      }
      if (d == true) {
        return "Yes";
      }
      if (d == false) {
        return "No";
      }
    }
  }
  gameOver() {
    q("#game_level").textContent = this.level;
    q("#total_questions").textContent = this.questions;
    q("#correct_answers").textContent = this.correct;
    q("#wrong_answers").textContent = this.incorrect;
    q("#unattempted_questions").textContent = this.unattempted;
    q("#score_percentage").textContent = this.percentile + "%";
    if (this.percentile == 100) {
      q("#game_over_summary").innerHTML += " Congo! You are a Prime Matser.";
    }
    q("#reviews_container").innerHTML = "";
    for (var x in this.data_questions) {
      var el = document.createElement("div");
      el.className = "review_item flex flex-col align-start justify-start";
      let fac = this.getFactors(this.data_questions[x]);
      var temp = `
      <div class="review_item_header flex align-center">
        <m class="m-0 p-0 fs-1 clr-${this.calculateReview(this.user_answers[x] == this.solutions[x], "color", this.user_answers[x])}">${this.calculateReview(this.user_answers[x] == this.solutions[x], "icon", this.user_answers[x])}</m>
      <span class="review_q_no fs--1" > Question ${parseInt(x) + 1}</span>
      </div >
      <div class="review_details">
        <h3 class="review_question">Question: <span class="rev_q_v clr-blue">${this.data_questions[x]}</span></h3>
        <h3 class="review_your_ans">Your Answer: <span class="rev_y_a clr-${this.calculateReview(this.user_answers[x] == this.solutions[x], "color", this.user_answers[x])}">${this.calculateReview(this.user_answers[x], "text", this.user_answers[x])}</span></h3>
        <h3 class="review_correct_ans">Correct Answer: <span class="rev_c_a clr-green">${this.calculateReview(this.solutions[x], "text")}</span></h3>
        <button done class="option-btn detailed_solution correct-option" onclick="game.showDetailedExplation(event)">Detailed Solution</button>
      </div>
      <div hidden class="review_detailed_solution w-100">
        <div class="review_d_header flex w-100 justify-end">
          <m R class="p-0 review_close_btn" onclick="game.hideDetailedExplation(event)">close</m>
        </div>
        <div class="review_detail_math">
          <span class="rev_math_num">Factors of ${this.data_questions[x]} = </span><span class="rev_factors">${fac.join(", ")}</span><br /><br />
          <div class="review_output_statement">Since ${this.data_questions[x]} has ${(() => fac.length > 2 ? "more than 2 factors, It is not a prime number." : "only 2 factors, i.e. 1 and " + this.data_questions[x] + " itself, It is a prime number.")()}</div>
        </div>
      </div>
    `;
      el.innerHTML = temp;
      q("#reviews_container").appendChild(el);
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
  showDetailedExplation(e) {
    var exp = e.target.closest(".review_item").querySelector(".review_detailed_solution");
    var btn = e.target.closest(".review_item").querySelector(".detailed_solution");
    exp.hidden = false;
    btn.hidden = true;
  }
  hideDetailedExplation(e) {
    var exp = e.target.closest(".review_item").querySelector(".review_detailed_solution");
    var btn = e.target.closest(".review_item").querySelector(".detailed_solution");
    exp.hidden = true;
    btn.hidden = false;
  }
  navigate(page) {
    if (this.currentpage == page) {
      return;
    }
    q("#" + this.currentpage).hidden = true;
    q("#" + page).hidden = false;
    this.currentpage = page;
  }
  resetTimer() {
    q("#timer").style.width = "100%";
  }
  getFactors(num) {
    let val = parseInt(num), factors = [];
    for (let i = 0; i <= val; i++) {
      // if (i == 1) {
      //   factors.push(1);
      // }
      // if (i == val) {
      //   factors.push(val);
      // }
      if (val % i == 0) {
        factors.push(i);
      }
    }
    return [...new Set(factors)];
  }
  setTimer(seconds, callback) {
    var totalTime = seconds * 1000;
    var remainingTime = totalTime;
    this.timeInterval = setInterval(() => {
      remainingTime -= 10;
      var percent = remainingTime / totalTime * 100
      q("#timer").style.width = `${percent}% `;
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
    var lvl = el.dataset.level;
    game = new Game(lvl, min, max, 10, 5);
    game.instructions();
  });
});

q("#game_start_btn").addEventListener("click", e => {
  game.start();
});

q("#play_again").addEventListener("click", e => {
  game.reset();
});

q("#review_answers").addEventListener("click", e => {
  game.navigate("review");
});

q("#review-go_back").addEventListener("click", e => {
  game.navigate("results")
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

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('./sw.js?v=' + sw_version);
//   console.log("Service Worker Registered!");
// }
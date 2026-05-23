const before = document.getElementById("before");
const liner = document.getElementById("liner");
const command = document.getElementById("typer");
const textarea = document.getElementById("texter");
const terminal = document.getElementById("terminal");
const contentscroll = document.getElementById("contentscroll");

let git = 0;
let pw = false;
const commands = [];
let suggestedCommand = null;
let awaitingConfirmation = false;
let awaitingProjectSelection = false;
let awaitingAiInput = false;

let currentPath = ["home", "vashisht"];

const fileSystem = {
  "/": {
    "home": {
      "vashisht": {
        "about.md": [
          "=========================================",
          "📄 about.md",
          "=========================================",
          "Hey, I'm Vashisht Brahmbhatt! 👋",
          "🎓 Pursuing dual B.Tech CSE and B.S. Data Science.",
          "🚀 Building AI-first applications and products.",
          "🏢 Founder @ Colrnx.",
          "✍️ Documenting my journey publicly.",
          "",
          "💡 Tip: Type 'about' for the rich glassmorphism view!"
        ],
        "skills.txt": [
          "=========================================",
          "📄 skills.txt",
          "=========================================",
          "💻 Frontend: React, Next.js, TypeScript, TailwindCSS",
          "⚙️ Backend: Node.js, Express, FastAPI, Flask",
          "🤖 AI/ML: PyTorch, TensorFlow, OpenCV, GenAI",
          "☁️ DB/Cloud: MongoDB, PostgreSQL, AWS, Docker",
          "",
          "💡 Tip: Type 'skills' for the rich glassmorphism view!"
        ],
        "resume.pdf": "resume-hook",
        "socials.url": [
          "=========================================",
          "📄 socials.url",
          "=========================================",
          "• twitter:  x/vashishtdbhere",
          "• linkedin: linkedin/vashishtdb24",
          "• github:   github/VDB24",
          "• web:      vashisht.com",
          "",
          "💡 Tip: Type 'socials' for direct clickable links!"
        ],
        "colrnx": {
          "pitch.txt": [
            "=========================================",
            "📄 colrnx/pitch.txt",
            "=========================================",
            "Colrnx is Vashisht's AI-first startup endeavor.",
            "We build cutting-edge artificial intelligence and automation solutions."
          ]
        }
      }
    }
  }
};

function getNodeFromPath(pathArr) {
  let curr = fileSystem["/"];
  for (const part of pathArr) {
    if (curr && typeof curr === "object" && !Array.isArray(curr) && curr[part] !== undefined) {
      curr = curr[part];
    } else {
      return null;
    }
  }
  return curr;
}

function resolvePath(targetStr) {
  if (!targetStr || targetStr === "~") {
    return ["home", "vashisht"];
  }
  let newPath = [...currentPath];
  if (targetStr.startsWith("/")) {
    newPath = [];
  }
  const segments = targetStr.split("/").filter(s => s.length > 0 && s !== ".");
  for (const segment of segments) {
    if (segment === "..") {
      if (newPath.length > 0) {
        newPath.pop();
      }
    } else {
      newPath.push(segment);
    }
  }
  return newPath;
}

function getPromptDirName() {
  if (currentPath.length === 2 && currentPath[0] === "home" && currentPath[1] === "vashisht") {
    return "~";
  }
  if (currentPath.length === 0) {
    return "/";
  }
  return currentPath[currentPath.length - 1];
}

function updatePrompt() {
  if (!liner) return;
  const promptStr = awaitingAiInput ? "[VDB-AI]~$" : `[VDB@archGX24 ${getPromptDirName()}]~$`;
  liner.setAttribute("data-prompt", promptStr);
}

function scrollToBottom() {
  if (contentscroll) {
    contentscroll.scrollTop = contentscroll.scrollHeight;
  }
}

const commandMap = {
  help: "help",
  about: "about",
  skills: "skills",
  projects: "projects",
  "deep-learning": "deep-learning",
  socials: "socials",
  resume: "resume",
  email: "email",
  history: "history",
  sudo: "sudo",
  clear: "clear",
  dev: "dev",
  twitter: "twitter",
  linkedin: "linkedin",
  instagram: "instagram",
  github: "github",
  snake: "snake",
  exit: "exit",
  ask: "ask",
  chat: "chat",
  ai: "ai",
  ls: "ls",
  cd: "cd",
  cat: "cat",
  pwd: "pwd",
  whoami: "whoami",
};

setTimeout(function () {
  loopLines(banner, "", 80);
  textarea.focus();
  scrollToBottom();
  typeWriterEffect();
}, 100);

// Typing Animation Logic
const roles = ["AI Developer", "Data Science Student", "Computer Science Student", "Building AI Solutions", "Founder @Colrnx"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterElement = document.getElementById("typewriter");

function typeWriterEffect() {
  if (!typewriterElement) return;
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
  }

  let typeSpeed = isDeleting ? 50 : 100;

  if (!isDeleting && charIndex === currentRole.length) {
    typeSpeed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    typeSpeed = 500;
  }

  setTimeout(typeWriterEffect, typeSpeed);
}

window.addEventListener("keyup", function (e) {
  enterKey(e);
  scrollToBottom();
});

window.addEventListener("keydown", function () {
  textarea.focus();
  scrollToBottom();
});

document.addEventListener("click", function () {
  textarea.focus();
  scrollToBottom();
});

terminal.addEventListener("click", function () {
  textarea.focus();
  scrollToBottom();
});

textarea.addEventListener("input", scrollToBottom);

textarea.value = "";
command.innerHTML = textarea.value;

function enterKey(e) {
  textarea.focus();
  scrollToBottom();

  if (e.keyCode === 181) {
    document.location.reload(true);
  }

  if (e.key === "Tab") {
    e.preventDefault();
    const inputVal = textarea.value.trim();
    if (inputVal === "") return;

    const parts = inputVal.split(/\s+/);
    if (parts.length > 1) {
      const cmdPart = parts[0].toLowerCase();
      const argPart = parts.slice(1).join(" ").toLowerCase();

      if (cmdPart === "cd" || cmdPart === "cat") {
        const dir = getNodeFromPath(currentPath);
        if (dir && typeof dir === "object" && !Array.isArray(dir)) {
          const keys = Object.keys(dir);
          const matches = keys.filter(k => k.toLowerCase().startsWith(argPart));
          if (matches.length === 1) {
            const completedVal = cmdPart + " " + matches[0];
            textarea.value = completedVal;
            command.innerHTML = completedVal;
          } else if (matches.length > 1) {
            addLine("<br>", "", 0);
            loopLines(matches, "color2", 80);
            addLine("<br>", "", matches.length * 80 + 100);
          }
        }
        scrollToBottom();
        return;
      }
    }

    const partial = inputVal.toLowerCase();
    const matches = Object.keys(commandMap).filter((cmd) =>
      cmd.startsWith(partial),
    );
    if (matches.length === 1) {
      textarea.value = matches[0];
      command.innerHTML = matches[0];
    } else if (matches.length > 1) {
      addLine("<br>", "", 0);
      loopLines(matches, "color2", 80);
      addLine("<br>", "", matches.length * 80 + 100);
    }
    scrollToBottom();
    return;
  }

  if (e.ctrlKey && e.key === "r") {
    e.preventDefault();
    const search = prompt("Reverse search:");
    const match = commands
      .slice()
      .reverse()
      .find((cmd) => cmd.includes(search));
    if (match) {
      textarea.value = match;
      command.innerHTML = match;
    } else {
      addLine("No match found in history.", "error", 100);
    }
    scrollToBottom();
  }

  if (e.keyCode === 13) {
    const input = command.innerHTML.trim();
    const promptPrefix = awaitingAiInput ? "[VDB-AI]~$" : `[VDB@archGX24 ${getPromptDirName()}]~$`;
    addLine(promptPrefix + command.innerHTML, "no-animation", 0);

    const inputLower = input.toLowerCase();

    if (awaitingAiInput) {
      handleAiConversation(inputLower);
    } else if (awaitingProjectSelection) {
      if (inputLower === "1") {
        loopLines(projects, "color2 margin", 80);
      } else if (inputLower === "2") {
        loopLines(deep_learning, "color2 margin", 80);
      } else {
        addLine("Cancelled project selection.", "color2", 80);
      }
      awaitingProjectSelection = false;
    } else if (awaitingConfirmation && suggestedCommand) {
      if (inputLower === "y") {
        commander(suggestedCommand);
      } else {
        addLine("Cancelled.", "color2", 80);
      }
      awaitingConfirmation = false;
      suggestedCommand = null;
    } else {
      commands.push(command.innerHTML);
      git = commands.length;
      commander(input);
    }

    command.innerHTML = "";
    textarea.value = "";
    scrollToBottom();
  }

  if (e.keyCode === 38 && git !== 0) {
    git -= 1;
    textarea.value = commands[git];
    command.innerHTML = textarea.value;
    scrollToBottom();
  }

  if (e.keyCode === 40 && git !== commands.length) {
    git += 1;
    textarea.value = commands[git] || "";
    command.innerHTML = textarea.value;
    scrollToBottom();
  }
}

function commander(cmd) {
  const parts = cmd.trim().split(/\s+/);
  const mainCmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (mainCmd) {
    case "help":
      loopLines(help, "color2 margin", 80);
      break;
    case "about":
      loopLines(about, "color2 margin", 80);
      break;
    case "skills":
      loopLines(skills, "color2 margin", 80);
      break;
    case "projects":
      addLine("<br>", "", 0);
      addLine("Select a project category:", "color2 margin", 80);
      addLine("1. Side Projects - F1, Cashistic, Dev Wrap", "color2 margin", 160);
      addLine("2. Deep Learning - Deep learning projects", "color2 margin", 240);
      addLine("Type '1' or '2' to view.", "color2 margin", 320);
      awaitingProjectSelection = true;
      break;
    case "deep-learning":
      loopLines(deep_learning, "color2 margin", 80);
      break;
    case "socials":
      loopLines(socials, "color2 margin", 80);
      break;
    case "resume":
      addLine("Opening Resume...", "color2", 80);
      newTab(resumeLink);
      break;

    case "ask":
    case "chat":
    case "ai":
      awaitingAiInput = true;
      updatePrompt();
      addLine("<br>", "", 0);
      addLine("🤖 AI Assistant Mode Activated!", "color2 font-weight-bold", 80);
      addLine("Hello! I am Vashisht's virtual assistant. Ask me anything about Vashisht, his projects, skills, or how to navigate his portfolio.", "color2", 160);
      addLine("Type <span class=\"command\">exit</span> to return to the main terminal shell.", "color2", 240);
      addLine("<br>", "", 320);
      break;

    case "ls":
      {
        const dir = getNodeFromPath(currentPath);
        if (dir && typeof dir === "object" && !Array.isArray(dir)) {
          const keys = Object.keys(dir);
          if (keys.length > 0) {
            const formattedItems = keys.map(key => {
              const item = dir[key];
              const isDir = typeof item === "object" && !Array.isArray(item);
              if (isDir) {
                return `<span class="command" style="font-weight: bold;">${key}/</span>`;
              } else {
                return `<span class="white">${key}</span>`;
              }
            });
            addLine(formattedItems.join("&nbsp;&nbsp;&nbsp;&nbsp;"), "no-animation", 80);
          }
        }
      }
      break;

    case "pwd":
      addLine("/" + currentPath.join("/"), "color2", 80);
      break;

    case "whoami":
      addLine("vashisht (AI Developer & Startup Founder)", "color2", 80);
      break;

    case "cd":
      {
        const target = args[0];
        const targetPath = resolvePath(target);
        const node = getNodeFromPath(targetPath);
        if (node === null) {
          addLine(`cd: no such file or directory: ${target || ""}`, "error", 80);
        } else {
          const isDir = typeof node === "object" && !Array.isArray(node);
          if (isDir) {
            currentPath = targetPath;
            updatePrompt();
          } else {
            addLine(`cd: not a directory: ${target}`, "error", 80);
          }
        }
      }
      break;

    case "cat":
      {
        if (args.length === 0) {
          addLine("cat: missing operand", "error", 80);
          break;
        }
        const target = args[0];
        const targetPath = resolvePath(target);
        const node = getNodeFromPath(targetPath);
        if (node === null) {
          addLine(`cat: ${target}: No such file or directory`, "error", 80);
        } else {
          const isDir = typeof node === "object" && !Array.isArray(node);
          if (isDir) {
            addLine(`cat: ${target}: Is a directory`, "error", 80);
          } else if (targetPath[targetPath.length - 1] === "resume.pdf") {
            addLine("Opening Resume...", "color2", 80);
            newTab(resumeLink);
          } else {
            if (Array.isArray(node)) {
              loopLines(node, "color2 margin", 80);
            } else {
              addLine(node, "color2 margin", 80);
            }
          }
        }
      }
      break;
    case "history":
      addLine("<br>", "", 0);
      loopLines(commands, "color2", 80);
      addLine("<br>", "command", 80 * commands.length + 50);
      break;
    case "email":
      addLine(
        'Opening mailto:<a href="mailto:vashishtbrahmbhatt@gmail.com"> vashishtbrahmbhatt@gmail.com</a>...',
        "color2",
        80,
      );
      newTab(email);
      break;
    case "clear":
      setTimeout(function () {
        const paragraphs = terminal.querySelectorAll("p");
        paragraphs.forEach((p) => p.remove());
        if (!document.getElementById("before")) {
          const beforeElement = document.createElement("a");
          beforeElement.id = "before";
          terminal.insertBefore(beforeElement, terminal.firstChild);
          before = beforeElement;
        }
        if (typeof banner !== "undefined") {
          loopLines(banner, "", 80);
        }
        textarea.focus();
        scrollToBottom();
      }, 1);
      break;
    case "dev":
      addLine("<br>", "", 0);
      addLine("🚧 Blog / Dev.to profile is currently under construction and coming soon! Stay tuned.", "color2", 80);
      addLine("<br>", "", 160);
      break;
    case "twitter":
      addLine("Opening Twitter...", "color2", 0);
      newTab(twitter);
      break;
    case "linkedin":
      addLine("Opening LinkedIn...", "color2", 0);
      newTab(linkedin);
      break;
    case "instagram":
      addLine("Opening Instagram...", "color2", 0);
      newTab(instagram);
      break;
    case "github":
      addLine("Opening GitHub...", "color2", 0);
      newTab(github);
      break;
    case "sudo":
      addLine("Oh no, you're not an admin...", "color2", 0);
      newTab(sudo);
      break;
    case "snake":
      runSnakeGame();
      break;
    default:
      const closest = findClosestCommand(cmd);
      if (closest) {
        suggestedCommand = closest;
        awaitingConfirmation = true;
        addLine(
          `<span class="inherit">Command not found. Did you mean <span class="command">'${closest}'</span>? (y/n)</span>`,
          "error",
          100,
        );
      } else {
        addLine(
          `<span class="inherit">Command not found. Type <span class="command">'help'</span> for available commands.</span>`,
          "error",
          100,
        );
      }
      break;

    case "quit":
    case "logout":
    case "exit":
      addLine("👋 Session terminated.", "color2", 0);
      setTimeout(close_window, 500);
      break;
  }
  scrollToBottom();
}

function close_window() {
  // Attempt normal close (works if tab was JS-opened)
  window.open("", "_self");
  window.close();

  // Fallback (most browsers): navigate away
  setTimeout(() => {
    window.location.href = "about:blank";
  }, 100);
}

function newTab(link) {
  setTimeout(function () {
    window.open(link, "_blank");
  }, 500);
}

function addLine(text, style, time) {
  let t = "";
  for (let i = 0; i < text.length; i++) {
    if (text.charAt(i) === " " && text.charAt(i + 1) === " ") {
      t += "&nbsp;&nbsp;";
      i++;
    } else {
      t += text.charAt(i);
    }
  }

  setTimeout(function () {
    const next = document.createElement("p");
    next.innerHTML = t;
    next.className = style;
    before.parentNode.insertBefore(next, before);
    contentscroll.scrollTop = contentscroll.scrollHeight;
  }, time);
}

function loopLines(name, style, time) {
  name.forEach(function (item, index) {
    addLine(item, style, index * time);
  });
  setTimeout(
    function () {
      scrollToBottom();
    },
    name.length * time + 50,
  );
}

function findClosestCommand(input) {
  const threshold = 3;
  let minDist = Infinity;
  let closest = null;
  Object.keys(commandMap).forEach((cmd) => {
    const dist = levenshtein(input, cmd);
    if (dist < minDist && dist <= threshold) {
      minDist = dist;
      closest = cmd;
    }
  });
  return closest;
}

function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0),
  );
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }
  return matrix[a.length][b.length];
}

function runSnakeGame() {
  const width = 20,
    height = 10;
  let snake = [{ x: 5, y: 5 }];
  let food = { x: 10, y: 5 };
  let dir = "right";
  let score = 0;
  let interval;
  let gameElement;

  function draw() {
    let screen = `Score: ${score}\n`;
    for (let y = 0; y < height; y++) {
      let row = "";
      for (let x = 0; x < width; x++) {
        if (x === food.x && y === food.y) row += "*";
        else if (snake.some((s) => s.x === x && s.y === y)) row += "O";
        else row += ".";
      }
      screen += row + "\n";
    }

    if (!gameElement) {
      gameElement = document.createElement("p");
      gameElement.className = "color2";
      gameElement.innerHTML = `<pre>${screen}</pre>`;
      before.parentNode.insertBefore(gameElement, before);
    } else {
      gameElement.innerHTML = `<pre>${screen}</pre>`;
    }

    contentscroll.scrollTop = contentscroll.scrollHeight;
  }

  function move() {
    const head = { ...snake[0] };
    switch (dir) {
      case "up":
        head.y--;
        break;
      case "down":
        head.y++;
        break;
      case "left":
        head.x--;
        break;
      case "right":
        head.x++;
        break;
    }

    if (
      head.x < 0 ||
      head.x >= width ||
      head.y < 0 ||
      head.y >= height ||
      snake.some((s) => s.x === head.x && s.y === head.y)
    ) {
      clearInterval(interval);
      gameElement.innerHTML += `<br><span class="error">💀 Game Over! Final Score: ${score}</span>`;
      window.removeEventListener("keydown", keyHandler);
      return;
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score++;
      food = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
      };
    } else {
      snake.pop();
    }

    draw();
  }

  function keyHandler(e) {
    switch (e.key) {
      case "ArrowUp":
        if (dir !== "down") dir = "up";
        break;
      case "ArrowDown":
        if (dir !== "up") dir = "down";
        break;
      case "ArrowLeft":
        if (dir !== "right") dir = "left";
        break;
      case "ArrowRight":
        if (dir !== "left") dir = "right";
        break;
      case "Escape":
      case "q":
        clearInterval(interval);
        window.removeEventListener("keydown", keyHandler);
        gameElement.innerHTML += `<br><span class="color2">🛑 Snake game exited.</span>`;
        break;
    }
  }

  window.addEventListener("keydown", keyHandler);
  addLine(
    "🎮 Starting Snake game... Use arrow keys to move. 'q' or Esc to quit.",
    "color2",
    0,
  );
  draw();
  interval = setInterval(move, 250);
}

function handleAiConversation(input) {
  if (input === "exit" || input === "quit") {
    awaitingAiInput = false;
    updatePrompt();
    addLine("<br>", "", 0);
    addLine("🤖 Exiting AI Assistant. Welcome back to VDB shell!", "color2", 80);
    addLine("Type <span class=\"command\">help</span> to see all main commands.", "color2", 160);
  } else {
    let response = getAiResponse(input);
    addLine("<br>", "", 0);
    addLine("🤖 AI Assistant:", "color2 font-weight-bold", 80);
    addLine(response, "color2 margin", 160);
    addLine("<br>", "", 240);
  }
}

function getAiResponse(input) {
  const query = input.toLowerCase();

  if (query.includes("help") || query.includes("navigate") || query.includes("command") || query.includes("how to")) {
    return "To navigate this terminal portfolio, you can use these main commands:<br>" +
      "  - <span class=\"command\">about</span>: Learn about Vashisht's background.<br>" +
      "  - <span class=\"command\">skills</span>: View technical skills.<br>" +
      "  - <span class=\"command\">projects</span>: Choose and view his side projects or deep learning models.<br>" +
      "  - <span class=\"command\">socials</span>: Find social links.<br>" +
      "  - <span class=\"command\">resume</span>: Open his resume PDF.<br>" +
      "  - <span class=\"command\">clear</span>: Clear terminal screen.";
  }

  if (query.includes("about") || query.includes("who are you") || query.includes("vashisht") || query.includes("bio")) {
    return "Vashisht is a highly ambitious builder who's balancing multiple parallel identities at once:<br><br>" +
      "• 🎓 <strong>Student</strong> pursuing a dual-track technical education, including a B.S. in Data Science from IIT Madras and B.Tech in CSE from GLS University.<br>" +
      "• 🤖 <strong>Aspiring AI/Deep Learning Engineer</strong> constantly experimenting with frameworks and projects.<br>" +
      "• 🚀 <strong>Startup Founder</strong> building <strong>Colrnx</strong>.<br>" +
      "• ✍️ <strong>Creator</strong> documenting the journey publicly through content, personal branding, and this terminal portfolio.<br>" +
      "• ⚡ <strong>Fast Shipper</strong> who likes learning in public and combining deep engineering with design/storytelling.<br><br>" +
      "He thinks in systems — whether it's refining AI architechtures, editing visuals precisely, optimizing his tool stack for coding productivity, or balancing startup work with side projects.<br><br>" +
      "<strong>Overall:</strong> Vashisht is a young technical founder-builder trying to turn curiosity, engineering, and internet leverage into something meaningful at scale!";
  }

  if (query.includes("skills") || query.includes("tech") || query.includes("language") || query.includes("what can you do")) {
    return "Vashisht is skilled in:<br>" +
      "  - 💻 Frontend: React, Next.js, TypeScript, TailwindCSS<br>" +
      "  - ⚙️ Backend: Node.js, FastAPI, Flask, Express<br>" +
      "  - 🤖 AI/ML: PyTorch, TensorFlow, LLMs, Deep Learning, OpenCV<br>" +
      "  - ☁️ Cloud/DB: MongoDB, PostgreSQL, AWS, Docker<br>" +
      "Type <span class=\"command\">skills</span> outside this chat to render the full skills panel!";
  }

  if (query.includes("project") || query.includes("side project") || query.includes("deep learning") || query.includes("portfolio")) {
    return "Vashisht has built several incredible projects:<br>" +
      "  - 📱 Side Projects: F1 Race Replay, Cashistic, DevWrap<br>" +
      "  - 🧠 Deep Learning: Plant Leaf Resolution CGAN, Chest X-Ray Multi-class Classification<br>" +
      "Type <span class=\"command\">projects</span> outside this chat to select a category and view them!";
  }

  if (query.includes("colrnx") || query.includes("startup") || query.includes("company")) {
    return "Colrnx is Vashisht's AI-first startup endeavor where he builds cutting-edge AI solutions. Type <span class=\"command\">about</span> outside this chat to learn more or click the Colrnx link on his profile card!";
  }

  if (query.includes("resume") || query.includes("cv") || query.includes("pdf")) {
    return "You can view Vashisht's resume by typing <span class=\"command\">resume</span> outside this chat or clicking 'View Resume' on the profile card!";
  }

  if (query.includes("contact") || query.includes("email") || query.includes("social") || query.includes("twitter") || query.includes("linkedin") || query.includes("github")) {
    return "You can reach Vashisht via:<br>" +
      "  - 📧 Email: <a href=\"mailto:vashishtbrahmbhatt@gmail.com\">vashishtbrahmbhatt@gmail.com</a><br>" +
      "  - 🐦 Twitter: <a href=\"https://x.com/vashishtdbhere\" target=\"_blank\">x/vashishtdbhere</a><br>" +
      "  - 💼 LinkedIn: <a href=\"https://www.linkedin.com/in/vashishtdb24/\" target=\"_blank\">linkedin/vashishtdb24</a><br>" +
      "  - 🐙 GitHub: <a href=\"https://github.com/VDB24\" target=\"_blank\">github/VDB24</a><br>" +
      "Type <span class=\"command\">socials</span> outside this chat to see all links!";
  }

  if (query.includes("hello") || query.includes("hi") || query.includes("hey") || query.includes("greetings")) {
    return "Hello! How can I help you navigate Vashisht's terminal portfolio today? Ask me about his 'projects', 'skills', 'about' info, or how to view his 'resume'!";
  }

  return "I can certainly help you with navigation! To view a specific section, you can type these commands outside this chat:<br>" +
    "  - <span class=\"command\">about</span>: Show background info<br>" +
    "  - <span class=\"command\">skills</span>: Show tech stack<br>" +
    "  - <span class=\"command\">projects</span>: List portfolio projects<br>" +
    "  - <span class=\"command\">socials</span>: Find social links<br>" +
    "  - <span class=\"command\">resume</span>: Open resume PDF<br>" +
    "Or ask me another question about Vashisht's background or skills!";
}



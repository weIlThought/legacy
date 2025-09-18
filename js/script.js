const terminal = {
  input: document.getElementById("terminal-input"),
  window: document.getElementById("terminal-window"),
  history: [],
  historyIndex: -1,
  journalUnlocked: false,
  journalContent: "",
  currentLanguage: "de", // Standard ist Deutsch

  translations: {
    de: {
      help: `Verfügbare Befehle:
- help: Diese Hilfe anzeigen
- about: Über Jahmes
- skills: Technisches Profil
- contact: Kontaktinformationen
- clear: Terminal leeren
- github: GitHub-Profil öffnen
- journal: 🔐 Tagebuch anzeigen
- theme: Dark/Light Theme wechseln
- language: Sprache wechseln (Deutsch/Englisch)`,
      about:
        "Ich bin Jahmes – Hobby Programmierer mit Fokus auf Performance, Automatisierung und kreative Werkzeuge.",
      skills: "Python, JavaScript, HTML, CSS, LUA.",
      contact: `📫 GitHub: https://github.com/weilthought\n📧 Discord: j.c.`,
      unknownCommand: `Unbekannter Befehl:`,
      deactivated: "Sprache auf Deutsch gewechselt.",
      activated: "Language switched to English.",
    },
    en: {
      help: `Available commands:
- help: Show this help
- about: About Jahmes
- skills: Technical profile
- contact: Contact information
- clear: Clear terminal
- github: Open GitHub profile
- journal: 🔐 View journal
- theme: Switch Dark/Light theme
- language: Change language (German/English)`,
      about:
        "I am Jahmes – a hobby programmer focused on performance, automation, and creative tools.",
      skills: "Python, JavaScript, HTML, CSS, LUA.",
      contact: `📫 GitHub: https://github.com/weilthought\n📧 Discord: j.c.`,
      unknownCommand: `Unknown command:`,
      deactivated: "Sprache auf Deutsch gewechselt.",
      activated: "Sprache auf Englisch gewechselt.",
    },
  },

  commands: {
    help: () => ({
      type: "system",
      content: terminal.translations[terminal.currentLanguage].help,
    }),

    about: () => ({
      type: "success",
      content: terminal.translations[terminal.currentLanguage].about,
    }),

    skills: () => ({
      type: "success",
      content: terminal.translations[terminal.currentLanguage].skills,
    }),

    contact: () => ({
      type: "success",
      content: terminal.translations[terminal.currentLanguage].contact,
    }),

    clear: () => {
      terminal.window.innerHTML = "";
      return null;
    },

    github: () => {
      window.open("https://github.com/weilthought", "_blank");
      return {
        type: "system",
        content: terminal.translations[terminal.currentLanguage].github,
      };
    },

    theme: () => {
      document.body.classList.toggle("dark-theme");
      return {
        type: "system",
        content: "🎨 Theme gewechselt.",
      };
    },

    language: () => {
      // Wechsel zwischen Deutsch und Englisch
      if (terminal.currentLanguage === "de") {
        terminal.currentLanguage = "en";
        terminal.addLine(terminal.translations.en.activated, "system");
      } else {
        terminal.currentLanguage = "de";
        terminal.addLine(terminal.translations.de.deactivated, "system");
      }
    },
  },

  init() {
    this.addLine("Willkommen im Terminal von Jahmes 👨‍💻", "system");
    this.addLine(
      'Gib "help" ein für eine Liste verfügbarer Befehle.',
      "system"
    );
    this.input.addEventListener("keydown", this.handleInput.bind(this));
    this.input.addEventListener("keyup", this.handleKeyUp.bind(this));
  },

  addLine(content, type = "default") {
    const line = document.createElement("div");
    line.className = `terminal-line ${type}`;
    line.textContent = content;
    this.window.appendChild(line);
    this.window.scrollTop = this.window.scrollHeight;
  },

  handleInput(e) {
    if (e.key === "Enter") {
      const command = this.input.value.trim().toLowerCase();
      if (command) {
        this.addLine(`❯ ${command}`);
        this.history.push(command);
        this.historyIndex = this.history.length;

        if (this.commands[command]) {
          const result = this.commands[command]();
          if (result instanceof Promise) {
            result.then((r) => r && this.addLine(r.content, r.type));
          } else if (result) {
            this.addLine(result.content, result.type);
          }
        } else {
          this.addLine(
            `${
              terminal.translations[terminal.currentLanguage].unknownCommand
            }: ${command}`,
            "error"
          );
        }
      }
      this.input.value = "";
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.input.value = this.history[this.historyIndex];
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.input.value = this.history[this.historyIndex];
      } else {
        this.historyIndex = this.history.length;
        this.input.value = "";
      }
    }
  },

  handleKeyUp(e) {
    if (e.key === "Tab") {
      e.preventDefault();
      const inputVal = terminal.input.value.trim().toLowerCase();
      const matches = Object.keys(terminal.commands).filter((cmd) =>
        cmd.startsWith(inputVal)
      );
      if (matches.length === 1) {
        terminal.input.value = matches[0];
      } else if (matches.length > 1) {
        terminal.addLine("Mögliche Befehle: " + matches.join(", "), "system");
      }
    }
  },
};

// Canvas für Animationen
const canvas = document.getElementById("background-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    dx: Math.random() - 0.5,
    dy: Math.random() - 0.5,
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0, 255, 0, 0.7)";
  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

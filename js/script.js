const terminal = {
  input: document.getElementById('terminal-input'),
  window: document.getElementById('terminal-window'),
  history: [],
  historyIndex: -1,

  commands: {
    help: () => ({
      type: 'system',
      content: `Available commands:
- about: Info über Jahmes
- skills: Technische Fähigkeiten anzeigen
- contact: Kontaktlinks
- clear: Terminal leeren
- github: GitHub-Profil öffnen
- date: Aktuelles Datum/Uhrzeit anzeigen`
    }),
    about: () => ({
      type: 'success',
      content: "Hi, ich bin Jahmes – ein kreativer Entwickler mit Fokus auf Performance, Tools und Automatisierung. Schau dir meine Skills an oder connecte dich über 'contact'."
    }),
    skills: () => ({
      type: 'success',
      content: "CI/CD, Cloud, Container, Frontend ✨ – mehr auf GitHub!"
    }),
    contact: () => ({
      type: 'success',
      content: `📫 Links:
- GitHub: https://github.com/weilthought
- Discord: j.c.`
    }),
    clear: () => {
      terminal.window.innerHTML = '';
      return null;
    },
    github: () => {
      window.open('https://github.com/weilthought', '_blank');
      return {
        type: 'system',
        content: 'Opening GitHub profile...'
      };
    },
    date: () => ({
      type: 'system',
      content: new Date().toLocaleString()
    }),
    // Geheime Befehle
    'unlock': () => terminal.commands.secret(),
    secret: () => {
      document.body.classList.add("secret-mode");
      return {
        type: 'success',
        content: "✨ Geheimfunktion freigeschaltet! Du hast das versteckte Feature entdeckt!"
      };
    }
  },

  init() {
    this.addLine('Willkommen im Terminal von Jahmes 👨‍💻', 'system');
    this.addLine('Tippe "help" für Optionen', 'system');

    this.input.addEventListener('keydown', this.handleInput.bind(this));
    this.input.addEventListener('keyup', this.handleKeyUp.bind(this));
  },

  addLine(content, type = 'default') {
    const line = document.createElement('div');
    line.className = `terminal-line ${type}`;
    line.textContent = content;
    this.window.appendChild(line);
    this.window.scrollTop = this.window.scrollHeight;
  },

  handleInput(e) {
    if (e.key === 'Enter') {
      const command = this.input.value.trim().toLowerCase();

      if (command) {
        this.addLine(`❯ ${command}`);
        this.history.push(command);
        this.historyIndex = this.history.length;

        if (this.commands[command]) {
          const result = this.commands[command]();
          if (result) {
            this.addLine(result.content, result.type);
          }
        } else {
          this.addLine(`Unbekannter Befehl: ${command}`, 'error');
        }
      }

      this.input.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.input.value = this.history[this.historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.input.value = this.history[this.historyIndex];
      } else {
        this.historyIndex = this.history.length;
        this.input.value = '';
      }
    }
  },
};

// Tab-Autocomplete (Fix: inputVal statt input)
terminal.handleKeyUp = function (e) {
  if (e.key === 'Tab') {
    e.preventDefault();
    const inputVal = terminal.input.value.trim().toLowerCase();
    const matches = Object.keys(terminal.commands).filter(cmd => cmd.startsWith(inputVal));
    if (matches.length === 1) {
      terminal.input.value = matches[0];
    } else if (matches.length > 1) {
      terminal.addLine('Mögliche Befehle: ' + matches.join(', '), 'system');
    }
  }
};

// Zusätzliche geheime Befehle
terminal.commands.secret2 = () => {
  const phrases = [
    "Access granted. Welcome back, Operator.",
    "Root access unlocked. Proceed with caution.",
    "✨ Du hast den geheimen Pfad betreten.",
    "🤖 KI-Modus aktiviert.",
    "🕶️ Welcome to the matrix."
  ];
  const random = phrases[Math.floor(Math.random() * phrases.length)];
  return {
    type: 'success',
    content: random
  };
};

terminal.commands.secret3 = () => {
  document.body.classList.add("matrix-effect");
  setTimeout(() => {
    document.body.classList.remove("matrix-effect");
  }, 5000);
  return {
    type: 'success',
    content: "💥 Matrix aktiviert (5 Sekunden)!"
  };
};

terminal.commands.theme = () => {
  document.body.classList.toggle("dark-theme");
  return {
    type: 'system',
    content: "🎨 Theme gewechselt!"
  };
};

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Partikel-Hintergrund
const canvas = document.getElementById("background-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for (let i = 0; i < 100; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    dx: Math.random() - 0.5,
    dy: Math.random() - 0.5
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

// Terminal starten
window.addEventListener("DOMContentLoaded", () => {
  terminal.init();
});

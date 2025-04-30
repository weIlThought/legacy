const terminal = {
  input: document.getElementById('terminal-input'),
  window: document.getElementById('terminal-window'),
  history: [],
  historyIndex: -1,
  journalUnlocked: false,
  journalContent: '',

  commands: {
    help: () => ({
      type: 'system',
      content: `Verfügbare Befehle:
- help: Diese Hilfe anzeigen
- about: Über Jahmes
- skills: Technisches Profil
- contact: Kontaktinformationen
- clear: Terminal leeren
- github: GitHub-Profil öffnen
- journal: 🔐 Tagebuch anzeigen (Passwort nötig)
- theme: Dark/Light Theme wechseln`
    }),

    about: () => ({
      type: 'success',
      content: "Ich bin Jahmes – Hobby Programmierer mit Fokus auf Performance, Automatisierung und kreative Werkzeuge."
    }),

    skills: () => ({
      type: 'success',
      content: "Python, JavaScript, HTML, CSS, LUA."
    }),

    contact: () => ({
      type: 'success',
      content: `📫 GitHub: https://github.com/weilthought\n📧 Discord: j.c.`
    }),

    clear: () => {
      terminal.window.innerHTML = '';
      return null;
    },

    github: () => {
      window.open('https://github.com/weilthought', '_blank');
      return {
        type: 'system',
        content: 'Öffne GitHub-Profil...'
      };
    },

    theme: () => {
      document.body.classList.toggle("dark-theme");
      return {
        type: 'system',
        content: "🎨 Theme gewechselt."
      };
    },

    journal: async () => {
      if (terminal.journalUnlocked) {
        return {
          type: 'success',
          content: terminal.journalContent
        };
      }

      const password = prompt("🔐 Bitte Passwort für Tagebuch eingeben:");
      if (!password) return { type: 'error', content: 'Kein Passwort eingegeben.' };

      terminal.addLine('⏳ Entschlüsselung läuft...', 'system');
      try {
        const res = await fetch('journal.encrypted');
        const encryptedBase64 = await res.text();
        const content = await decryptData(encryptedBase64, password);
        terminal.journalUnlocked = true;
        terminal.journalContent = content;
        return {
          type: 'success',
          content: content
        };
      } catch (e) {
        return { type: 'error', content: '❌ Entschlüsselung fehlgeschlagen.' };
      }
    }
  },

  init() {
    this.addLine('Willkommen im Terminal von Jahmes 👨‍💻', 'system');
    this.addLine('Gib "help" ein für eine Liste verfügbarer Befehle.', 'system');
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
          if (result instanceof Promise) {
            result.then(r => r && this.addLine(r.content, r.type));
          } else if (result) {
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

  handleKeyUp(e) {
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
  }
};

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

window.addEventListener("DOMContentLoaded", () => {
  terminal.init();
});

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

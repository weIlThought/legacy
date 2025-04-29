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
- GitHub: https://github.com/jahmes
- Discord: jahmes.dev`
    }),
    clear: () => {
      terminal.window.innerHTML = '';
      return null;
    },
    github: () => {
      window.open('https://github.com/jahmes', '_blank');
      return {
        type: 'system',
        content: 'Opening GitHub profile...'
      };
    },
    date: () => ({
      type: 'system',
      content: new Date().toLocaleString()
    })
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

  handleKeyUp(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
    }
  }
};
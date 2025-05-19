const MatchCard = {
    cards: [],
    flipped: [],
    matched: [],
    wrong: 0,
    maxWrong: 5,

    start() {
        this.reset();
    },

    reset() {
        this.cards = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H']
            .sort(() => Math.random() - 0.5);
        this.flipped = [];
        this.matched = [];
        this.wrong = 0;
        document.getElementById('match-wrong').textContent = this.wrong;
        document.getElementById('match-card-congrats').classList.remove('active');
        document.getElementById('match-card-game-over').classList.remove('active');
        this.render();
    },

    render() {
        const grid = document.getElementById('card-grid');
        grid.innerHTML = '';
        this.cards.forEach((card, i) => {
            const div = document.createElement('div');
            div.className = 'memory-card';
            div.textContent = this.flipped.includes(i) || this.matched.includes(i) ? card : ' ';
            if (this.flipped.includes(i) || this.matched.includes(i)) div.classList.add('flipped');
            div.onclick = () => this.flip(i);
            grid.appendChild(div);
        });
    },

    flip(index) {
        if (this.flipped.length < 2 && !this.flipped.includes(index) && !this.matched.includes(index)) {
            this.flipped.push(index);
            this.render();
            if (this.flipped.length === 2) {
                setTimeout(() => {
                    const [i1, i2] = this.flipped;
                    if (this.cards[i1] === this.cards[i2]) {
                        this.matched.push(i1, i2);
                        if (this.matched.length === this.cards.length) {
                            document.getElementById('match-card-congrats').classList.add('active');
                        }
                    } else {
                        this.wrong++;
                        document.getElementById('match-wrong').textContent = this.wrong;
                        if (this.wrong >= this.maxWrong) {
                            document.getElementById('match-card-game-over').classList.add('active');
                        }
                    }
                    this.flipped = [];
                    this.render();
                }, 500);
            }
        }
    }
};

const TicTacToe = {
    board: Array(9).fill(''),
    currentPlayer: 'X',
    gameOver: false,

    start() {
        this.reset();
    },

    reset() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameOver = false;
        document.getElementById('tic-tac-toe-status').textContent = "Player X's Turn";
        document.getElementById('tic-tac-toe-congrats').classList.remove('active');
        this.render();
    },

    render() {
        const grid = document.getElementById('tic-tac-toe-grid');
        grid.innerHTML = '';
        this.board.forEach((cell, i) => {
            const div = document.createElement('div');
            div.className = 'tic-tac-toe-cell';
            div.textContent = cell;
            div.onclick = () => this.move(i);
            grid.appendChild(div);
        });
    },

    move(index) {
        if (!this.board[index] && !this.gameOver) {
            this.board[index] = this.currentPlayer;
            if (this.checkWin()) {
                document.getElementById('tic-tac-toe-congrats-text').textContent = `Player ${this.currentPlayer} Wins!`;
                document.getElementById('tic-tac-toe-congrats').classList.add('active');
                this.gameOver = true;
            } else if (this.board.every(cell => cell)) {
                document.getElementById('tic-tac-toe-congrats-text').textContent = "It's a Tie!";
                document.getElementById('tic-tac-toe-congrats').classList.add('active');
                this.gameOver = true;
            } else {
                this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
                document.getElementById('tic-tac-toe-status').textContent = `Player ${this.currentPlayer}'s Turn`;
                if (this.currentPlayer === 'O') {
                    setTimeout(() => this.aiMove(), 500);
                }
            }
            this.render();
        }
    },

    checkWin() {
        const wins = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
        return wins.some(combo => combo.every(i => this.board[i] === this.currentPlayer));
    },

    aiMove() {
        const empty = this.board.map((cell, i) => cell ? null : i).filter(i => i !== null);
        if (empty.length) {
            const move = empty[Math.floor(Math.random() * empty.length)];
            this.move(move);
        }
    }
};

const MissingWords = {
    sentences: [
        {
            text: ['The', '', 'flies', 'to', 'the', '', '.'],
            correct: ['rocket', 'moon'],
            options: [['rocket', 'car', 'plane'], ['moon', 'sun', 'star']]
        },
        {
            text: ['A', '', 'orbits', 'the', '', '.'],
            correct: ['planet', 'star'],
            options: [['planet', 'cloud', 'comet'], ['star', 'moon', 'sky']]
        }
    ],
    current: 0,
    attempts: 0,
    maxAttempts: 3,

    start() {
        this.reset();
    },

    reset() {
        this.current = Math.floor(Math.random() * this.sentences.length);
        this.attempts = 0;
        document.getElementById('missing-attempts').textContent = this.attempts;
        document.getElementById('missing-words-congrats').classList.remove('active');
        document.getElementById('missing-words-game-over').classList.remove('active');
        this.render();
    },

    render() {
        const sentence = document.getElementById('missing-words-sentence');
        sentence.innerHTML = '';
        const currentSentence = this.sentences[this.current];
        let optionIndex = 0;
        currentSentence.text.forEach(word => {
            if (word) {
                const span = document.createElement('span');
                span.textContent = word + ' ';
                sentence.appendChild(span);
            } else {
                const select = document.createElement('select');
                select.innerHTML = '<option value="">Select</option>';
                currentSentence.options[optionIndex].forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt;
                    option.textContent = opt;
                    select.appendChild(option);
                });
                sentence.appendChild(select);
                optionIndex++;
            }
        });
    },

    check() {
        const selects = document.getElementById('missing-words-sentence').querySelectorAll('select');
        const answers = Array.from(selects).map(s => s.value);
        const correct = this.sentences[this.current].correct;
        if (answers.every((ans, i) => ans === correct[i])) {
            document.getElementById('missing-words-congrats').classList.add('active');
        } else {
            this.attempts++;
            document.getElementById('missing-attempts').textContent = this.attempts;
            if (this.attempts >= this.maxAttempts) {
                document.getElementById('missing-words-game-over').classList.add('active');
            }
        }
    }
};

const WordSearch = {
    words: ['PLANET', 'ROCKET', 'STAR', 'MOON', 'GALAXY'],
    grid: [],
    selected: [],
    found: [],
    attempts: 0,
    maxAttempts: 5,

    start() {
        this.reset();
    },

    reset() {
        this.grid = Array(10).fill().map(() => Array(10).fill().map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))));
        this.words.forEach(word => {
            let placed = false;
            let attempts = 0;
            while (!placed && attempts < 10) {
                attempts++;
                const row = Math.floor(Math.random() * 10);
                const col = Math.floor(Math.random() * (10 - word.length));
                if (col + word.length <= 10) {
                    let canPlace = true;
                    for (let i = 0; i < word.length; i++) {
                        if (this.grid[row][col + i] !== word[i] && this.grid[row][col + i] !== '.') {
                            canPlace = false;
                            break;
                        }
                    }
                    if (canPlace) {
                        for (let i = 0; i < word.length; i++) {
                            this.grid[row][col + i] = word[i];
                        }
                        placed = true;
                    }
                }
            }
        });
        this.selected = [];
        this.found = [];
        this.attempts = 0;
        document.getElementById('word-search-attempts').textContent = this.attempts;
        document.getElementById('word-search-congrats').classList.remove('active');
        document.getElementById('word-search-game-over').classList.remove('active');
        this.render();
    },

    render() {
        const grid = document.getElementById('word-search-grid');
        grid.innerHTML = '';
        this.grid.forEach((row, i) => {
            row.forEach((cell, j) => {
                const div = document.createElement('div');
                div.className = 'word-search-cell';
                if (this.selected.some(([r, c]) => r === i && c === j)) div.classList.add('selected');
                if (this.found.includes(cell)) div.classList.add('found');
                div.textContent = cell;
                div.onclick = () => this.select(i, j);
                grid.appendChild(div);
            });
        });
    },

    select(row, col) {
        if (this.selected.length === 0 || this.selected[this.selected.length - 1][0] === row) {
            this.selected.push([row, col]);
            this.render();
        }
    },

    check() {
        const word = this.selected.map(([r, c]) => this.grid[r][c]).join('');
        if (this.words.includes(word) && !this.found.includes(word)) {
            this.found.push(word);
            this.selected = [];
            if (this.found.length === this.words.length) {
                document.getElementById('word-search-congrats').classList.add('active');
            }
        } else {
            this.attempts++;
            document.getElementById('word-search-attempts').textContent = this.attempts;
            if (this.attempts >= this.maxAttempts) {
                document.getElementById('word-search-game-over').classList.add('active');
            }
            this.selected = [];
        }
        this.render();
    }
};

const Snake = {
    body: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    dx: 0,
    dy: 0,
    score: 0,
    gameLoop: null,
    isMoving: false,
    baseSpeed: 100,
    speed: 100,
    maxSpeed: 50,
    audioContext: null,

    start() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        this.body = [{ x: 10, y: 10 }];
        this.food = { x: 15, y: 15 };
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.speed = this.baseSpeed;
        this.isMoving = false;
        document.getElementById('snake-score').textContent = this.score;
        document.getElementById('snake-progress-bar').style.width = '0%';
        document.getElementById('snake-congrats').classList.remove('active');
        document.getElementById('snake-game-over').classList.remove('active');
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        document.addEventListener('keydown', this.handleMove.bind(this));
        this.render();
        this.gameLoop = setInterval(this.update.bind(this), this.speed);
    },

    reset() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        this.body = [{ x: 10, y: 10 }];
        this.food = { x: 15, y: 15 };
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.speed = this.baseSpeed;
        this.isMoving = false;
        document.getElementById('snake-score').textContent = this.score;
        document.getElementById('snake-progress-bar').style.width = '0%';
        document.getElementById('snake-congrats').classList.remove('active');
        document.getElementById('snake-game-over').classList.remove('active');
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        document.removeEventListener('keydown', this.handleMove.bind(this));
        const canvas = document.getElementById('snake-canvas');
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.render();
    },

    playSound(frequency, duration) {
        if (!this.audioContext) return;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    },

    render() {
        const canvas = document.getElementById('snake-canvas');
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        for (let i = 0; i < 50; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        for (let x = 0; x < canvas.width; x += 25) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 25) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        this.body.forEach((segment, i) => {
            ctx.beginPath();
            const gradient = ctx.createRadialGradient(
                segment.x * 25 + 12.5, segment.y * 25 + 12.5, 2,
                segment.x * 25 + 12.5, segment.y * 25 + 12.5, 10
            );
            gradient.addColorStop(0, '#00ff00');
            gradient.addColorStop(1, '#006600');
            ctx.fillStyle = gradient;
            ctx.arc(segment.x * 25 + 12.5, segment.y * 25 + 12.5, 10, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        const fx = this.food.x * 25 + 12.5;
        const fy = this.food.y * 25 + 12.5;
        for (let i = 0; i < 10; i++) {
            const angle = (i * Math.PI) / 5;
            const radius = i % 2 === 0 ? 8 : 4;
            ctx.lineTo(
                fx + radius * Math.cos(angle),
                fy + radius * Math.sin(angle)
            );
        }
        ctx.closePath();
        ctx.fill();
    },

    handleMove(event) {
        if (this.isMoving) return;
        this.isMoving = true;
        event.preventDefault();
        if (event.key === 'ArrowUp' && this.dy === 0) {
            this.dx = 0;
            this.dy = -1;
        } else if (event.key === 'ArrowDown' && this.dy === 0) {
            this.dx = 0;
            this.dy = 1;
        } else if (event.key === 'ArrowLeft' && this.dx === 0) {
            this.dx = -1;
            this.dy = 0;
        } else if (event.key === 'ArrowRight' && this.dx === 0) {
            this.dx = 1;
            this.dy = 0;
        }
    },

    update() {
        this.isMoving = false;
        if (this.dx === 0 && this.dy === 0) return;

        let head = { x: this.body[0].x + this.dx, y: this.body[0].y + this.dy };
        if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 ||
            this.body.some(segment => segment.x === head.x && segment.y === head.y)) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
            document.getElementById('snake-game-over').classList.add('active');
            this.playSound(200, 0.5);
            document.removeEventListener('keydown', this.handleMove.bind(this));
            return;
        }

        this.body.unshift(head);
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score++;
            document.getElementById('snake-score').textContent = this.score;
            document.getElementById('snake-progress-bar').style.width = `${(this.score / 20) * 100}%`;
            this.playSound(800, 0.2);
            do {
                this.food = {
                    x: Math.floor(Math.random() * 20),
                    y: Math.floor(Math.random() * 20)
                };
            } while (this.body.some(segment => segment.x === this.food.x && segment.y === this.food.y));
            this.speed = Math.max(this.maxSpeed, this.speed - 5);
            clearInterval(this.gameLoop);
            this.gameLoop = setInterval(this.update.bind(this), this.speed);
            if (this.score >= 20) {
                clearInterval(this.gameLoop);
                this.gameLoop = null;
                document.getElementById('snake-congrats').classList.add('active');
                document.removeEventListener('keydown', this.handleMove.bind(this));
                return;
            }
        } else {
            this.body.pop();
        }
        this.render();
    }
};

const BrickBreaker = {
    ball: { x: 200, y: 450, dx: 2, dy: -2, radius: 6 },
    paddle: { x: 180, width: 60, height: 10 },
    bricks: [],
    lives: 3,
    gameLoop: null,
    audioContext: null,

    start() {
        this.reset();
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.gameLoop = setInterval(this.update.bind(this), 1000 / 60);
    },

    reset() {
        this.ball = { x: 200, y: 450, dx: 2, dy: -2, radius: 6 };
        this.paddle = { x: 180, width: 60, height: 10 };
        this.bricks = Array(3).fill().map((_, i) => Array(5).fill().map((_, j) => ({ x: j * 80 + 10, y: i * 20 + 20, width: 70, height: 15 })));
        this.lives = 3;
        document.getElementById('brick-breaker-lives').textContent = this.lives;
        document.getElementById('brick-breaker-congrats').classList.remove('active');
        document.getElementById('brick-breaker-game-over').classList.remove('active');
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        const canvas = document.getElementById('brick-breaker-canvas');
        canvas.onmousemove = e => {
            const rect = canvas.getBoundingClientRect();
            this.paddle.x = e.clientX - rect.left - this.paddle.width / 2;
            if (this.paddle.x < 0) this.paddle.x = 0;
            if (this.paddle.x > canvas.width - this.paddle.width) this.paddle.x = canvas.width - this.paddle.width;
        };
        canvas.onmouseleave = () => {
            canvas.onmousemove = null;
        };
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.render();
    },

    playSound(frequency, duration) {
        if (!this.audioContext) return;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    },

    render() {
        const canvas = document.getElementById('brick-breaker-canvas');
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        for (let i = 0; i < 50; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#00cc00';
        ctx.fillRect(this.paddle.x, canvas.height - this.paddle.height, this.paddle.width, this.paddle.height);
        ctx.fillStyle = '#333';
        this.bricks.forEach(row => {
            row.forEach(brick => {
                if (brick) {
                    ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
                }
            });
        });
    },

    update() {
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        if (this.ball.x + this.ball.radius > 400 || this.ball.x - this.ball.radius < 0) {
            this.ball.dx *= -1;
            this.playSound(600, 0.1);
        }
        if (this.ball.y - this.ball.radius < 0) {
            this.ball.dy *= -1;
            this.playSound(600, 0.1);
        }
        if (this.ball.y + this.ball.radius > 500 - this.paddle.height &&
            this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddle.width) {
            this.ball.dy *= -1;
            this.playSound(800, 0.1);
        }
        if (this.ball.y + this.ball.radius > 500) {
            this.lives--;
            document.getElementById('brick-breaker-lives').textContent = this.lives;
            this.ball = { x: 200, y: 450, dx: 2, dy: -2, radius: 6 };
            this.playSound(200, 0.5);
            if (this.lives <= 0) {
                clearInterval(this.gameLoop);
                this.gameLoop = null;
                document.getElementById('brick-breaker-game-over').classList.add('active');
                return;
            }
        }
        this.bricks.forEach(row => {
            row.forEach((brick, j) => {
                if (brick && this.ball.x > brick.x && this.ball.x < brick.x + brick.width &&
                    this.ball.y > brick.y && this.ball.y < brick.y + brick.height) {
                    row[j] = null;
                    this.ball.dy *= -1;
                    this.playSound(1000, 0.1);
                }
            });
        });
        if (this.bricks.every(row => row.every(brick => !brick))) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
            document.getElementById('brick-breaker-congrats').classList.add('active');
            return;
        }
        this.render();
    }
};

const SpaceInvaders = {
    player: { x: 250, y: 450, width: 30, height: 20 },
    aliens: [],
    bullets: [],
    score: 0,
    gameLoop: null,
    moveLeft: false,
    moveRight: false,
    shoot: false,
    audioContext: null,

    start() {
        this.reset();
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.gameLoop = setInterval(this.update.bind(this), 1000 / 60);
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    },

    reset() {
        this.player = { x: 250, y: 450, width: 30, height: 20 };
        this.aliens = Array(3).fill().map((_, i) => Array(5).fill().map((_, j) => ({
            x: j * 80 + 50,
            y: i * 50 + 50,
            width: 30,
            height: 20
        })));
        this.bullets = [];
        this.score = 0;
        this.moveLeft = false;
        this.moveRight = false;
        this.shoot = false;
        document.getElementById('space-invaders-score').textContent = this.score;
        document.getElementById('space-invaders-congrats').classList.remove('active');
        document.getElementById('space-invaders-game-over').classList.remove('active');
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
        document.removeEventListener('keyup', this.handleKeyUp.bind(this));
        const canvas = document.getElementById('space-invaders-canvas');
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.render();
    },

    playSound(frequency, duration) {
        if (!this.audioContext) return;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    },

    render() {
        const canvas = document.getElementById('space-invaders-canvas');
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        for (let i = 0; i < 50; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = '#00cc00';
        ctx.beginPath();
        ctx.moveTo(this.player.x, this.player.y);
        ctx.lineTo(this.player.x + this.player.width, this.player.y + this.player.height);
        ctx.lineTo(this.player.x - this.player.width, this.player.y + this.player.height);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ff4444';
        this.aliens.forEach(row => {
            row.forEach(alien => {
                if (alien) {
                    ctx.beginPath();
                    ctx.arc(alien.x, alien.y, alien.width / 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
        });

        ctx.fillStyle = '#ffffff';
        this.bullets.forEach(bullet => {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
    },

    handleKeyDown(event) {
        if (event.key === 'ArrowLeft') this.moveLeft = true;
        if (event.key === 'ArrowRight') this.moveRight = true;
        if (event.key === ' ') this.shoot = true;
    },

    handleKeyUp(event) {
        if (event.key === 'ArrowLeft') this.moveLeft = false;
        if (event.key === 'ArrowRight') this.moveRight = false;
        if (event.key === ' ') this.shoot = false;
    },

    update() {
        if (this.moveLeft && this.player.x - this.player.width > 0) this.player.x -= 5;
        if (this.moveRight && this.player.x + this.player.width < 500) this.player.x += 5;
        if (this.shoot && !this.bullets.some(b => b.y > 400)) {
            this.bullets.push({ x: this.player.x, y: this.player.y - 10, width: 4, height: 10, dy: -8 });
            this.playSound(1200, 0.1);
        }

        this.bullets.forEach(bullet => bullet.y += bullet.dy);
        this.bullets = this.bullets.filter(bullet => bullet.y > 0);

        let direction = 1;
        let moveDown = false;
        this.aliens.forEach(row => {
            row.forEach(alien => {
                if (alien && (alien.x + alien.width > 500 || alien.x - alien.width < 0)) {
                    direction = -direction;
                    moveDown = true;
                }
            });
        });

        this.aliens.forEach(row => {
            row.forEach(alien => {
                if (alien) {
                    alien.x += direction * 2;
                    if (moveDown) alien.y += 20;
                }
            });
        });

        this.bullets.forEach((bullet, bIndex) => {
            this.aliens.forEach((row, rIndex) => {
                row.forEach((alien, aIndex) => {
                    if (alien &&
                        bullet.x > alien.x - alien.width &&
                        bullet.x < alien.x + alien.width &&
                        bullet.y > alien.y - alien.height &&
                        bullet.y < alien.y + alien.height) {
                        this.aliens[rIndex][aIndex] = null;
                        this.bullets.splice(bIndex, 1);
                        this.score += 10;
                        document.getElementById('space-invaders-score').textContent = this.score;
                        this.playSound(1000, 0.1);
                    }
                });
            });
        });

        if (this.aliens.every(row => row.every(alien => !alien))) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
            document.getElementById('space-invaders-congrats').classList.add('active');
            document.removeEventListener('keydown', this.handleKeyDown.bind(this));
            document.removeEventListener('keyup', this.handleKeyUp.bind(this));
            return;
        }

        if (this.aliens.some(row => row.some(alien => alien && alien.y + alien.height > 450))) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
            document.getElementById('space-invaders-game-over').classList.add('active');
            this.playSound(200, 0.5);
            document.removeEventListener('keydown', this.handleKeyDown.bind(this));
            document.removeEventListener('keyup', this.handleKeyUp.bind(this));
            return;
        }

        this.render();
    }
};

const MazeRunner = {
    maze: [],
    player: { x: 0, y: 0 },
    goal: { x: 9, y: 9 },
    moves: 0,
    maxMoves: 50,
    keyListener: null,

    start() {
        this.reset();
        this.keyListener = this.move.bind(this);
        document.addEventListener('keydown', this.keyListener);
    },

    reset() {
        this.maze = [
            [0,0,1,1,1,1,1,1,1,1],
            [1,0,0,0,1,0,0,0,1,1],
            [1,1,1,0,1,0,1,0,0,1],
            [1,0,0,0,0,0,1,1,0,1],
            [1,0,1,1,1,0,0,0,0,1],
            [1,0,0,0,1,1,1,1,0,1],
            [1,1,1,0,0,0,0,1,0,1],
            [1,0,0,0,1,1,0,0,0,1],
            [1,0,1,0,0,0,1,1,0,0],
            [1,1,1,1,1,1,1,1,0,0]
        ];
        this.player = { x: 0, y: 0 };
        this.moves = 0;
        document.getElementById('maze-moves').textContent = this.moves;
        document.getElementById('maze-runner-congrats').classList.remove('active');
        document.getElementById('maze-runner-game-over').classList.remove('active');
        if (this.keyListener) {
            document.removeEventListener('keydown', this.keyListener);
            this.keyListener = null;
        }
        this.render();
    },

    render() {
        const grid = document.getElementById('maze-grid');
        grid.innerHTML = '';
        this.maze.forEach((row, i) => {
            row.forEach((cell, j) => {
                const div = document.createElement('div');
                div.className = 'maze-cell';
                if (cell) {
                    div.classList.add('maze-wall');
                } else {
                    div.classList.add('maze-path');
                    if (i === this.player.y && j === this.player.x) {
                        div.classList.add('maze-player');
                    } else if (i === this.goal.y && j === this.goal.x) {
                        div.classList.add('maze-goal');
                    }
                }
                grid.appendChild(div);
            });
        });
    },

    move(event) {
        const moves = {
            'ArrowUp': [0, -1],
            'ArrowDown': [0, 1],
            'ArrowLeft': [-1, 0],
            'ArrowRight': [1, 0]
        };
        if (moves[event.key]) {
            const [dx, dy] = moves[event.key];
            const newX = this.player.x + dx;
            const newY = this.player.y + dy;
            if (newX >= 0 && newX < 10 && newY >= 0 && newY < 10 && !this.maze[newY][newX]) {
                this.player.x = newX;
                this.player.y = newY;
                this.moves++;
                document.getElementById('maze-moves').textContent = this.moves;
                if (this.player.x === this.goal.x && this.player.y === this.goal.y) {
                    document.getElementById('maze-runner-congrats').classList.add('active');
                    if (this.keyListener) {
                        document.removeEventListener('keydown', this.keyListener);
                        this.keyListener = null;
                    }
                } else if (this.moves >= this.maxMoves) {
                    document.getElementById('maze-runner-game-over').classList.add('active');
                    if (this.keyListener) {
                        document.removeEventListener('keydown', this.keyListener);
                        this.keyListener = null;
                    }
                }
                this.render();
            }
        }
    }
};

let activeGameId = null;

function showGame(gameId) {
    closeGame();
    const overlay = document.getElementById('overlay');
    const dialog = document.getElementById(gameId);
    if (overlay && dialog) {
        overlay.classList.add('active');
        dialog.classList.add('active');
        activeGameId = gameId;
    }
    const games = {
        'match-card': MatchCard,
        'tic-tac-toe': TicTacToe,
        'missing-words': MissingWords,
        'word-search': WordSearch,
        'snake': Snake,
        'brick-breaker': BrickBreaker,
        'space-invaders': SpaceInvaders,
        'maze-runner': MazeRunner
    };
    if (games[gameId]) {
        games[gameId].reset();
    }
}

function closeGame() {
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
    document.querySelectorAll('.dialog-box').forEach(dialog => {
        dialog.classList.remove('active');
        dialog.querySelectorAll('.congrats-message, .game-over-message').forEach(msg => {
            msg.classList.remove('active');
        });
    });
    const games = {
        'match-card': MatchCard,
        'tic-tac-toe': TicTacToe,
        'missing-words': MissingWords,
        'word-search': WordSearch,
        'snake': Snake,
        'brick-breaker': BrickBreaker,
        'space-invaders': SpaceInvaders,
        'maze-runner': MazeRunner
    };
    if (activeGameId && games[activeGameId]) {
        games[activeGameId].reset();
    }
    activeGameId = null;
}
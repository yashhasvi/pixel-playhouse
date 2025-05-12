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

const PuzzleSlider = {
    tiles: [],
    moves: 0,
    maxMoves: 50,

    start() {
        this.reset();
    },

    reset() {
        this.tiles = [1, 2, 3, 4, 5, 6, 7, 8, 0];
        for (let i = 0; i < 50; i++) {
            const empty = this.tiles.indexOf(0);
            const moves = [[1,3], [0,2,4], [1,5], [0,4,6], [1,3,5,7], [2,4,8], [3,7], [4,6,8], [5,7]][empty];
            const move = moves[Math.floor(Math.random() * moves.length)];
            [this.tiles[empty], this.tiles[move]] = [this.tiles[move], this.tiles[empty]];
        }
        this.moves = 0;
        document.getElementById('puzzle-moves').textContent = this.moves;
        document.getElementById('puzzle-slider-congrats').classList.remove('active');
        document.getElementById('puzzle-slider-game-over').classList.remove('active');
        this.render();
    },

    render() {
        const grid = document.getElementById('puzzle-grid');
        grid.innerHTML = '';
        this.tiles.forEach((tile, i) => {
            const div = document.createElement('div');
            div.className = 'puzzle-tile';
            div.textContent = tile || '';
            if (tile) div.onclick = () => this.move(i);
            grid.appendChild(div);
        });
    },

    move(index) {
        const empty = this.tiles.indexOf(0);
        const moves = [[1,3], [0,2,4], [1,5], [0,4,6], [1,3,5,7], [2,4,8], [3,7], [4,6,8], [5,7]];
        if (moves[empty].includes(index)) {
            [this.tiles[empty], this.tiles[index]] = [this.tiles[index], this.tiles[empty]];
            this.moves++;
            document.getElementById('puzzle-moves').textContent = this.moves;
            if (this.tiles.join() === '1,2,3,4,5,6,7,8,0') {
                document.getElementById('puzzle-slider-congrats').classList.add('active');
            } else if (this.moves >= this.maxMoves) {
                document.getElementById('puzzle-slider-game-over').classList.add('active');
            }
            this.render();
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

    start() {
        // Clear any existing game loop
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        // Reset state
        this.body = [{ x: 10, y: 10 }];
        this.food = { x: 15, y: 15 };
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.isMoving = false;
        document.getElementById('snake-score').textContent = this.score;
        document.getElementById('snake-congrats').classList.remove('active');
        document.getElementById('snake-game-over').classList.remove('active');
        // Add key listener
        document.addEventListener('keydown', this.handleMove.bind(this));
        // Render initial state
        this.render();
        // Start game loop
        this.gameLoop = setInterval(this.update.bind(this), 100);
    },

    reset() {
        // Clear game loop
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        // Reset state
        this.body = [{ x: 10, y: 10 }];
        this.food = { x: 15, y: 15 };
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.isMoving = false;
        document.getElementById('snake-score').textContent = this.score;
        document.getElementById('snake-congrats').classList.remove('active');
        document.getElementById('snake-game-over').classList.remove('active');
        // Remove key listener
        document.removeEventListener('keydown', this.handleMove.bind(this));
        // Clear and render canvas
        const canvas = document.getElementById('snake-canvas');
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.render();
    },

    render() {
        const canvas = document.getElementById('snake-canvas');
        const ctx = canvas.getContext('2d');
        // Clear canvas
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw grid
        ctx.strokeStyle = 'rgba(0, 51, 0, 0.5)';
        for (let x = 0; x < canvas.width; x += 15) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 15) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        // Draw snake
        for (let segment of this.body) {
            ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
            ctx.fillRect(segment.x * 15, segment.y * 15, 14, 14);
        }
        // Draw food
        ctx.fillStyle = 'rgba(57, 255, 20, 0.7)';
        ctx.fillRect(this.food.x * 15, this.food.y * 15, 14, 14);
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
        // Skip update if no movement
        if (this.dx === 0 && this.dy === 0) {
            return;
        }
        // Move snake
        let head = { x: this.body[0].x + this.dx, y: this.body[0].y + this.dy };
        // Check collisions
        if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 ||
            this.body.some(segment => segment.x === head.x && segment.y === head.y)) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
            document.getElementById('snake-game-over').classList.add('active');
            document.removeEventListener('keydown', this.handleMove.bind(this));
            return;
        }
        this.body.unshift(head);
        // Check food
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score++;
            document.getElementById('snake-score').textContent = this.score;
            do {
                this.food = {
                    x: Math.floor(Math.random() * 20),
                    y: Math.floor(Math.random() * 20)
                };
            } while (this.body.some(segment => segment.x === this.food.x && segment.y === this.food.y));
            if (this.score >= 10) {
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

const TriviaQuiz = {
    questions: [
        { question: 'What is the largest planet?', answer: 'Jupiter', options: ['Mars', 'Jupiter', 'Earth', 'Venus'] },
        { question: 'What is the closest star to Earth?', answer: 'Sun', options: ['Sun', 'Proxima Centauri', 'Sirius', 'Betelgeuse'] },
        { question: 'Which planet has rings?', answer: 'Saturn', options: ['Saturn', 'Mercury', 'Neptune', 'Jupiter'] }
    ],
    current: 0,
    score: 0,
    wrong: 0,
    maxWrong: 3,

    start() {
        this.reset();
    },

    reset() {
        this.current = 0;
        this.score = 0;
        this.wrong = 0;
        document.getElementById('trivia-score').textContent = this.score;
        document.getElementById('trivia-quiz-congrats').classList.remove('active');
        document.getElementById('trivia-quiz-game-over').classList.remove('active');
        this.render();
    },

    render() {
        const question = document.getElementById('trivia-question');
        const options = document.getElementById('trivia-options');
        if (this.current < this.questions.length) {
            question.textContent = this.questions[this.current].question;
            options.innerHTML = '';
            this.questions[this.current].options.forEach(opt => {
                const button = document.createElement('button');
                button.className = 'action-button';
                button.textContent = opt;
                button.onclick = () => this.answer(opt);
                options.appendChild(button);
            });
        } else {
            question.textContent = '';
            options.innerHTML = '';
        }
    },

    answer(option) {
        if (option === this.questions[this.current].answer) {
            this.score++;
            document.getElementById('trivia-score').textContent = this.score;
            this.current++;
            if (this.current >= this.questions.length) {
                document.getElementById('trivia-quiz-congrats').classList.add('active');
            } else {
                this.render();
            }
        } else {
            this.wrong++;
            if (this.wrong >= this.maxWrong) {
                document.getElementById('trivia-quiz-game-over').classList.add('active');
            }
        }
    }
};

const ColorMatch = {
    target: [],
    grid: [],
    attempts: 0,
    maxAttempts: 10,

    start() {
        this.reset();
    },

    reset() {
        this.target = Array(9).fill().map(() => ['red', 'green', 'blue'][Math.floor(Math.random() * 3)]);
        this.grid = Array(9).fill('gray');
        this.attempts = 0;
        document.getElementById('color-match-attempts').textContent = this.attempts;
        document.getElementById('color-match-congrats').classList.remove('active');
        document.getElementById('color-match-game-over').classList.remove('active');
        this.render();
    },

    render() {
        const target = document.getElementById('color-match-target');
        target.innerHTML = '';
        this.target.forEach(color => {
            const div = document.createElement('div');
            div.className = 'color-match-tile';
            div.style.backgroundColor = color;
            target.appendChild(div);
        });
        const grid = document.getElementById('color-match-grid');
        grid.innerHTML = '';
        this.grid.forEach((color, i) => {
            const div = document.createElement('div');
            div.className = 'color-match-tile';
            div.style.backgroundColor = color;
            div.onclick = () => this.cycleColor(i);
            grid.appendChild(div);
        });
    },

    cycleColor(index) {
        const colors = ['gray', 'red', 'green', 'blue'];
        this.grid[index] = colors[(colors.indexOf(this.grid[index]) + 1) % colors.length];
        this.attempts++;
        document.getElementById('color-match-attempts').textContent = this.attempts;
        if (this.grid.join() === this.target.join()) {
            document.getElementById('color-match-congrats').classList.add('active');
        } else if (this.attempts >= this.maxAttempts) {
            document.getElementById('color-match-game-over').classList.add('active');
        }
        this.render();
    }
};

const BrickBreaker = {
    ball: { x: 150, y: 350, dx: 2, dy: -2, radius: 5 },
    paddle: { x: 130, width: 40, height: 10 },
    bricks: [],
    lives: 3,
    gameLoop: null,

    start() {
        this.reset();
        this.gameLoop = setInterval(this.update.bind(this), 1000 / 60);
    },

    reset() {
        this.ball = { x: 150, y: 350, dx: 2, dy: -2, radius: 5 };
        this.paddle = { x: 130, width: 40, height: 10 };
        this.bricks = Array(3).fill().map((_, i) => Array(5).fill().map((_, j) => ({ x: j * 60 + 10, y: i * 20 + 20, width: 50, height: 10 })));
        this.lives = 3;
        document.getElementById('brick-breaker-lives').textContent = this.lives;
        document.getElementById('brick-breaker-congrats').classList.remove('active');
        document.getElementById('brick-breaker-game-over').classList.remove('active');
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
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
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    },

    render() {
        const canvas = document.getElementById('brick-breaker-canvas');
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
        ctx.beginPath();
        ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(this.paddle.x, canvas.height - this.paddle.height, this.paddle.width, this.paddle.height);
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
        if (this.ball.x + this.ball.radius > 300 || this.ball.x - this.ball.radius < 0) this.ball.dx *= -1;
        if (this.ball.y - this.ball.radius < 0) this.ball.dy *= -1;
        if (this.ball.y + this.ball.radius > 400 - this.paddle.height &&
            this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddle.width) {
            this.ball.dy *= -1;
        }
        if (this.ball.y + this.ball.radius > 400) {
            this.lives--;
            document.getElementById('brick-breaker-lives').textContent = this.lives;
            this.ball = { x: 150, y: 350, dx: 2, dy: -2, radius: 5 };
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
        'puzzle-slider': PuzzleSlider,
        'word-search': WordSearch,
        'snake': Snake,
        'trivia-quiz': TriviaQuiz,
        'color-match': ColorMatch,
        'brick-breaker': BrickBreaker,
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
        'puzzle-slider': PuzzleSlider,
        'word-search': WordSearch,
        'snake': Snake,
        'trivia-quiz': TriviaQuiz,
        'color-match': ColorMatch,
        'brick-breaker': BrickBreaker,
        'maze-runner': MazeRunner
    };
    if (activeGameId && games[activeGameId]) {
        games[activeGameId].reset();
    }
    activeGameId = null;
}

document.querySelectorAll('img').forEach(img => {
    img.onerror = () => {
        img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    };
});
window.onload = function () {
    // Get canvas and set up context
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Player class
    class Player {
        constructor() {
            this.width = 40;
            this.height = 40;
            this.x = canvas.width / 2 - this.width / 2;
            this.y = canvas.height - this.height - 20;
            this.speed = 7;
        }

        draw() {
            ctx.fillStyle = "cyan";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        move(direction) {
            if (direction === "left" && this.x > 0) this.x -= this.speed;
            if (direction === "right" && this.x < canvas.width - this.width) this.x += this.speed;
        }
    }

    // Bullet class
    class Bullet {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.width = 5;
            this.height = 15;
            this.speed = 8;
        }

        draw() {
            ctx.fillStyle = "lime";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        update() {
            this.y -= this.speed;
        }
    }

    // Enemy class
    class Enemy {
        constructor(x, speed) {
            this.x = x;
            this.y = 0;
            this.width = 40;
            this.height = 40;
            this.speed = speed;
        }

        draw() {
            ctx.fillStyle = "red";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        update() {
            this.y += this.speed;
        }
    }

    // Initialize player
    const player = new Player();
    const bullets = [];
    const enemies = [];
    let score = 0;

    // Spawn enemies randomly
    function spawnEnemy() {
        const x = Math.random() * (canvas.width - 40);
        const speed = Math.random() * 2 + 1; // Random speed between 1 and 3
        enemies.push(new Enemy(x, speed));
    }

    // Update game logic
    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw player
        player.draw();

        // Update and draw bullets
        bullets.forEach((bullet, index) => {
            bullet.update();
            bullet.draw();

            // Remove bullets that leave the screen
            if (bullet.y < 0) {
                bullets.splice(index, 1);
            }
        });

        // Update and draw enemies
        enemies.forEach((enemy, enemyIndex) => {
            enemy.update();
            enemy.draw();

            // Check collision with bullets
            bullets.forEach((bullet, bulletIndex) => {
                if (
                    bullet.x < enemy.x + enemy.width &&
                    bullet.x + bullet.width > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + bullet.height > enemy.y
                ) {
                    // Remove enemy and bullet on collision
                    enemies.splice(enemyIndex, 1);
                    bullets.splice(bulletIndex, 1);
                    score += 10;
                }
            });

            // Game Over if enemy reaches the bottom
            if (enemy.y > canvas.height) {
                alert("Game Over! Your score: " + score);
                document.location.reload();
            }
        });

        // Display score
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + score, 20, 30);

        requestAnimationFrame(update);
    }

    // Handle player movement
    window.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") player.move("left");
        if (e.key === "ArrowRight") player.move("right");
        if (e.key === " " || e.key === "z") {
            // Shoot bullet
            bullets.push(new Bullet(player.x + player.width / 2 - 2.5, player.y));
        }
    });

    // Spawn enemies at intervals
    setInterval(spawnEnemy, 1000);

    // Start game loop
    update();
};

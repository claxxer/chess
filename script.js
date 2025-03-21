const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Player {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height - 50;
        this.width = 30;
        this.height = 30;
        this.speed = 5;
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

const player = new Player();

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    requestAnimationFrame(update);
}

update();

window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") player.move("left");
    if (e.key === "ArrowRight") player.move("right");
});

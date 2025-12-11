/* -------- STARFIELD ANIMATION -------- */
(() => {
    const canvas = document.getElementById("starfield");
    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
    }
    resize();
    addEventListener("resize", resize);

    const stars = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.3,
        s: Math.random() * 0.6 + 0.2,
    }));

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        stars.forEach((star) => {
            star.y += star.s;
            if (star.y > canvas.height) star.y = -5;

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255,255,255,0.8)";
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }
    draw();
})();

/* -------- FEEDBACK LOGIC -------- */
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("submitBtn");
    const output = document.getElementById("responseMessage");

    btn.addEventListener("click", async () => {
        let text = document.getElementById("feedbackInput").value;

        let res = await fetch("/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        });

        let data = await res.json();
        output.textContent = data.message;
    });
});

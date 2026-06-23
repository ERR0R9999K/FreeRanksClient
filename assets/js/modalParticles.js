// Particles system for FRC Modal
let particleId = null;
let resizeObserver = null;

function initParticles(container) {
    if(particleId) cancelAnimationFrame(particleId);
    if(resizeObserver) resizeObserver.disconnect();

    const canvas = document.createElement('canvas');
    canvas.className = 'particle-canvas';
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-1;border-radius:8px';
    container.querySelector('.particle-canvas')?.remove();
    container.style.cssText = 'position:relative;overflow:hidden';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if(!ctx) return;

    const update = () => {
        if(!container.isConnected) return;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        initParticlesArray();
    };

    let particles = [];
    const initParticlesArray = () => {
        particles = [];
        for(let i = 0; i < 40; i++) {
            particles.push({
                x: Math.random()*canvas.width,
                y: Math.random()*canvas.height,
                sx: (Math.random()-.5)*.5,
                sy: (Math.random()-.5)*.5,
                s: Math.random()*.8+.3
            });
        }
    };

    function animate() {
        if(!container.isConnected || !container.style.display || container.style.display === 'none') {
            particleId = requestAnimationFrame(animate);
            return;
        }

        ctx.clearRect(0,0,canvas.width,canvas.height);

        for(let i = 0; i < particles.length; i++) {
            let p1 = particles[i];
            p1.x += p1.sx;
            p1.y += p1.sy;

            if(p1.x<0||p1.x>canvas.width) p1.sx*=-1;
            if(p1.y<0||p1.y>canvas.height) p1.sy*=-1;

            p1.x = Math.max(0,Math.min(canvas.width,p1.x));
            p1.y = Math.max(0,Math.min(canvas.height,p1.y));

            for(let j = i+1; j < particles.length; j++) {
                let p2 = particles[j];
                let dx = p1.x-p2.x, dy = p1.y-p2.y;
                let dist = Math.sqrt(dx*dx+dy*dy);

                if(dist<70) {
                    ctx.strokeStyle = `rgba(255,255,255,${.8-dist/100})`;
                    ctx.lineWidth = .8;
                    ctx.beginPath();
                    ctx.moveTo(p1.x,p1.y);
                    ctx.lineTo(p2.x,p2.y);
                    ctx.stroke();
                }
            }

            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(p1.x,p1.y,p1.s,0,Math.PI*2);
            ctx.fill();
        }

        particleId = requestAnimationFrame(animate);
    }

    update();
    animate();

    resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(container);
}

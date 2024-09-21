const { TimeLogger } = require('@dn0rmand/project-euler-tools');

const TARGET = Math.sqrt(5000);

function monteCarlo() {
    const segments = [
        { x: 0, y: 0, speed: 9 },
        { x: 10, y: 0, speed: 8 },
        { x: 20, y: 0, speed: 7 },
        { x: 30, y: 0, speed: 6 },
        { x: 40, y: 0, speed: 5 },
        { x: 50, y: 0, speed: 10 },
        { x: TARGET, y: TARGET, speed: 0 },
    ];

    function getDuration() {
        let duration = 0;

        for (let i = 0; i < segments.length - 1; i++) {
            const { x, y, speed } = segments[i];
            const { x: x1, y: y1 } = segments[i + 1];
            const distance = Math.sqrt((x1 - x) ** 2 + (y1 - y) ** 2);
            duration += distance / speed;
        }

        return duration;
    }

    function move(oldDuration) {
        const i = Math.floor(Math.random() * (segments.length - 2)) + 1;
        const s = segments[i];
        if (!s || !s.speed) {
            return false;
        }
        const delta = Math.random();
        const sign = Math.random() >= 0.5 ? 1 : -1;
        const y = s.y + sign * delta;
        if (y < 0 || y > TARGET) {
            return false;
        }
        const oy = s.y;
        s.y = y;
        const duration = getDuration();
        if (duration > oldDuration) {
            s.y = oy;
            return oldDuration;
        }
        return duration;
    }

    let duration = getDuration();
    let maxSteps = 1e7;

    while (maxSteps) {
        const d = move(duration);
        if (d === false) {
            continue;
        }
        duration = d;
        maxSteps--;
    }
    return duration.toFixed(10);
}

const answer = TimeLogger.wrap('', () => monteCarlo());
console.log(`Answer is ${answer} - 13.1265108586`);

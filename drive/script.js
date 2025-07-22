import * as THREE from "./three.module.min.js";

const canvasContainer = document.getElementById("portfolio-canvas");
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setClearColor(0xcbeafe, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
canvasContainer.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcbeafe);

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 6, -10);
camera.up.set(0, 1, 0);
camera.lookAt(0, 0.7, 0);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
scene.add(ambientLight);

const sun = new THREE.Mesh(
    new THREE.SphereGeometry(2, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xfff7b2 })
);
sun.position.set(-18, 30, -24);
scene.add(sun);

const sunLight = new THREE.DirectionalLight(0xfff7b2, 1.2);
sunLight.position.copy(sun.position);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 1;
sunLight.shadow.camera.far = 100;
sunLight.shadow.camera.left = -40;
sunLight.shadow.camera.right = 40;
sunLight.shadow.camera.top = 40;
sunLight.shadow.camera.bottom = -40;
scene.add(sunLight);

const groundGeo = new THREE.PlaneGeometry(100, 100);
const groundMat = new THREE.MeshPhysicalMaterial({
    color: 0x4caf50,
    roughness: 0.7,
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
scene.add(ground);

const treePositions = [];
function addTrees() {
    const minDist = 2.2;
    const treeTypes = [
        () => ({
            trunkGeo: new THREE.CylinderGeometry(0.18, 0.22, 1.1, 7),
            trunkMat: new THREE.MeshPhysicalMaterial({
                color: 0x6b4f27,
                roughness: 0.7,
            }),
            trunkY: 0.55,
            foliageGeo: new THREE.ConeGeometry(
                0.7 + Math.random() * 0.3,
                1.6 + Math.random() * 0.5,
                5 + Math.floor(Math.random() * 0.2)
            ),
            foliageMat: new THREE.MeshPhysicalMaterial({
                color: 0x2e5339,
                roughness: 0.5,
            }),
            foliageY: 1.45,
        }),
        () => ({
            trunkGeo: new THREE.CylinderGeometry(0.16, 0.19, 1.2, 7),
            trunkMat: new THREE.MeshPhysicalMaterial({
                color: 0x7c4a03,
                roughness: 0.6,
            }),
            trunkY: 0.6,
            foliageGeo: new THREE.SphereGeometry(
                0.7 + Math.random() * 0.2,
                6 + Math.floor(Math.random() * 2),
                5 + Math.floor(Math.random() * 0.2)
            ),
            foliageMat: new THREE.MeshPhysicalMaterial({
                color: 0x4e944f,
                roughness: 0.4,
            }),
            foliageY: 1.45,
        }),
        () => ({
            trunkGeo: new THREE.CylinderGeometry(0.13, 0.16, 1.7, 6),
            trunkMat: new THREE.MeshPhysicalMaterial({
                color: 0xbfa76f,
                roughness: 0.5,
            }),
            trunkY: 0.85,
            foliageGeo: new THREE.SphereGeometry(
                0.38 + Math.random() * 0.12,
                5 + Math.floor(Math.random() * 2),
                4 + Math.floor(Math.random() * 2)
            ),
            foliageMat: new THREE.MeshPhysicalMaterial({
                color: 0x3a5a40,
                roughness: 0.3,
            }),
            foliageY: 1.55,
        }),
        () => ({
            trunkGeo: new THREE.CylinderGeometry(0.15, 0.18, 1.3, 7),
            trunkMat: new THREE.MeshPhysicalMaterial({
                color: 0x5b3921,
                roughness: 0.6,
            }),
            trunkY: 0.65,
            foliageGeo: new THREE.SphereGeometry(
                0.65 + Math.random() * 0.18,
                6 + Math.floor(Math.random() * 0.2),
                5 + Math.floor(Math.random() * 0.2)
            ),
            foliageMat: new THREE.MeshPhysicalMaterial({
                color: 0xb94a48,
                roughness: 0.4,
            }),
            foliageY: 1.5,
        }),
        () => ({
            trunkGeo: new THREE.CylinderGeometry(0.17, 0.21, 1.15, 7),
            trunkMat: new THREE.MeshPhysicalMaterial({
                color: 0x5b3a1b,
                roughness: 0.7,
            }),
            trunkY: 0.57,
            foliageGeo: new THREE.ConeGeometry(
                0.65 + Math.random() * 0.22,
                1.5 + Math.random() * 0.4,
                5 + Math.floor(Math.random() * 0.2)
            ),
            foliageMat: new THREE.MeshPhysicalMaterial({
                color: 0x3b5d3a,
                roughness: 0.5,
            }),
            foliageY: 1.4,
        }),
        () => ({
            trunkGeo: new THREE.CylinderGeometry(0.14, 0.17, 1.1, 6),
            trunkMat: new THREE.MeshPhysicalMaterial({
                color: 0x8d5524,
                roughness: 0.6,
            }),
            trunkY: 0.55,
            foliageGeo: new THREE.SphereGeometry(
                0.55 + Math.random() * 0.18,
                5 + Math.floor(Math.random() * 0.2),
                4 + Math.floor(Math.random() * 2)
            ),
            foliageMat: new THREE.MeshPhysicalMaterial({
                color: 0xe2c044,
                roughness: 0.4,
            }),
            foliageY: 1.25,
        }),
    ];
    for (let type = 0; type < treeTypes.length; type++) {
        const count = 10 + Math.floor(Math.random() * 5);
        for (let i = 0; i < count; i++) {
            let x, z, valid;
            let attempts = 0;
            do {
                x = (Math.random() - 0.5) * 90;
                z = (Math.random() - 0.5) * 90;
                valid = true;
                if (Math.abs(x) < 3 && Math.abs(z) < 3) valid = false;
                for (const t of treePositions) {
                    const dx = x - t.x;
                    const dz = z - t.z;
                    if (dx * dx + dz * dz < minDist * minDist) {
                        valid = false;
                        break;
                    }
                }
                attempts++;
                if (attempts > 100) break;
            } while (!valid);
            if (!valid) continue;
            const tree = treeTypes[type]();
            const trunk = new THREE.Mesh(tree.trunkGeo, tree.trunkMat);
            trunk.position.set(x, tree.trunkY, z);
            const foliage = new THREE.Mesh(tree.foliageGeo, tree.foliageMat);
            foliage.position.set(x, tree.foliageY, z);
            scene.add(trunk);
            scene.add(foliage);
            treePositions.push({ x, z });
        }
    }
}
addTrees();

const extraObstacles = [];
function addFunTerrainFeatures() {
    function isFarFromAll(x, z, minDist) {
        if (Math.abs(x) < 3 && Math.abs(z) < 3) return false;
        for (const t of treePositions) {
            const dx = x - t.x,
                dz = z - t.z;
            if (dx * dx + dz * dz < minDist * minDist) return false;
        }
        for (const o of extraObstacles) {
            const dx = x - o.x,
                dz = z - o.z;
            if (dx * dx + dz * dz < minDist * minDist) return false;
        }
        return true;
    }
    for (let i = 0; i < 18; i++) {
        let x,
            z,
            tries = 0;
        do {
            x = (Math.random() - 0.5) * 90;
            z = (Math.random() - 0.5) * 90;
            tries++;
        } while (!isFarFromAll(x, z, 2.1) && tries < 50);
        if (tries >= 50) continue;
        const geo = new THREE.IcosahedronGeometry(0.32 + Math.random() * 0.22, 0);
        const mat = new THREE.MeshPhysicalMaterial({
            color: 0x7b7b7b,
            roughness: 0.8,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, 0.22, z);
        mesh.rotation.y = Math.random() * Math.PI;
        scene.add(mesh);
        extraObstacles.push({ x, z, r: 0.5 });
    }
    for (let i = 0; i < 14; i++) {
        let x,
            z,
            tries = 0;
        do {
            x = (Math.random() - 0.5) * 90;
            z = (Math.random() - 0.5) * 90;
            tries++;
        } while (!isFarFromAll(x, z, 2.1) && tries < 50);
        if (tries >= 50) continue;
        const geo = new THREE.SphereGeometry(0.38 + Math.random() * 0.18, 5, 4);
        const mat = new THREE.MeshPhysicalMaterial({
            color: 0x2e7d32,
            roughness: 0.7,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, 0.32, z);
        mesh.rotation.y = Math.random() * Math.PI;
        scene.add(mesh);
        extraObstacles.push({ x, z, r: 0.45 });
    }
    for (let i = 0; i < 4; i++) {
        let x,
            z,
            tries = 0;
        do {
            x = (Math.random() - 0.5) * 85;
            z = (Math.random() - 0.5) * 85;
            tries++;
        } while (
            (Math.abs(x) < 4.5 && Math.abs(z) < 4.5) ||
            (!isFarFromAll(x, z, 4.5) && tries < 50)
        );
        if (tries >= 50) continue;
        const shapeType = Math.random();
        let geo;
        if (shapeType < 0.33) {
            const rx = 1.2 + Math.random() * 1.8;
            const rz = 1.2 + Math.random() * 1.8;
            geo = new THREE.CircleGeometry(1, 28);
            geo.scale(rx, rz, 1);
        } else if (shapeType < 0.66) {
            const sides = 6 + Math.floor(Math.random() * 6);
            const radius = 1.3 + Math.random() * 1.5;
            const shape = new THREE.Shape();
            for (let j = 0; j < sides; j++) {
                const angle = (j / sides) * Math.PI * 2;
                const r = radius * (0.8 + Math.random() * 0.4);
                const px = Math.cos(angle) * r;
                const py = Math.sin(angle) * r;
                if (j === 0) shape.moveTo(px, py);
                else shape.lineTo(px, py);
            }
            shape.closePath();
            geo = new THREE.ShapeGeometry(shape);
        } else {
            const segments = 22 + Math.floor(Math.random() * 8);
            const baseR = 1.5 + Math.random() * 1.2;
            const shape = new THREE.Shape();
            for (let j = 0; j < segments; j++) {
                const angle = (j / segments) * Math.PI * 2;
                const r = baseR * (0.85 + Math.random() * 0.25);
                const px = Math.cos(angle) * r;
                const py = Math.sin(angle) * r;
                if (j === 0) shape.moveTo(px, py);
                else shape.lineTo(px, py);
            }
            shape.closePath();
            geo = new THREE.ShapeGeometry(shape);
        }
        const mat = new THREE.MeshPhysicalMaterial({
            color: 0x4fc3f7,
            roughness: 0.25,
            metalness: 0.7,
            transparent: true,
            opacity: 0.82,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, 0.04, z);
        mesh.rotation.x = -Math.PI / 2;
        scene.add(mesh);
        let r = 2.2 + Math.random();
        extraObstacles.push({ x, z, r });
    }
}
addFunTerrainFeatures();

function addBillboard(x, z, text, camPos, camLook) {
    const angle = Math.atan2(x, z);
    const CANVAS_W = 1024,
        CANVAS_H = 384;
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    const ctx = canvas.getContext("2d");
    const billboardAnim = {
        canvas,
        ctx,
        tex: null,
        text,
        lastWaveT: 0,
        lastDrawFrame: 0,
    };
    function drawBillboardWaves(time) {
        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
        const grad = ctx.createLinearGradient(0, 0, CANVAS_W, CANVAS_H);
        grad.addColorStop(0, "#f4f5ff");
        grad.addColorStop(0.5, "#f8fafc");
        grad.addColorStop(1, "#f5d0fe");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        const t = time * 0.001;
        const points = 44;
        const baseAmp = CANVAS_W * 0.08;
        const xBase = CANVAS_W * 0.08;
        ctx.save();
        ctx.globalAlpha = 0.22;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let i = 0; i <= points; i++) {
            let y = (CANVAS_H / points) * i;
            y += Math.sin(t * 0.8 + i * 0.25) * 7 + Math.cos(t * 0.5 + i * 0.13) * 4;
            const amp = baseAmp * (1.1 + 0.35 * Math.sin(t * 0.7 + i * 0.5));
            const phase = t * 1.1 + i * 0.12 + Math.sin(t * 0.5 + i * 0.2) * 0.5;
            const x = Math.sin(phase) * amp + xBase;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(0, CANVAS_H);
        ctx.closePath();
        ctx.fillStyle = "#d946ef";
        ctx.fill();
        ctx.restore();
        ctx.save();
        ctx.globalAlpha = 0.22;
        ctx.translate(CANVAS_W, 0);
        ctx.scale(-1, 1);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let i = 0; i <= points; i++) {
            let y = (CANVAS_H / points) * i;
            y +=
                Math.cos(t * 0.8 + i * 0.25 + 1.7) * 7 +
                Math.sin(t * 0.5 + i * 0.13 + 1.7) * 4;
            const amp = baseAmp * (1.1 + 0.35 * Math.cos(t * 0.7 + i * 0.5 + 1.7));
            const phase =
                t * 1.1 + i * 0.12 + 2.2 + Math.cos(t * 0.5 + i * 0.2 + 1.7) * 0.5;
            const x = Math.sin(phase) * amp + xBase;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(0, CANVAS_H);
        ctx.closePath();
        ctx.fillStyle = "#d946ef";
        ctx.fill();
        ctx.restore();
        ctx.lineWidth = 12;
        const borderGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
        borderGrad.addColorStop(0, "#d946ef");
        borderGrad.addColorStop(1, "#a21caf");
        ctx.strokeStyle = borderGrad;
        ctx.strokeRect(6, 6, CANVAS_W - 12, CANVAS_H - 12);
        ctx.font = "900 85px Montserrat, Helvetica Neue, Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "#f5d0fe";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "#232946";
        ctx.fillText(text, CANVAS_W / 2, 168);
        ctx.shadowBlur = 0;
        ctx.shadowColor = "#a21caf";
        ctx.shadowBlur = 5;
        ctx.fillStyle = "rgba(217,70,239,0.08)";
        ctx.fillRect(20, 20, CANVAS_W - 40, CANVAS_H - 40);
    }
    drawBillboardWaves(0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    billboardAnim.tex = tex;
    const textMat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: false,
        side: THREE.FrontSide,
    });
    const textMesh = new THREE.Mesh(new THREE.PlaneGeometry(32, 13), textMat);
    textMesh.position.set(x, 9.5, z);
    textMesh.rotation.y = angle + Math.PI;
    textMesh.userData = {
        billboardName: text,
        billboardCamPos: camPos,
        billboardCamLook: camLook,
        billboardAnim,
    };
    textMesh.cursor = "pointer";
    textMesh.name = `billboard-${text.toLowerCase().replace(/\s+/g, "-")}`;
    scene.add(textMesh);
    if (!window._billboardMeshes) window._billboardMeshes = [];
    window._billboardMeshes.push(textMesh);

    const clickCanvas = document.createElement("canvas");
    clickCanvas.width = 400;
    clickCanvas.height = 64;
    const clickCtx = clickCanvas.getContext("2d");
    clickCtx.clearRect(0, 0, 400, 64);
    clickCtx.font = "bold 32px Montserrat, Arial, sans-serif";
    clickCtx.textAlign = "center";
    clickCtx.textBaseline = "middle";
    clickCtx.shadowColor = "#f5d0fe";
    clickCtx.shadowBlur = 4;
    clickCtx.fillStyle = "#d946ef";
    clickCtx.fillText("(click me!)", 200, 32);
    clickCtx.shadowBlur = 0;
    const clickTex = new THREE.CanvasTexture(clickCanvas);
    clickTex.anisotropy = 4;
    clickTex.needsUpdate = true;
    const clickMat = new THREE.MeshBasicMaterial({
        map: clickTex,
        transparent: true,
        side: THREE.FrontSide,
    });
    const clickMesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 2.1), clickMat);
    clickMesh.position.set(0, -4.3, 0.01);
    clickMesh.visible = false;
    textMesh.add(clickMesh);
    textMesh.userData.clickMesh = clickMesh;
    textMesh.userData.redrawBillboardWaves = drawBillboardWaves;
}
const billboardData = [
    {
        name: "fun",
        x: -55,
        z: -55,
    },
    {
        name: "about me",
        x: 55,
        z: -55,
    },
    {
        name: "projects",
        x: 55,
        z: 55,
    },
].map((b) => {
    const center = new THREE.Vector3(b.x, 9.5, b.z);
    const angle = Math.atan2(b.x, b.z);
    const normal = new THREE.Vector3(-Math.sin(angle), 0, -Math.cos(angle));
    const camPos = center.clone().add(normal.clone().multiplyScalar(30));
    camPos.y = 12;
    return {
        ...b,
        camPos,
        camLook: center,
    };
});
for (const b of billboardData) {
    addBillboard(b.x, b.z, b.name, b.camPos, b.camLook);
}

function getCarOBB() {
    const hw = 0.85,
        hl = 1.25;
    const center = { x: carPos.x, z: carPos.z };
    const angle = carRot;
    return { center, hw, hl, angle };
}
function pointInOBB(px, pz, obb) {
    const dx = px - obb.center.x;
    const dz = pz - obb.center.z;
    const cos = Math.cos(-obb.angle),
        sin = Math.sin(-obb.angle);
    const lx = dx * cos - dz * sin;
    const lz = dx * sin + dz * cos;
    return Math.abs(lx) <= obb.hw && Math.abs(lz) <= obb.hl;
}
function obbCircleIntersect(obb, cx, cz, cr) {
    const dx = cx - obb.center.x;
    const dz = cz - obb.center.z;
    const cos = Math.cos(-obb.angle),
        sin = Math.sin(-obb.angle);
    const lx = dx * cos - dz * sin;
    const lz = dx * sin + dz * cos;
    const clx = Math.max(-obb.hw, Math.min(obb.hw, lx));
    const clz = Math.max(-obb.hl, Math.min(obb.hl, lz));
    const wx = clx - lx,
        wz = clz - lz;
    return wx * wx + wz * wz <= cr * cr;
}

const treeHitboxes = treePositions.map((t) => ({ x: t.x, z: t.z, r: 0.22 }));

const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.3, 20);
const wheelMat = new THREE.MeshPhysicalMaterial({
    color: 0x232946,
    metalness: 0.6,
    roughness: 0.5,
});

const car = new THREE.Group();
const bodyGeo = new THREE.BoxGeometry(1.7, 0.38, 2.5);
const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0xc22b3a,
    metalness: 0.7,
    roughness: 0.3,
});
const body = new THREE.Mesh(bodyGeo, bodyMat);
body.position.y = 0.41;
car.add(body);
const hoodGeo = new THREE.BoxGeometry(1.7, 0.18, 0.7);
const hood = new THREE.Mesh(hoodGeo, bodyMat);
hood.position.set(0, 0.32, -1.0);
hood.rotation.x = Math.PI / 9;
car.add(hood);
const cabinGeo = new THREE.BoxGeometry(1.08, 0.29, 0.92);
const cabinMat = new THREE.MeshPhysicalMaterial({
    color: 0xf4f5ff,
    metalness: 0.2,
    roughness: 0.1,
    transparent: true,
    opacity: 0.92,
});
const cabin = new THREE.Mesh(cabinGeo, cabinMat);
cabin.position.set(0, 0.66, -0.18);
cabin.rotation.x = Math.PI / 22;
car.add(cabin);
const rearGeo = new THREE.BoxGeometry(1.5, 0.18, 0.7);
const rearMat = new THREE.MeshPhysicalMaterial({
    color: 0x8b1e2d,
    metalness: 0.7,
    roughness: 0.3,
});
const rear = new THREE.Mesh(rearGeo, rearMat);
rear.position.set(0, 0.32, 1.0);
car.add(rear);
const popupGeo = new THREE.BoxGeometry(0.18, 0.09, 0.18);
const popupMat = new THREE.MeshPhysicalMaterial({
    color: 0xfafafa,
    metalness: 0.1,
    roughness: 0.2,
});
for (let i = -1; i <= 1; i += 2) {
    const popup = new THREE.Mesh(popupGeo, popupMat);
    popup.position.set(0.32 * i, 0.48, -1.32);
    car.add(popup);
}
const bumperGeo = new THREE.BoxGeometry(1.2, 0.11, 0.18);
const bumperMat = new THREE.MeshPhysicalMaterial({
    color: 0x232946,
    metalness: 0.6,
    roughness: 0.2,
});
const bumper = new THREE.Mesh(bumperGeo, bumperMat);
bumper.position.set(0, 0.26, -1.36);
car.add(bumper);
const rearBumper = new THREE.Mesh(bumperGeo, bumperMat);
rearBumper.position.set(0, 0.26, 1.36);
car.add(rearBumper);
const tailGeo = new THREE.BoxGeometry(0.9, 0.08, 0.08);
const tailMat = new THREE.MeshPhysicalMaterial({
    color: 0xffa500,
    metalness: 0.3,
    roughness: 0.2,
});
const tail = new THREE.Mesh(tailGeo, tailMat);
tail.position.set(0, 0.36, 1.41);
car.add(tail);
const mirrorGeo = new THREE.BoxGeometry(0.13, 0.06, 0.18);
const mirrorMat = new THREE.MeshPhysicalMaterial({
    color: 0x232946,
    metalness: 0.5,
    roughness: 0.3,
});
for (let i = -1; i <= 1; i += 2) {
    const mirror = new THREE.Mesh(mirrorGeo, mirrorMat);
    mirror.position.set(0.62 * i, 0.68, -0.55);
    mirror.rotation.y = (Math.PI / 7) * i;
    car.add(mirror);
}
const spoilerGeo = new THREE.BoxGeometry(0.7, 0.06, 0.18);
const spoilerMat = new THREE.MeshPhysicalMaterial({
    color: 0x232946,
    metalness: 0.7,
    roughness: 0.2,
});
const spoiler = new THREE.Mesh(spoilerGeo, spoilerMat);
spoiler.position.set(0, 0.54, 1.28);
car.add(spoiler);
const wheels = [];
for (let i = -1; i <= 1; i += 2) {
    for (let j = -1; j <= 1; j += 2) {
        const isRear = j > 0;
        const wheel = new THREE.Mesh(
            isRear ? new THREE.CylinderGeometry(0.36, 0.36, 0.32, 20) : wheelGeo,
            wheelMat
        );
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(0.68 * i, 0.18, 0.95 * j + (j < 0 ? -0.45 : 0.45));
        car.add(wheel);
        wheels.push(wheel);
    }
}
scene.add(car);

let carPos = new THREE.Vector3(0, 0, 0);
let carRot = 0;
let carSpeed = 0;
let carSteer = 0;
const maxSpeed = 10 / 30;
const accel = 0.018;
const friction = 0.98;
const steerSpeed = 0.035;

const instructionBar = document.getElementById("instruction-bar");
let drivingStarted = false;

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    a: false,
    s: false,
    d: false,
};
document.addEventListener("keydown", (e) => {
    if (e.key in keys) {
        keys[e.key] = true;
        if (
            !drivingStarted &&
            (e.key === "ArrowUp" ||
                e.key === "ArrowDown" ||
                e.key === "ArrowLeft" ||
                e.key === "ArrowRight" ||
                e.key === "w" ||
                e.key === "a" ||
                e.key === "s" ||
                e.key === "d")
        ) {
            drivingStarted = true;
            if (instructionBar) instructionBar.classList.add("hide");
        }
    }
});
document.addEventListener("keyup", (e) => {
    if (e.key in keys) keys[e.key] = false;
});

let inBillboardZone = null;
let camSnapLerp = 0;

function updateCamera() {
    let snap = null;
    for (const b of billboardData) {
        const dx = carPos.x - b.x;
        const dz = carPos.z - b.z;
        if (Math.abs(dx) < 15 && Math.abs(dz) < 15) {
            snap = b;
            break;
        }
    }
    setBillboardClickable(!!snap);
    if (window._billboardMeshes) {
        for (const mesh of window._billboardMeshes) {
            if (mesh.userData && mesh.userData.clickMesh) {
                mesh.userData.clickMesh.visible =
                    !!snap &&
                    mesh.userData.billboardName.toLowerCase() ===
                        snap?.name.toLowerCase();
            }
        }
    }
    if (snap) {
        if (inBillboardZone !== snap) camSnapLerp = 0;
        inBillboardZone = snap;
        camSnapLerp += 0.08;
        if (camSnapLerp > 1) camSnapLerp = 1;
    } else {
        inBillboardZone = null;
        camSnapLerp -= 0.08;
        if (camSnapLerp < 0) camSnapLerp = 0;
    }
    const followDist = 13;
    const followHeight = 7.5;
    const offsetX = Math.sin(carRot) * -followDist;
    const offsetZ = Math.cos(carRot) * -followDist;
    const followPos = new THREE.Vector3(
        carPos.x + offsetX,
        carPos.y + followHeight,
        carPos.z + offsetZ
    );
    const followLook = new THREE.Vector3(carPos.x, 0.7, carPos.z);
    if ((camSnapLerp > 0 && inBillboardZone) || camSnapLerp > 0) {
        const snapZone = inBillboardZone || lastBillboardZone;
        camera.position.lerpVectors(followPos, snapZone.camPos, camSnapLerp);
        const lookTarget = new THREE.Vector3().lerpVectors(
            followLook,
            snapZone.camLook,
            camSnapLerp
        );
        camera.up.set(0, 1, 0);
        camera.lookAt(lookTarget);
    } else {
        camera.position.lerp(followPos, 0.18);
        camera.up.set(0, 1, 0);
        camera.lookAt(followLook);
    }
}

let lastBillboardZone = null;
let infoModal = null;
function showBillboardInfo(name) {
    if (infoModal) infoModal.remove();
    infoModal = document.createElement("div");
    infoModal.className = "billboard-info-modal";
    let html = "";
    if (name.toLowerCase() === "about me") {
        html = `
            <h2>about me!</h2>
            <ul>
                <li>hi, i'm KΛVIN!</li>
                <li>i am an aspiring software engineer, currently in high school.</li>
                <li>i live in princeton, nj.</li>
                <li>on the internet, i often go by <span class="username">NicholasIGuess</span>, <span class="username">NichSembley</span>, or sometimes <span class="username">Antipanic</span>.</li>
                <li>this website was inspired by <a href="https://bruno-simon.com">this project</a>, go check it out!</li>
                <li>i, along with a few of my friends, go to hackathons and make stuff a lot. check the projects billboard!</li>
            </ul>
            <h2>contact me on:</h2>
            <ul>
                <li><a href="https://github.com/NicholasIGuess" target="_blank" rel="noopener noreferrer">Github</a></li>
                <li><a href="https://www.instagram.com/enoughlovefortwo/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                <li><a href="mailto:kavin.muthiah@gmail.com">Email</a></li>
            </ul>
        `;
    } else if (name.toLowerCase() === "projects") {
        html = `
            <h2>things I've made</h2>
            <ul>
                <li><a href="/ambulance/">ambulance tracker</a> (made in 8 hours for MakeSPP 2024)</li>
                <li><a href="/memorial/">rwandan genocide memorial</a> (made for World History 1 in school)</li>
                <li><a href="/cooking/">cooking</a> (just stuff for the cooking merit badge)</li>
                <li><a href="/hackmato/">hackmato</a> (a pomodoro timer for hackathons)</li>
                <li><a href="/eightball/">eight ball</a> (a magic 8 ball web app)</li>
                <li>tempus - work in progress so no link yet (made for fun because I was bored)</li>
            </ul>
        `;
    } else if (name.toLowerCase() === "fun") {
        html = `<h2>Fun</h2><p>drive around and have fun! i'll add a racetrack sort of thing at some point but until then just wait ig</p>`;
    }
    infoModal.innerHTML = `
        <div class="billboard-info-content">
            <button class="billboard-info-close" title="Close">&times;</button>
            ${html}
        </div>
    `;
    document.body.appendChild(infoModal);
    infoModal.querySelector(".billboard-info-close").onclick = () =>
        infoModal.remove();
    infoModal.onclick = (e) => {
        if (e.target === infoModal) infoModal.remove();
    };
}

let lastPopupZone = null;
function updateCameraWrapper() {
    const prevZone = inBillboardZone;
    updateCamera();
    if (inBillboardZone) {
        lastBillboardZone = inBillboardZone;
    } else if (camSnapLerp > 0 && prevZone) {
        lastBillboardZone = prevZone;
    }
    if (infoModal) {
        if (!inBillboardZone) {
            infoModal.remove();
            infoModal = null;
        }
    }
}

function updateCar() {
    let turning = keys.ArrowLeft || keys.a || keys.ArrowRight || keys.d;
    let currentMaxSpeed = maxSpeed;
    let currentAccel = accel;
    if (turning) {
        currentMaxSpeed = maxSpeed * 0.9;
        currentAccel = accel * 0.9;
    }
    if (keys.ArrowUp || keys.w) carSpeed += currentAccel;
    if (keys.ArrowDown || keys.s) carSpeed -= currentAccel * 0.8;
    carSpeed *= friction;
    carSpeed = Math.max(
        Math.min(carSpeed, currentMaxSpeed),
        -currentMaxSpeed * 0.6
    );
    let steerMult = 1;
    if (keys.ArrowLeft || keys.a)
        carSteer = Math.max(carSteer - steerSpeed * steerMult, -0.045 * steerMult);
    else if (keys.ArrowRight || keys.d)
        carSteer = Math.min(carSteer + steerSpeed * steerMult, 0.045 * steerMult);
    else carSteer *= 0.7;
    carRot -= carSteer * carSpeed * 2.5;
    const prevX = carPos.x;
    const prevZ = carPos.z;
    carPos.x += Math.sin(carRot) * carSpeed;
    carPos.z += Math.cos(carRot) * carSpeed;
    let collided = false;
    for (const tree of treeHitboxes) {
        const dx = carPos.x - tree.x;
        const dz = carPos.z - tree.z;
        if (dx * dx + dz * dz < 1.25)
            collided = true;
    }
    if (!collided) {
        for (const o of extraObstacles) {
            const dx = carPos.x - o.x;
            const dz = carPos.z - o.z;
            if (dx * dx + dz * dz < (o.r + 0.7) * (o.r + 0.7)) {
                collided = true;
                break;
            }
        }
    }
    if (collided) {
        carPos.x = prevX;
        carPos.z = prevZ;
        carSpeed *= -0.18;
    }
    const halfGround = 50 - 1.1;
    let clampedX = false,
        clampedZ = false;
    let newX = Math.max(-halfGround, Math.min(halfGround, carPos.x));
    let newZ = Math.max(-halfGround, Math.min(halfGround, carPos.z));
    if (newX !== carPos.x) clampedX = true;
    if (newZ !== carPos.z) clampedZ = true;
    carPos.x = newX;
    carPos.z = newZ;
    if (clampedX && clampedZ) carSpeed = 0;
    car.position.set(carPos.x, 0.2, carPos.z);
    car.rotation.y = carRot;
    for (const wheel of wheels) {
        wheel.rotation.x -= carSpeed * 2.5;
    }
}

const raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let billboardClickable = false;
let lastHoveredBillboard = null;

function setBillboardClickable(state) {
    billboardClickable = state;
    renderer.domElement.style.cursor = state ? "pointer" : "";
}

renderer.domElement.addEventListener("pointermove", (e) => {
    if (!billboardClickable) return;
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(window._billboardMeshes || []);
    if (intersects.length > 0) {
        renderer.domElement.style.cursor = "pointer";
        lastHoveredBillboard = intersects[0].object;
    } else {
        renderer.domElement.style.cursor = "";
        lastHoveredBillboard = null;
    }
});

renderer.domElement.addEventListener("pointerdown", (e) => {
    if (!billboardClickable) return;
    if (lastHoveredBillboard) {
        showBillboardInfo(lastHoveredBillboard.userData.billboardName);
    }
});

const style = document.createElement("style");
style.textContent = `
.billboard-info-modal {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(36, 14, 53, 0.13);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
}
.billboard-info-content {
    background: #f8fafc;
    border: 8px solid #d946ef;
    border-radius: 18px;
    box-shadow: 0 8px 48px #a21caf33;
    padding: 2.2rem 2.5rem 2.2rem 2.2rem;
    max-width: 520px;
    min-width: 320px;
    font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
    color: #232946;
    font-size: 1.13rem;
    position: relative;
    overflow: hidden;
}
.billboard-info-content h2 {
    color: #d946ef;
    font-size: 1.35rem;
    margin-top: 0.2em;
    margin-bottom: 0.7em;
    font-family: 'Montserrat', Arial, sans-serif;
    font-weight: 700;
}
.billboard-info-content ul {
    list-style: square inside;
    margin-bottom: 1.2em;
    padding-left: 0;
}
.billboard-info-content a {
    color: #a21caf;
    text-decoration: underline;
}
.billboard-info-close {
    position: absolute;
    top: 0.7em;
    right: 1.1em;
    background: none;
    border: none;
    font-size: 2.1rem;
    color: #a21caf;
    cursor: pointer;
    font-family: inherit;
    font-weight: bold;
    line-height: 1;
    padding: 0;
}
`;
document.head.appendChild(style);

function animateBillboardWaves(time) {
    if (!window._billboardMeshes) return;
    for (const mesh of window._billboardMeshes) {
        const canvas = mesh.userData.waveCanvas;
        const ctx = mesh.userData.waveCtx;
        const text = mesh.userData.waveText;
        if (!canvas || !ctx) continue;
        const t = time * 0.001;
        ctx.clearRect(0, 0, 4096, 1536);
        const grad = ctx.createLinearGradient(0, 0, 4096, 1536);
        grad.addColorStop(0, "#f4f5ff");
        grad.addColorStop(0.5, "#f8fafc");
        grad.addColorStop(1, "#f5d0fe");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 4096, 1536);
        ctx.save();
        ctx.globalAlpha = 0.22;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const wave1 = 400 + Math.sin(t * 1.2) * 60;
        const wave2 = 800 + Math.cos(t * 0.9 + 1.2) * 80;
        ctx.bezierCurveTo(0, wave1, 0, wave2, 0, 1536);
        const wave3 = 1200 + Math.sin(t * 1.5 + 0.7) * 90;
        const wave4 = 900 + Math.cos(t * 1.1 + 2.1) * 70;
        ctx.bezierCurveTo(180, wave3, 220, wave4, 0, 0);
        ctx.closePath();
        ctx.fillStyle = "#d946ef";
        ctx.fill();
        ctx.restore();
        ctx.save();
        ctx.globalAlpha = 0.22;
        ctx.translate(4096, 0);
        ctx.scale(-1, 1);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const wave1r = 400 + Math.sin(t * 1.2 + 2.5) * 60;
        const wave2r = 800 + Math.cos(t * 0.9 + 3.7) * 80;
        ctx.bezierCurveTo(0, wave1r, 0, wave2r, 0, 1536);
        const wave3r = 1200 + Math.sin(t * 1.5 + 2.2) * 90;
        const wave4r = 900 + Math.cos(t * 1.1 + 4.1) * 70;
        ctx.bezierCurveTo(180, wave3r, 220, wave4r, 0, 0);
        ctx.closePath();
        ctx.fillStyle = "#d946ef";
        ctx.fill();
        ctx.restore();
        ctx.lineWidth = 44;
        const borderGrad = ctx.createLinearGradient(0, 0, 0, 1536);
        borderGrad.addColorStop(0, "#d946ef");
        borderGrad.addColorStop(1, "#a21caf");
        ctx.strokeStyle = borderGrad;
        ctx.strokeRect(22, 22, 4096 - 44, 1536 - 44);
        ctx.font = "900 340px Montserrat, Helvetica Neue, Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "#f5d0fe";
        ctx.shadowBlur = 32;
        ctx.fillStyle = "#232946";
        ctx.fillText(text, 2048, 670);
        ctx.shadowBlur = 0;
        ctx.shadowColor = "#a21caf";
        ctx.shadowBlur = 18;
        ctx.fillStyle = "rgba(217,70,239,0.08)";
        ctx.fillRect(80, 80, 4096 - 160, 1536 - 160);
        if (mesh.material.map) mesh.material.map.needsUpdate = true;
    }
}

function animate() {
    requestAnimationFrame(animate);
    updateCar();
    updateCameraWrapper();
    if (window._billboardMeshes) {
        const now = performance.now();
        if (!window._billboardFrame) window._billboardFrame = 0;
        window._billboardFrame++;
        if (window._billboardFrame % 3 === 0) {
            const frustum = new THREE.Frustum();
            const camViewProj = new THREE.Matrix4();
            camViewProj.multiplyMatrices(
                camera.projectionMatrix,
                camera.matrixWorldInverse
            );
            frustum.setFromProjectionMatrix(camViewProj);
            for (const mesh of window._billboardMeshes) {
                if (frustum.intersectsObject(mesh)) {
                    if (
                        mesh.userData &&
                        mesh.userData.redrawBillboardWaves &&
                        mesh.userData.billboardAnim
                    ) {
                        mesh.userData.redrawBillboardWaves(now);
                        mesh.userData.billboardAnim.tex.needsUpdate = true;
                    }
                }
            }
        }
    }
    renderer.render(scene, camera);
}
animate();

// script-test.js
// Interactive Three.js driving scene (bruno-simon.com style)

import * as THREE from './three.module.min.js';

const canvasContainer = document.getElementById('portfolio-canvas');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setClearColor(0xcbeafe, 1); // Light blue sky
renderer.setSize(window.innerWidth, window.innerHeight);
canvasContainer.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcbeafe); // Light blue sky

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// Camera: third-person follow (behind and above car)
camera.position.set(0, 6, -10); // start behind and above car
camera.up.set(0, 1, 0); // standard up vector
camera.lookAt(0, 0.7, 0);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.45); // slightly reduced for realism
scene.add(ambientLight);

// Sun (directional light source)
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(2, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xfff7b2 }) // removed emissive
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

// --- Terrain: flat ground plane ---
const groundGeo = new THREE.PlaneGeometry(100, 100);
const groundMat = new THREE.MeshPhysicalMaterial({ color: 0x4caf50, roughness: 0.7 }); // solid green
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
scene.add(ground);

// Add trees (multiple models) to the scene and store their positions for collision
const treePositions = [];
function addTrees() {
  const minDist = 2.2; // minimum distance between tree centers
  const treeTypes = [
    // Type 1: Classic pine
    () => ({
      trunkGeo: new THREE.CylinderGeometry(0.18, 0.22, 1.1, 7),
      trunkMat: new THREE.MeshPhysicalMaterial({ color: 0x6b4f27, roughness: 0.7 }), // realistic brown
      trunkY: 0.55,
      foliageGeo: new THREE.ConeGeometry(0.7 + Math.random() * 0.3, 1.6 + Math.random() * 0.5, 5 + Math.floor(Math.random() * 0.2)),
      foliageMat: new THREE.MeshPhysicalMaterial({ color: 0x2e5339, roughness: 0.5 }), // deep pine green
      foliageY: 1.45
    }),
    // Type 2: Round leafy tree
    () => ({
      trunkGeo: new THREE.CylinderGeometry(0.16, 0.19, 1.2, 7),
      trunkMat: new THREE.MeshPhysicalMaterial({ color: 0x7c4a03, roughness: 0.6 }), // dark brown
      trunkY: 0.6,
      foliageGeo: new THREE.SphereGeometry(0.7 + Math.random() * 0.2, 6 + Math.floor(Math.random() * 2), 5 + Math.floor(Math.random() * 0.2)),
      foliageMat: new THREE.MeshPhysicalMaterial({ color: 0x4e944f, roughness: 0.4 }), // leafy green
      foliageY: 1.45
    }),
    // Type 3: Tall palm-like
    () => ({
      trunkGeo: new THREE.CylinderGeometry(0.13, 0.16, 1.7, 6),
      trunkMat: new THREE.MeshPhysicalMaterial({ color: 0xbfa76f, roughness: 0.5 }), // tan
      trunkY: 0.85,
      foliageGeo: new THREE.SphereGeometry(0.38 + Math.random() * 0.12, 5 + Math.floor(Math.random() * 2), 4 + Math.floor(Math.random() * 2)),
      foliageMat: new THREE.MeshPhysicalMaterial({ color: 0x3a5a40, roughness: 0.3 }), // palm green
      foliageY: 1.55
    }),
    // Type 4: Red maple
    () => ({
      trunkGeo: new THREE.CylinderGeometry(0.15, 0.18, 1.3, 7),
      trunkMat: new THREE.MeshPhysicalMaterial({ color: 0x5b3921, roughness: 0.6 }), // maple brown
      trunkY: 0.65,
      foliageGeo: new THREE.SphereGeometry(0.65 + Math.random() * 0.18, 6 + Math.floor(Math.random() * 0.2), 5 + Math.floor(Math.random() * 0.2)),
      foliageMat: new THREE.MeshPhysicalMaterial({ color: 0xb94a48, roughness: 0.4 }), // realistic red maple
      foliageY: 1.5
    }),
    // Type 5: Spruce (natural green)
    () => ({
      trunkGeo: new THREE.CylinderGeometry(0.17, 0.21, 1.15, 7),
      trunkMat: new THREE.MeshPhysicalMaterial({ color: 0x5b3a1b, roughness: 0.7 }), // dark brown
      trunkY: 0.57,
      foliageGeo: new THREE.ConeGeometry(0.65 + Math.random() * 0.22, 1.5 + Math.random() * 0.4, 5 + Math.floor(Math.random() * 0.2)),
      foliageMat: new THREE.MeshPhysicalMaterial({ color: 0x3b5d3a, roughness: 0.5 }), // natural spruce green
      foliageY: 1.4
    }),
    // Type 6: Yellow acacia
    () => ({
      trunkGeo: new THREE.CylinderGeometry(0.14, 0.17, 1.1, 6),
      trunkMat: new THREE.MeshPhysicalMaterial({ color: 0x8d5524, roughness: 0.6 }), // brown
      trunkY: 0.55,
      foliageGeo: new THREE.SphereGeometry(0.55 + Math.random() * 0.18, 5 + Math.floor(Math.random() * 0.2), 4 + Math.floor(Math.random() * 2)),
      foliageMat: new THREE.MeshPhysicalMaterial({ color: 0xe2c044, roughness: 0.4 }), // muted yellow
      foliageY: 1.25
    })
  ];
  for (let type = 0; type < treeTypes.length; type++) {
    const count = 10 + Math.floor(Math.random() * 5); // 10-14 of each
    for (let i = 0; i < count; i++) {
      let x, z, valid;
      let attempts = 0;
      do {
        x = (Math.random() - 0.5) * 90;
        z = (Math.random() - 0.5) * 90;
        valid = true;
        // Avoid center
        if (Math.abs(x) < 3 && Math.abs(z) < 3) valid = false;
        // Check against all existing trees
        for (const t of treePositions) {
          const dx = x - t.x;
          const dz = z - t.z;
          if (dx * dx + dz * dz < minDist * minDist) {
            valid = false;
            break;
          }
        }
        attempts++;
        if (attempts > 100) break; // fail-safe
      } while (!valid);
      if (!valid) continue;
      // Get tree model
      const tree = treeTypes[type]();
      // Trunk
      const trunk = new THREE.Mesh(tree.trunkGeo, tree.trunkMat);
      trunk.position.set(x, tree.trunkY, z);
      // Foliage
      const foliage = new THREE.Mesh(tree.foliageGeo, tree.foliageMat);
      foliage.position.set(x, tree.foliageY, z);
      // Add to scene
      scene.add(trunk);
      scene.add(foliage);
      // Store position for collision
      treePositions.push({ x, z });
    }
  }
}
addTrees();

// --- Add rocks, bushes, and ponds ---
const extraObstacles = [];
function addFunTerrainFeatures() {
  // Helper to avoid car spawn and trees
  function isFarFromAll(x, z, minDist) {
    if (Math.abs(x) < 3 && Math.abs(z) < 3) return false;
    for (const t of treePositions) {
      const dx = x - t.x, dz = z - t.z;
      if (dx * dx + dz * dz < minDist * minDist) return false;
    }
    for (const o of extraObstacles) {
      const dx = x - o.x, dz = z - o.z;
      if (dx * dx + dz * dz < minDist * minDist) return false;
    }
    return true;
  }
  // Rocks
  for (let i = 0; i < 18; i++) {
    let x, z, tries = 0;
    do {
      x = (Math.random() - 0.5) * 90;
      z = (Math.random() - 0.5) * 90;
      tries++;
    } while (!isFarFromAll(x, z, 2.1) && tries < 50);
    if (tries >= 50) continue;
    const geo = new THREE.IcosahedronGeometry(0.32 + Math.random() * 0.22, 0);
    const mat = new THREE.MeshPhysicalMaterial({ color: 0x7b7b7b, roughness: 0.8 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, 0.22, z);
    mesh.rotation.y = Math.random() * Math.PI;
    scene.add(mesh);
    extraObstacles.push({ x, z, r: 0.5 });
  }
  // Bushes
  for (let i = 0; i < 14; i++) {
    let x, z, tries = 0;
    do {
      x = (Math.random() - 0.5) * 90;
      z = (Math.random() - 0.5) * 90;
      tries++;
    } while (!isFarFromAll(x, z, 2.1) && tries < 50);
    if (tries >= 50) continue;
    const geo = new THREE.SphereGeometry(0.38 + Math.random() * 0.18, 5, 4);
    const mat = new THREE.MeshPhysicalMaterial({ color: 0x2e7d32, roughness: 0.7 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, 0.32, z);
    mesh.rotation.y = Math.random() * Math.PI;
    scene.add(mesh);
    extraObstacles.push({ x, z, r: 0.45 });
  }
  // Ponds (lakes with more fun shapes and sizes)
  for (let i = 0; i < 4; i++) {
    let x, z, tries = 0;
    do {
      x = (Math.random() - 0.5) * 85;
      z = (Math.random() - 0.5) * 85;
      tries++;
    } while ((Math.abs(x) < 4.5 && Math.abs(z) < 4.5) || !isFarFromAll(x, z, 4.5) && tries < 50);
    if (tries >= 50) continue;
    // Randomize shape: ellipse, polygon, or wobbly circle
    const shapeType = Math.random();
    let geo;
    if (shapeType < 0.33) {
      // Ellipse
      const rx = 1.2 + Math.random() * 1.8;
      const rz = 1.2 + Math.random() * 1.8;
      geo = new THREE.CircleGeometry(1, 28);
      geo.scale(rx, rz, 1);
    } else if (shapeType < 0.66) {
      // Irregular polygon
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
      // Wobbly circle
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
    const mat = new THREE.MeshPhysicalMaterial({ color: 0x4fc3f7, roughness: 0.25, metalness: 0.7, transparent: true, opacity: 0.82 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, 0.04, z);
    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);
    // Estimate radius for collision (bounding circle)
    let r = 2.2 + Math.random();
    extraObstacles.push({ x, z, r });
  }
}
addFunTerrainFeatures();

// --- Add giant floating billboards in corners (MOVED UP for early initialization) ---
function addBillboard(x, z, text, camPos, camLook) {
  // Compute angle to center (0,0)
  const angle = Math.atan2(x, z); // billboard faces center
  // Lower-res canvas for performance
  const CANVAS_W = 1024, CANVAS_H = 384;
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_W; canvas.height = CANVAS_H;
  const ctx = canvas.getContext('2d');
  // Store billboard animation state
  const billboardAnim = { canvas, ctx, tex: null, text, lastWaveT: 0, lastDrawFrame: 0 };
  // Billboard redraw function with animated waves
  function drawBillboardWaves(time) {
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    // Softer, lighter gradient background for index.html style
    const grad = ctx.createLinearGradient(0, 0, CANVAS_W, CANVAS_H);
    grad.addColorStop(0, '#f4f5ff');
    grad.addColorStop(0.5, '#f8fafc');
    grad.addColorStop(1, '#f5d0fe');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    // --- Animated SVG-like wave (left and right, more points, y-variation) ---
    const t = time * 0.001;
    const points = 44;
    const baseAmp = CANVAS_W * 0.08;
    const xBase = CANVAS_W * 0.08;
    // Left wave
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let i = 0; i <= points; i++) {
      // Add y-variation for more organic look
      let y = (CANVAS_H / points) * i;
      y += Math.sin(t * 0.8 + i * 0.25) * 7 + Math.cos(t * 0.5 + i * 0.13) * 4;
      const amp = baseAmp * (1.1 + 0.35 * Math.sin(t * 0.7 + i * 0.5));
      // Decrease frequency: much smaller phase increment per point
      const phase = t * 1.1 + i * 0.12 + Math.sin(t * 0.5 + i * 0.2) * 0.5;
      const x = Math.sin(phase) * amp + xBase;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(0, CANVAS_H);
    ctx.closePath();
    ctx.fillStyle = '#d946ef';
    ctx.fill();
    ctx.restore();
    // Right wave (mirrored)
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.translate(CANVAS_W, 0);
    ctx.scale(-1, 1);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let i = 0; i <= points; i++) {
      let y = (CANVAS_H / points) * i;
      y += Math.cos(t * 0.8 + i * 0.25 + 1.7) * 7 + Math.sin(t * 0.5 + i * 0.13 + 1.7) * 4;
      const amp = baseAmp * (1.1 + 0.35 * Math.cos(t * 0.7 + i * 0.5 + 1.7));
      // Decrease frequency: much smaller phase increment per point
      const phase = t * 1.1 + i * 0.12 + 2.2 + Math.cos(t * 0.5 + i * 0.2 + 1.7) * 0.5;
      const x = Math.sin(phase) * amp + xBase;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(0, CANVAS_H);
    ctx.closePath();
    ctx.fillStyle = '#d946ef';
    ctx.fill();
    ctx.restore();
    // Decorative border (purple gradient)
    ctx.lineWidth = 12;
    const borderGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    borderGrad.addColorStop(0, '#d946ef');
    borderGrad.addColorStop(1, '#a21caf');
    ctx.strokeStyle = borderGrad;
    ctx.strokeRect(6, 6, CANVAS_W - 12, CANVAS_H - 12);
    // Main title: scaled for new canvas size
    ctx.font = '900 85px Montserrat, Helvetica Neue, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#f5d0fe';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#232946';
    ctx.fillText(text, CANVAS_W / 2, 168);
    ctx.shadowBlur = 0;
    // Subtle drop shadow for 3D effect
    ctx.shadowColor = '#a21caf';
    ctx.shadowBlur = 5;
    ctx.fillStyle = 'rgba(217,70,239,0.08)';
    ctx.fillRect(20, 20, CANVAS_W - 40, CANVAS_H - 40);
  }
  // Initial draw
  drawBillboardWaves(0);
  // Texture
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  billboardAnim.tex = tex;
  // Use MeshBasicMaterial for text (unlit, always visible)
  const textMat = new THREE.MeshBasicMaterial({ map: tex, transparent: false, side: THREE.FrontSide });
  // Billboard is much larger now, but texture is lower-res (Three.js will scale it up)
  const textMesh = new THREE.Mesh(new THREE.PlaneGeometry(32, 13), textMat);
  textMesh.position.set(x, 9.5, z); // raise higher for visibility
  textMesh.rotation.y = angle + Math.PI; // flip to face inward and not be mirrored
  textMesh.userData = { billboardName: text, billboardCamPos: camPos, billboardCamLook: camLook, billboardAnim };
  textMesh.cursor = 'pointer';
  textMesh.name = `billboard-${text.toLowerCase().replace(/\s+/g, '-')}`;
  scene.add(textMesh);
  if (!window._billboardMeshes) window._billboardMeshes = [];
  window._billboardMeshes.push(textMesh);

  // Add a child mesh for the (click me!) text, styled like h2, balanced size and no outline
  const clickCanvas = document.createElement('canvas');
  clickCanvas.width = 400; clickCanvas.height = 64;
  const clickCtx = clickCanvas.getContext('2d');
  clickCtx.clearRect(0, 0, 400, 64);
  clickCtx.font = 'bold 32px Montserrat, Arial, sans-serif';
  clickCtx.textAlign = 'center';
  clickCtx.textBaseline = 'middle';
  clickCtx.shadowColor = '#f5d0fe';
  clickCtx.shadowBlur = 4;
  clickCtx.fillStyle = '#d946ef';
  clickCtx.fillText('(click me!)', 200, 32);
  clickCtx.shadowBlur = 0;
  // No outline/stroke for better legibility
  const clickTex = new THREE.CanvasTexture(clickCanvas);
  clickTex.anisotropy = 4;
  clickTex.needsUpdate = true;
  const clickMat = new THREE.MeshBasicMaterial({ map: clickTex, transparent: true, side: THREE.FrontSide });
  const clickMesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 2.1), clickMat);
  clickMesh.position.set(0, -4.3, 0.01); // just below the main title
  clickMesh.visible = false;
  textMesh.add(clickMesh);
  textMesh.userData.clickMesh = clickMesh;
  // Attach the redraw function for animation
  textMesh.userData.redrawBillboardWaves = drawBillboardWaves;
}
// Billboard snap zones: NW, NE, SE corners (same as billboards)
const billboardData = [
  {
    name: 'fun',
    x: -55, z: -55
  },
  {
    name: 'about me',
    x: 55, z: -55
  },
  {
    name: 'projects',
    x: 55, z: 55
  }
].map(b => {
  // Billboard center
  const center = new THREE.Vector3(b.x, 9.5, b.z);
  // Billboard faces toward (0,0), so normal is (b.x, b.z) -> (0,0)
  const angle = Math.atan2(b.x, b.z);
  // Normal vector (from billboard outwards)
  const normal = new THREE.Vector3(-Math.sin(angle), 0, -Math.cos(angle));
  // Camera position: distance (30) in front of billboard, and at y=12
  const camPos = center.clone().add(normal.clone().multiplyScalar(30));
  camPos.y = 12;
  return {
    ...b,
    camPos,
    camLook: center
  };
});
// Place three giant floating billboards: NW, NE, SE corners, just outside terrain
for (const b of billboardData) {
  addBillboard(b.x, b.z, b.name, b.camPos, b.camLook);
}

// --- Car hitbox (OBB) and collision helpers ---
function getCarOBB() {
  // Car body: 1.7 x 2.5 (x,z), centered at carPos, rotated by carRot
  const hw = 0.85, hl = 1.25; // half-width, half-length
  const center = { x: carPos.x, z: carPos.z };
  const angle = carRot;
  return { center, hw, hl, angle };
}
function pointInOBB(px, pz, obb) {
  // Transform point into OBB local space
  const dx = px - obb.center.x;
  const dz = pz - obb.center.z;
  const cos = Math.cos(-obb.angle), sin = Math.sin(-obb.angle);
  const lx = dx * cos - dz * sin;
  const lz = dx * sin + dz * cos;
  return Math.abs(lx) <= obb.hw && Math.abs(lz) <= obb.hl;
}
function obbCircleIntersect(obb, cx, cz, cr) {
  // Find closest point on OBB to circle center
  const dx = cx - obb.center.x;
  const dz = cz - obb.center.z;
  const cos = Math.cos(-obb.angle), sin = Math.sin(-obb.angle);
  const lx = dx * cos - dz * sin;
  const lz = dx * sin + dz * cos;
  const clx = Math.max(-obb.hw, Math.min(obb.hw, lx));
  const clz = Math.max(-obb.hl, Math.min(obb.hl, lz));
  const wx = clx - lx, wz = clz - lz;
  return (wx * wx + wz * wz) <= cr * cr;
}

// --- Tree hitboxes (cylinder, trunk only) ---
const treeHitboxes = treePositions.map(t => ({ x: t.x, z: t.z, r: 0.22 }));

// Wheels geometry/material must be defined before use
const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.3, 20);
const wheelMat = new THREE.MeshPhysicalMaterial({ color: 0x232946, metalness: 0.6, roughness: 0.5 });

// Car (Pontiac Fiero-inspired, more detailed: wedge, mirrors, spoiler, better proportions)
const car = new THREE.Group();
// Main wedge body
const bodyGeo = new THREE.BoxGeometry(1.7, 0.38, 2.5);
const bodyMat = new THREE.MeshPhysicalMaterial({ color: 0xc22b3a, metalness: 0.7, roughness: 0.3 });
const body = new THREE.Mesh(bodyGeo, bodyMat);
body.position.y = 0.41;
car.add(body);
// Sloped hood (front wedge, now at -Z)
const hoodGeo = new THREE.BoxGeometry(1.7, 0.18, 0.7);
const hood = new THREE.Mesh(hoodGeo, bodyMat);
hood.position.set(0, 0.32, -1.0);
hood.rotation.x = Math.PI / 9;
car.add(hood);
// Cabin (angular, low, more wedge)
const cabinGeo = new THREE.BoxGeometry(1.08, 0.29, 0.92);
const cabinMat = new THREE.MeshPhysicalMaterial({ color: 0xf4f5ff, metalness: 0.2, roughness: 0.1, transparent: true, opacity: 0.92 });
const cabin = new THREE.Mesh(cabinGeo, cabinMat);
cabin.position.set(0, 0.66, -0.18);
cabin.rotation.x = Math.PI / 22;
car.add(cabin);
// Rear deck (trunk, now at +Z)
const rearGeo = new THREE.BoxGeometry(1.5, 0.18, 0.7);
const rearMat = new THREE.MeshPhysicalMaterial({ color: 0x8b1e2d, metalness: 0.7, roughness: 0.3 });
const rear = new THREE.Mesh(rearGeo, rearMat);
rear.position.set(0, 0.32, 1.0);
car.add(rear);
// Pop-up headlights (stylized, now at -Z)
const popupGeo = new THREE.BoxGeometry(0.18, 0.09, 0.18);
const popupMat = new THREE.MeshPhysicalMaterial({ color: 0xfafafa, metalness: 0.1, roughness: 0.2 });
for (let i = -1; i <= 1; i += 2) {
  const popup = new THREE.Mesh(popupGeo, popupMat);
  popup.position.set(0.32 * i, 0.48, -1.32);
  car.add(popup);
}
// Front bumper (thin, now at -Z)
const bumperGeo = new THREE.BoxGeometry(1.2, 0.11, 0.18);
const bumperMat = new THREE.MeshPhysicalMaterial({ color: 0x232946, metalness: 0.6, roughness: 0.2 });
const bumper = new THREE.Mesh(bumperGeo, bumperMat);
bumper.position.set(0, 0.26, -1.36);
car.add(bumper);
// Rear bumper (now at +Z)
const rearBumper = new THREE.Mesh(bumperGeo, bumperMat);
rearBumper.position.set(0, 0.26, 1.36);
car.add(rearBumper);
// Taillights (stylized bar, now at +Z)
const tailGeo = new THREE.BoxGeometry(0.9, 0.08, 0.08);
const tailMat = new THREE.MeshPhysicalMaterial({ color: 0xffa500, metalness: 0.3, roughness: 0.2 });
const tail = new THREE.Mesh(tailGeo, tailMat);
tail.position.set(0, 0.36, 1.41);
car.add(tail);
// Side mirrors (move to -Z side)
const mirrorGeo = new THREE.BoxGeometry(0.13, 0.06, 0.18);
const mirrorMat = new THREE.MeshPhysicalMaterial({ color: 0x232946, metalness: 0.5, roughness: 0.3 });
for (let i = -1; i <= 1; i += 2) {
  const mirror = new THREE.Mesh(mirrorGeo, mirrorMat);
  mirror.position.set(0.62 * i, 0.68, -0.55);
  mirror.rotation.y = Math.PI / 7 * i;
  car.add(mirror);
}
// Rear spoiler (now at +Z)
const spoilerGeo = new THREE.BoxGeometry(0.7, 0.06, 0.18);
const spoilerMat = new THREE.MeshPhysicalMaterial({ color: 0x232946, metalness: 0.7, roughness: 0.2 });
const spoiler = new THREE.Mesh(spoilerGeo, spoilerMat);
spoiler.position.set(0, 0.54, 1.28);
car.add(spoiler);
// Wheels (slightly inset, larger rear, positions mirrored)
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

// Car physics
let carPos = new THREE.Vector3(0, 0, 0);
let carRot = 0; // Yaw
let carSpeed = 0;
let carSteer = 0;
const maxSpeed = 10 / 30; // Set so speedometer maxes at 10 (since speedometer is carSpeed * 30)
const accel = 0.018;   // Slightly increased for snappier acceleration
const friction = 0.98;
const steerSpeed = 0.035;

// UI elements
const instructionBar = document.getElementById('instruction-bar');
const speedometer = document.getElementById('speedometer');
let drivingStarted = false;

const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, w: false, a: false, s: false, d: false };
document.addEventListener('keydown', e => {
  if (e.key in keys) {
    keys[e.key] = true;
    if (!drivingStarted && (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'w' || e.key === 'a' || e.key === 's' || e.key === 'd')) {
      drivingStarted = true;
      if (instructionBar) instructionBar.classList.add('hide');
    }
  }
});
document.addEventListener('keyup', e => {
  if (e.key in keys) keys[e.key] = false;
});

let inBillboardZone = null;
let camSnapLerp = 0; // 0 = follow, 1 = snapped

function updateCamera() {
  // Check if car is in a billboard snap zone
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
  // Show/hide (click me!) text on billboards
  if (window._billboardMeshes) {
    for (const mesh of window._billboardMeshes) {
      if (mesh.userData && mesh.userData.clickMesh) {
        mesh.userData.clickMesh.visible = !!snap && mesh.userData.billboardName.toLowerCase() === snap?.name.toLowerCase();
      }
    }
  }
  // Smoothly transition in/out of snap mode
  if (snap) {
    if (inBillboardZone !== snap) camSnapLerp = 0; // entering new zone
    inBillboardZone = snap;
    camSnapLerp += 0.08;
    if (camSnapLerp > 1) camSnapLerp = 1;
  } else {
    inBillboardZone = null;
    camSnapLerp -= 0.08;
    if (camSnapLerp < 0) camSnapLerp = 0;
  }
  // Third-person follow camera: behind and above car
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
  // If in snap mode or transitioning out, smoothly interpolate both position and lookAt between follow and billboard
  if ((camSnapLerp > 0 && inBillboardZone) || camSnapLerp > 0) {
    // Use the last billboard zone for smooth exit
    const snapZone = inBillboardZone || lastBillboardZone;
    camera.position.lerpVectors(followPos, snapZone.camPos, camSnapLerp);
    const lookTarget = new THREE.Vector3().lerpVectors(followLook, snapZone.camLook, camSnapLerp);
    camera.up.set(0, 1, 0);
    camera.lookAt(lookTarget);
  } else {
    camera.position.lerp(followPos, 0.18);
    camera.up.set(0, 1, 0);
    camera.lookAt(followLook);
  }
}

// Track the last billboard zone for smooth exit
let lastBillboardZone = null;
// --- Billboard info popup/modal ---
let infoModal = null;
function showBillboardInfo(name) {
  if (infoModal) infoModal.remove();
  infoModal = document.createElement('div');
  infoModal.className = 'billboard-info-modal';
  // Content for each billboard
  let html = '';
  if (name.toLowerCase() === 'about me') {
    html = `
      <h2>about me!</h2>
      <ul>
        <li>hi, i'm kavin!</li>
        <li>i am an aspiring software engineer, currently in high school.</li>
        <li>i live in princeton, nj.</li>
        <li>on the internet, i often go by <span class="username">NicholasIGuess</span>, <span class="username">NichSembley</span>, or sometimes <span class="username">Antipanic</span>.</li>
        <li>i, along with a few of my friends, go to hackathons and make stuff a lot. check the projects billboard!</li>
      </ul>
      <h2>contact me on:</h2>
      <ul>
        <li><a href="https://github.com/NicholasIGuess" target="_blank">Github</a></li>
        <li><a href="mailto:nichiguess@gmail.com">Email</a></li>
      </ul>
    `;
  } else if (name.toLowerCase() === 'projects') {
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
  } else if (name.toLowerCase() === 'fun') {
    html = `<h2>Fun</h2><p>drive around and have fun! i'll add a racetrack sort of thing at some point</p>`;
  }
  infoModal.innerHTML = `
    <div class="billboard-info-content">
      <button class="billboard-info-close" title="Close">&times;</button>
      ${html}
    </div>
  `;
  document.body.appendChild(infoModal);
  // Close logic
  infoModal.querySelector('.billboard-info-close').onclick = () => infoModal.remove();
  infoModal.onclick = e => { if (e.target === infoModal) infoModal.remove(); };
}

// --- Auto-close info popup when leaving billboard zone ---
let lastPopupZone = null;
function updateCameraWrapper() {
  // Save the previous inBillboardZone before updateCamera
  const prevZone = inBillboardZone;
  updateCamera();
  if (inBillboardZone) {
    lastBillboardZone = inBillboardZone;
  } else if (camSnapLerp > 0 && prevZone) {
    lastBillboardZone = prevZone;
  }
  // Auto-close info popup if leaving the zone
  if (infoModal) {
    if (!inBillboardZone) {
      infoModal.remove();
      infoModal = null;
    }
  }
}

// --- Car movement and physics (restored original logic) ---
function updateCar() {
  // Determine if turning
  let turning = (keys.ArrowLeft || keys.a || keys.ArrowRight || keys.d);
  // Set max speed and acceleration based on state
  let currentMaxSpeed = maxSpeed;
  let currentAccel = accel;
  if (turning) {
    currentMaxSpeed = maxSpeed * 0.9; // 10% less max speed when turning
    currentAccel = accel * 0.9;
  }
  // Acceleration
  if (keys.ArrowUp || keys.w) carSpeed += currentAccel;
  if (keys.ArrowDown || keys.s) carSpeed -= currentAccel * 0.8;
  carSpeed *= friction;
  carSpeed = Math.max(Math.min(carSpeed, currentMaxSpeed), -currentMaxSpeed * 0.6);
  // Steering
  let steerMult = 1;
  if (keys.ArrowLeft || keys.a) carSteer = Math.max(carSteer - steerSpeed * steerMult, -0.045 * steerMult);
  else if (keys.ArrowRight || keys.d) carSteer = Math.min(carSteer + steerSpeed * steerMult, 0.045 * steerMult);
  else carSteer *= 0.7;
  carRot -= carSteer * carSpeed * 2.5;
  // Save previous position
  const prevX = carPos.x;
  const prevZ = carPos.z;
  // Move car
  carPos.x += Math.sin(carRot) * carSpeed;
  carPos.z += Math.cos(carRot) * carSpeed;
  // Collision with trees
  let collided = false;
  for (const tree of treeHitboxes) {
    const dx = carPos.x - tree.x;
    const dz = carPos.z - tree.z;
    if (dx * dx + dz * dz < 1.25) // collision radius (car+tree)
      collided = true;
  }
  // Collision with rocks, bushes, ponds
  if (!collided) {
    for (const o of extraObstacles) {
      const dx = carPos.x - o.x;
      const dz = carPos.z - o.z;
      if (dx * dx + dz * dz < (o.r + 0.7) * (o.r + 0.7)) { // car radius ~0.7
        collided = true;
        break;
      }
    }
  }
  if (collided) {
    carPos.x = prevX;
    carPos.z = prevZ;
    carSpeed *= -0.18; // bounce back a bit
  }
  // Clamp car within ground bounds (invisible wall)
  const halfGround = 50 - 1.1;
  let clampedX = false, clampedZ = false;
  let newX = Math.max(-halfGround, Math.min(halfGround, carPos.x));
  let newZ = Math.max(-halfGround, Math.min(halfGround, carPos.z));
  if (newX !== carPos.x) clampedX = true;
  if (newZ !== carPos.z) clampedZ = true;
  carPos.x = newX;
  carPos.z = newZ;
  // Only set speed to zero if clamped on both axes (fully stuck)
  if (clampedX && clampedZ) carSpeed = 0;
  car.position.set(carPos.x, 0.2, carPos.z);
  car.rotation.y = carRot;
  // Animate wheels based on speed
  for (const wheel of wheels) {
    wheel.rotation.x -= carSpeed * 2.5;
  }
  // Update speedometer
  if (speedometer) {
    speedometer.textContent = `Speed: ${(Math.abs(carSpeed) * 30).toFixed(2)}`;
  }
}

// --- Billboard interaction (raycasting) ---
const raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let billboardClickable = false;
let lastHoveredBillboard = null;

function setBillboardClickable(state) {
  billboardClickable = state;
  renderer.domElement.style.cursor = state ? 'pointer' : '';
}

renderer.domElement.addEventListener('pointermove', e => {
  if (!billboardClickable) return;
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(window._billboardMeshes || []);
  if (intersects.length > 0) {
    renderer.domElement.style.cursor = 'pointer';
    lastHoveredBillboard = intersects[0].object;
  } else {
    renderer.domElement.style.cursor = '';
    lastHoveredBillboard = null;
  }
});

renderer.domElement.addEventListener('pointerdown', e => {
  if (!billboardClickable) return;
  if (lastHoveredBillboard) {
    showBillboardInfo(lastHoveredBillboard.userData.billboardName);
  }
});

/* Add popup/modal styles */
const style = document.createElement('style');
style.textContent = `
.billboard-info-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(36, 14, 53, 0.13); /* reduced opacity */
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

// --- Billboard wave animation ---
function animateBillboardWaves(time) {
  if (!window._billboardMeshes) return;
  for (const mesh of window._billboardMeshes) {
    const canvas = mesh.userData.waveCanvas;
    const ctx = mesh.userData.waveCtx;
    const text = mesh.userData.waveText;
    if (!canvas || !ctx) continue;
    // Animate control points with time
    const t = time * 0.001;
    ctx.clearRect(0, 0, 4096, 1536);
    // Gradient background
    const grad = ctx.createLinearGradient(0, 0, 4096, 1536);
    grad.addColorStop(0, '#f4f5ff');
    grad.addColorStop(0.5, '#f8fafc');
    grad.addColorStop(1, '#f5d0fe');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 4096, 1536);
    // --- Animated SVG wave (left) ---
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    // Animate control points with sine/cos
    const wave1 = 400 + Math.sin(t * 1.2) * 60;
    const wave2 = 800 + Math.cos(t * 0.9 + 1.2) * 80;
    ctx.bezierCurveTo(0, wave1, 0, wave2, 0, 1536);
    const wave3 = 1200 + Math.sin(t * 1.5 + 0.7) * 90;
    const wave4 = 900 + Math.cos(t * 1.1 + 2.1) * 70;
    ctx.bezierCurveTo(180, wave3, 220, wave4, 0, 0);
    ctx.closePath();
    ctx.fillStyle = '#d946ef';
    ctx.fill();
    ctx.restore();
    // --- Animated SVG wave (right, mirrored) ---
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.translate(4096, 0);
    ctx.scale(-1, 1);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    // Use different phase for right wave for variety
    const wave1r = 400 + Math.sin(t * 1.2 + 2.5) * 60;
    const wave2r = 800 + Math.cos(t * 0.9 + 3.7) * 80;
    ctx.bezierCurveTo(0, wave1r, 0, wave2r, 0, 1536);
    const wave3r = 1200 + Math.sin(t * 1.5 + 2.2) * 90;
    const wave4r = 900 + Math.cos(t * 1.1 + 4.1) * 70;
    ctx.bezierCurveTo(180, wave3r, 220, wave4r, 0, 0);
    ctx.closePath();
    ctx.fillStyle = '#d946ef';
    ctx.fill();
    ctx.restore();
    // Decorative border (purple gradient)
    ctx.lineWidth = 44;
    const borderGrad = ctx.createLinearGradient(0, 0, 0, 1536);
    borderGrad.addColorStop(0, '#d946ef');
    borderGrad.addColorStop(1, '#a21caf');
    ctx.strokeStyle = borderGrad;
    ctx.strokeRect(22, 22, 4096 - 44, 1536 - 44);
    // Main title
    ctx.font = '900 340px Montserrat, Helvetica Neue, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#f5d0fe';
    ctx.shadowBlur = 32;
    ctx.fillStyle = '#232946';
    ctx.fillText(text, 2048, 670);
    ctx.shadowBlur = 0;
    ctx.shadowColor = '#a21caf';
    ctx.shadowBlur = 18;
    ctx.fillStyle = 'rgba(217,70,239,0.08)';
    ctx.fillRect(80, 80, 4096 - 160, 1536 - 160);
    // Mark texture for update
    if (mesh.material.map) mesh.material.map.needsUpdate = true;
  }
}

function animate() {
  requestAnimationFrame(animate);
  updateCar();
  updateCameraWrapper();
  // Animate billboard waves every 3rd frame only, and only if billboard is in camera frustum
  if (window._billboardMeshes) {
    const now = performance.now();
    if (!window._billboardFrame) window._billboardFrame = 0;
    window._billboardFrame++;
    if (window._billboardFrame % 3 === 0) {
      // Setup frustum for visibility check
      const frustum = new THREE.Frustum();
      const camViewProj = new THREE.Matrix4();
      camViewProj.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
      frustum.setFromProjectionMatrix(camViewProj);
      for (const mesh of window._billboardMeshes) {
        // Only update if at least partially in view
        if (frustum.intersectsObject(mesh)) {
          if (mesh.userData && mesh.userData.redrawBillboardWaves && mesh.userData.billboardAnim) {
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
// ===== 星球宇宙展示 - Three.js 版 =====
// 第1块：环境与骨架（场景/相机/渲染器/光源/星空背景）

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000008);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 8, 18);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// 光源：弱环境光 + 后续太阳点光源
scene.add(new THREE.AmbientLight(0x333355, 0.5));

// 星空背景：大量随机分布的小点
const starGeo = new THREE.BufferGeometry();
const starCount = 2000;
const starPos = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) {
  starPos[i] = (Math.random() - 0.5) * 200;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const stars = new THREE.Points(
  starGeo,
  new THREE.PointsMaterial({ color: 0xffffff, size: 0.15, sizeAttenuation: true })
);
scene.add(stars);

// ===== 主体天体 =====

// 太阳：自发光球体 + 点光源（照亮整个星系）
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(1.2, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xffaa33 })
);
scene.add(sun);

const sunLight = new THREE.PointLight(0xffffff, 1.5, 100);
sun.add(sunLight); // 光源挂在太阳上，随太阳运动

// 行星定义：名称、半径、颜色、轨道半径、公转速度、自转速度
const planetData = [
  { name: 'mercury', r: 0.25, color: 0xaaaaaa, orbit: 2.6, speed: 0.04, spin: 0.02 },
  { name: 'earth',   r: 0.45, color: 0x2e7dd8, orbit: 4.2, speed: 0.02, spin: 0.03 },
  { name: 'mars',    r: 0.35, color: 0xc1440e, orbit: 5.8, speed: 0.013, spin: 0.025 },
  { name: 'saturn',  r: 0.7,  color: 0xe8d5a3, orbit: 8.0, speed: 0.008, spin: 0.04 }
];

// 用 pivot Group 实现公转：行星放在 pivot 的子节点，旋转 pivot 即公转
const planets = [];
planetData.forEach(p => {
  const pivot = new THREE.Group();
  scene.add(pivot);

  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(p.r, 32, 32),
    new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.8 })
  );
  mesh.position.x = p.orbit;
  pivot.add(mesh);

  // 土星加环：TorusGeometry
  if (p.name === 'saturn') {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(p.r * 1.7, 0.08, 16, 64),
      new THREE.MeshStandardMaterial({ color: 0xd4b896, side: THREE.DoubleSide })
    );
    ring.rotation.x = Math.PI / 2.3;
    mesh.add(ring);
  }

  // 轨道线：LineLoop 画圆
  const orbitPts = [];
  const seg = 128;
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    orbitPts.push(new THREE.Vector3(Math.cos(a) * p.orbit, 0, Math.sin(a) * p.orbit));
  }
  const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPts);
  const orbitLine = new THREE.LineLoop(
    orbitGeo,
    new THREE.LineBasicMaterial({ color: 0x444466, transparent: true, opacity: 0.4 })
  );
  scene.add(orbitLine);

  planets.push({ pivot, mesh, speed: p.speed, spin: p.spin });
});

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};
animate();

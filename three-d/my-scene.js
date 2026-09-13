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

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};
animate();

// --- Escena y renderer ---
const escena = new THREE.Scene();
const renderizador = new THREE.WebGLRenderer({ antialias: true });
renderizador.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderizador.domElement);

// --- Cámara ortográfica del tamaño de la ventana (en "pixeles") ---
const ancho = window.innerWidth;
const alto = window.innerHeight;
const camara = new THREE.OrthographicCamera(
  ancho / -2, ancho / 2, alto / 2, alto / -2, 0.1, 1000
);
camara.position.z = 10;

// ----- FIGURA 1: Cuadrado (plano) al centro -----
const geoCuadrado = new THREE.PlaneGeometry(100, 100);
const matCuadrado = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const cuadrado = new THREE.Mesh(geoCuadrado, matCuadrado);
escena.add(cuadrado);

// ----- FIGURA 2: Círculo a la izquierda (pulso + cambio de color) -----
const geoCirculo = new THREE.CircleGeometry(50, 64);
const matCirculo = new THREE.MeshBasicMaterial({ color: 0x2196f3, wireframe: true });
const circulo = new THREE.Mesh(geoCirculo, matCirculo);
circulo.position.x = -220;   // izquierda del cuadrado
escena.add(circulo);

// ----- FIGURA 3: Triángulo a la derecha (sube-baja + rotación inversa) -----
const geoTriangulo = new THREE.BufferGeometry();
const verticesTri = new Float32Array([
  0,   60, 0,   // vértice superior
 -50, -40, 0,   // vértice inferior izq
  50, -40, 0    // vértice inferior der
]);
geoTriangulo.setAttribute('position', new THREE.BufferAttribute(verticesTri, 3));
geoTriangulo.computeVertexNormals();

const matTriangulo = new THREE.MeshBasicMaterial({ color: 0xff5722, wireframe: true, side: THREE.DoubleSide });
const triangulo = new THREE.Mesh(geoTriangulo, matTriangulo);
triangulo.position.x = 220;  // derecha del cuadrado
escena.add(triangulo);

// ----- Animación -----
const reloj = new THREE.Clock();

function animacion() {
  requestAnimationFrame(animacion);
  const t = reloj.getElapsedTime();

  // Cuadrado: rotación constante
  cuadrado.rotation.z += 0.01;

  // Círculo: “latido” (escala) y cambio suave de color
  const escala = 1 + 0.2 * Math.sin(t * 2.0);
  circulo.scale.set(escala, escala, 1);
  const hue = (t * 0.1) % 1; // 0..1
  circulo.material.color.setHSL(hue, 1, 0.5);

  // Triángulo: movimiento vertical y rotación inversa
  triangulo.position.y = Math.sin(t * 1.5) * 40;  // sube y baja
  triangulo.rotation.z = -t * 0.8;                // rota en sentido contrario

  renderizador.render(escena, camara);
}

animacion();

// ----- Resize: mantener cámara ortográfica ligada a la ventana -----
window.addEventListener('resize', () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camara.left   = w / -2;
  camara.right  = w / 2;
  camara.top    = h / 2;
  camara.bottom = h / -2;
  camara.updateProjectionMatrix();
  renderizador.setSize(w, h);
});

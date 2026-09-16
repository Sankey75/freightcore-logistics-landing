import * as THREE from 'three';

export class TruckScene {
  constructor(container) {
    this.container = container;
    this.progress = 0;
    this.isMobile = window.innerWidth < 768;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
    this.scene.fog = new THREE.FogExp2(0xffffff, 0.02);

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(-15, 8, 15);
    this.camera.lookAt(0, 2, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.0 : 1.5));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    this.buildLighting();
    this.buildTruck();
    this.buildEnvironment();

    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.onWindowResize);

    this.clock = new THREE.Clock();
    this.animate = this.animate.bind(this);
    this.rafId = requestAnimationFrame(this.animate);
  }

  buildLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    this.sunLight.position.set(10, 20, 10);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 512;
    this.sunLight.shadow.mapSize.height = 512;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 50;
    this.sunLight.shadow.camera.left = -15;
    this.sunLight.shadow.camera.right = 15;
    this.sunLight.shadow.camera.top = 15;
    this.sunLight.shadow.camera.bottom = -15;
    this.scene.add(this.sunLight);

    const fillLight = new THREE.DirectionalLight(0xcce0ff, 0.4);
    fillLight.position.set(-10, 5, -10);
    this.scene.add(fillLight);
  }

  buildTruck() {
    this.truckGroup = new THREE.Group();
    this.wheels = [];

    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.1 });
    const cabMat = new THREE.MeshStandardMaterial({ color: 0x28559a, roughness: 0.3, metalness: 0.6 });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x111111, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.8, clearcoat: 1.0, clearcoatRoughness: 0.1
    });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });

    // Trailer
    const trailerGeo = new THREE.BoxGeometry(8, 3.5, 2.6);
    const trailer = new THREE.Mesh(trailerGeo, bodyMat);
    trailer.position.set(-1.5, 2.5, 0);
    trailer.castShadow = true;
    trailer.receiveShadow = true;
    this.truckGroup.add(trailer);

    // Trailer Branding
    const brandGeo = new THREE.PlaneGeometry(6, 1.5);
    const brandMat = new THREE.MeshBasicMaterial({ color: 0x28559a });
    const brandLeft = new THREE.Mesh(brandGeo, brandMat);
    brandLeft.position.set(-1.5, 2.5, 1.31);
    this.truckGroup.add(brandLeft);
    const brandRight = new THREE.Mesh(brandGeo, brandMat);
    brandRight.position.set(-1.5, 2.5, -1.31);
    brandRight.rotation.y = Math.PI;
    this.truckGroup.add(brandRight);

    // Cabin
    const cabGeo = new THREE.BoxGeometry(2.5, 2.5, 2.6);
    const cab = new THREE.Mesh(cabGeo, cabMat);
    cab.position.set(4, 2.0, 0);
    cab.castShadow = true;
    cab.receiveShadow = true;
    this.truckGroup.add(cab);

    // Windshield
    const windGeo = new THREE.PlaneGeometry(2.4, 1.2);
    const wind = new THREE.Mesh(windGeo, glassMat);
    wind.position.set(5.26, 2.3, 0);
    wind.rotation.y = Math.PI / 2;
    this.truckGroup.add(wind);

    // Headlights
    const hlGeo = new THREE.BoxGeometry(0.2, 0.4, 0.6);
    const hlMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const hl1 = new THREE.Mesh(hlGeo, hlMat);
    hl1.position.set(5.26, 1.2, 1.0);
    this.truckGroup.add(hl1);
    const hl2 = new THREE.Mesh(hlGeo, hlMat);
    hl2.position.set(5.26, 1.2, -1.0);
    this.truckGroup.add(hl2);

    // Headlight glow
    this.headlights = [];
    [-1.0, 1.0].forEach(z => {
      const spotLight = new THREE.SpotLight(0xffffee, 2, 20, Math.PI/6, 0.5, 1);
      spotLight.position.set(5.3, 1.2, z);
      spotLight.target.position.set(10, 0, z);
      this.truckGroup.add(spotLight);
      this.truckGroup.add(spotLight.target);
      this.headlights.push(spotLight);
    });

    // Wheels
    const createWheel = (x, y, z) => {
      const wheelGroup = new THREE.Group();
      const tireGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 24);
      const tire = new THREE.Mesh(tireGeo, tireMat);
      tire.rotation.x = Math.PI / 2;
      tire.castShadow = true;
      wheelGroup.add(tire);
      
      const rimGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.42, 16);
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.x = Math.PI / 2;
      wheelGroup.add(rim);

      wheelGroup.position.set(x, y, z);
      this.truckGroup.add(wheelGroup);
      this.wheels.push(wheelGroup);
    };

    createWheel(4, 0.6, 1.3);
    createWheel(4, 0.6, -1.3);
    createWheel(1.5, 0.6, 1.3);
    createWheel(1.5, 0.6, -1.3);
    createWheel(-3.5, 0.6, 1.3);
    createWheel(-3.5, 0.6, -1.3);
    createWheel(-4.8, 0.6, 1.3);
    createWheel(-4.8, 0.6, -1.3);

    this.scene.add(this.truckGroup);
  }

  buildEnvironment() {
    this.envGroup = new THREE.Group();

    // Ground
    const groundGeo = new THREE.PlaneGeometry(1000, 200);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 1, metalness: 0 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.envGroup.add(ground);

    // Road
    const roadGeo = new THREE.PlaneGeometry(1000, 8);
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9 });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.y = 0.01;
    this.envGroup.add(road);

    // Road markings (static)
    this.markings = [];
    const markGeo = new THREE.PlaneGeometry(2, 0.2);
    const markMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let i = -50; i < 50; i++) {
      const mark = new THREE.Mesh(markGeo, markMat);
      mark.rotation.x = -Math.PI / 2;
      mark.position.set(i * 10, 0.02, 0);
      this.envGroup.add(mark);
      this.markings.push(mark);
    }

    // Scenery boxes (static)
    this.scenery = [];
    const boxGeo = new THREE.BoxGeometry(4, 6, 4);
    const boxMat1 = new THREE.MeshStandardMaterial({ color: 0xbfbfbf });
    const boxMat2 = new THREE.MeshStandardMaterial({ color: 0x00a651 });
    
    for (let i = -30; i < 30; i++) {
      const mesh = new THREE.Mesh(boxGeo, Math.random() > 0.5 ? boxMat1 : boxMat2);
      const z = Math.random() > 0.5 ? 8 + Math.random() * 10 : -8 - Math.random() * 10;
      mesh.position.set(i * 15, 3, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.envGroup.add(mesh);
      this.scenery.push(mesh);
    }

    this.scene.add(this.envGroup);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.isMobile = window.innerWidth < 768;
  }

  seek(progress) {
    this.progress = Math.max(0, Math.min(1, progress));
  }

  animate() {
    this.rafId = requestAnimationFrame(this.animate);
    const delta = Math.min(this.clock.getDelta(), 0.05);

    if (!this.prefersReducedMotion) {
      const p = this.progress;
      
      // Calculate truck position (from x = -200 to x = 200)
      const startX = -200;
      const endX = 200;
      const totalDistance = endX - startX;
      
      // Physical coordinate of the truck based strictly on scroll
      const truckX = startX + (p * totalDistance);
      
      // We calculate a virtual delta to keep wheels turning correctly
      // (derivative of position + a tiny idle crawl)
      const prevX = this.truckGroup.position.x || startX;
      const deltaX = truckX - prevX;
      const idleCrawl = this.clock.getDelta() * 0.5; // moves 0.5 units per sec when not scrolling
      
      // Set physical position
      this.truckGroup.position.x = truckX + (this.clock.getElapsedTime() * 0.5); // Add idle time to position
      const actualX = this.truckGroup.position.x;
      
      // Wheels rotate based on physical distance traveled
      this.wheels.forEach(w => {
        w.rotation.z -= (deltaX + idleCrawl) * 1.5;
      });

      // Subtle suspension bounce based on physical distance traveled
      this.truckGroup.position.y = Math.sin(actualX * 0.5) * 0.05 + Math.sin(Date.now() * 0.02) * 0.01;
      this.truckGroup.rotation.z = Math.sin(actualX * 0.2) * 0.005;
      this.truckGroup.rotation.x = Math.sin(actualX * 0.15) * 0.01;

      // Ensure shadow follows the truck
      this.sunLight.position.x = actualX + 10;
      this.sunLight.target.position.x = actualX;
      this.sunLight.target.updateMatrixWorld();

      // Cinematic Camera Tracking
      const cam = this.camera;
      
      // The camera has an offset from the truck's current position
      // By changing the offset over the journey, we get a cinematic track
      let offsetX, offsetY, offsetZ;
      
      if (p < 0.1) {
        // Wide establishing shot
        const t = p / 0.1;
        offsetX = THREE.MathUtils.lerp(15, -10, t);
        offsetY = THREE.MathUtils.lerp(6, 5, t);
        offsetZ = THREE.MathUtils.lerp(15, 20, t);
      } else if (p < 0.4) {
        // Pushing in on the side (acceleration)
        const t = (p - 0.1) / 0.3;
        offsetX = THREE.MathUtils.lerp(-10, -18, t);
        offsetY = THREE.MathUtils.lerp(5, 6, t);
        offsetZ = THREE.MathUtils.lerp(20, 12, t);
      } else if (p < 0.7) {
        // High cruising perspective
        const t = (p - 0.4) / 0.3;
        offsetX = THREE.MathUtils.lerp(-18, -8, t);
        offsetY = THREE.MathUtils.lerp(6, 12, t);
        offsetZ = THREE.MathUtils.lerp(12, 25, t);
      } else if (p < 0.9) {
        // Swoop around to the front/side for hub entry
        const t = (p - 0.7) / 0.2;
        offsetX = THREE.MathUtils.lerp(-8, 10, t);
        offsetY = THREE.MathUtils.lerp(12, 15, t);
        offsetZ = THREE.MathUtils.lerp(25, 20, t);
      } else {
        // Final delivery wide shot
        const t = (p - 0.9) / 0.1;
        offsetX = THREE.MathUtils.lerp(10, 18, t);
        offsetY = THREE.MathUtils.lerp(15, 8, t);
        offsetZ = THREE.MathUtils.lerp(20, 15, t);
      }
      
      // The camera moves with the truck, plus the cinematic offset
      cam.position.set(actualX + offsetX, offsetY, offsetZ);
      
      // Slight camera shake based on speed (deltaX)
      const shake = (Math.abs(deltaX) > 0.1) ? Math.sin(Date.now() * 0.05) * 0.02 : 0;
      
      // Look at the truck
      cam.lookAt(actualX, this.truckGroup.position.y + 2 + shake, this.truckGroup.position.z);
    }

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onWindowResize);
    
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }

    this.scene.traverse((object) => {
      if (object.isMesh) {
        object.geometry.dispose();
        if (object.material.isMaterial) {
          object.material.dispose();
        } else {
          for (const material of object.material) material.dispose();
        }
      }
    });

    this.renderer.dispose();
  }
}

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ExoplanetVisualization = ({ features }) => {
  const containerRef = useRef(null);
  const animationIdRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !features) return;

    // Configuración de la escena
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    rendererRef.current = renderer;

    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setClearColor(0x000000, 1);

    containerRef.current.appendChild(renderer.domElement);

    // Extraer datos de características
    const pradEarth = features.koi_prad || features.planetRadius || 1;
    const sradSolar = features.koi_srad || 1;
    const teqKelvin = features.koi_teq || 273;
    const steffKelvin = features.koi_steff || 5700;

    // Determinar color del planeta según temperatura
    let planetColor, planetDesc;
    const tempCelsius = teqKelvin - 273;

    if (teqKelvin < 273) {
      planetColor = 0xadd8e6;
      planetDesc = `${Math.round(tempCelsius)}°C (Helado)`;
    } else if (teqKelvin <= 373) {
      planetColor = 0x2e8b57;
      planetDesc = `${Math.round(tempCelsius)}°C (Templado)`;
    } else {
      planetColor = 0xff4500;
      planetDesc = `${Math.round(tempCelsius)}°C (Caliente)`;
    }

    // Determinar color de la estrella según temperatura
    let starColor;
    if (steffKelvin < 4000) {
      starColor = 0xff8c00;
    } else if (steffKelvin <= 6000) {
      starColor = 0xffd700;
    } else {
      starColor = 0xe0ffff;
    }

    // Crear Estrella Anfitriona
    const starRadius = Math.max(3, sradSolar * 3);
    const starGeometry = new THREE.SphereGeometry(starRadius, 32, 32);
    const starMaterial = new THREE.MeshBasicMaterial({
      color: starColor,
      emissive: starColor,
      emissiveIntensity: 0.5
    });
    const star = new THREE.Mesh(starGeometry, starMaterial);
    star.position.x = -15;
    scene.add(star);

    // Glow de la estrella
    const glowGeometry = new THREE.SphereGeometry(starRadius * 1.2, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: starColor,
      transparent: true,
      opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.x = star.position.x;
    scene.add(glow);

    // Crear Exoplaneta
    const planetRadius = Math.max(0.8, pradEarth * 0.8);
    const geometry = new THREE.SphereGeometry(planetRadius, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: planetColor,
      shininess: 30
    });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.x = 0;
    scene.add(planet);

    // Crear Tierra de referencia
    const earthRadius = 0.8;
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 32, 32);
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x4a9eff,
      shininess: 30
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.x = 15;
    scene.add(earth);

    // --- Iluminación MEJORADA ---
    // 1. Luz ambiental más intensa para una mejor iluminación base
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    // 2. Luz puntual (de la estrella) más potente y con mayor alcance
    const pointLight = new THREE.PointLight(starColor, 5, 200);
    pointLight.position.copy(star.position);
    scene.add(pointLight);

    // 3. Luz direccional para resaltar las formas y dar volumen
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);


    // Estrellas de fondo
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05
    });

    const starsVertices = [];
    for (let i = 0; i < 2000; i++) {
      const x = (Math.random() - 0.5) * 200;
      const y = (Math.random() - 0.5) * 200;
      const z = (Math.random() - 0.5) * 200;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Crear etiquetas de texto con sprites
    const createTextSprite = (text, x, y, z, scale = 2) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 1024;
      canvas.height = 256;

      ctx.fillStyle = 'white';
      ctx.font = 'bold 128px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(text, 512, 160);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.set(x, y, z);
      sprite.scale.set(scale, scale * 0.25, 1);
      return sprite;
    };

    // Add labels
    scene.add(createTextSprite('Host Star', -15, starRadius + 3, 0, 15));
    scene.add(createTextSprite(`${sradSolar.toFixed(2)} x Sun`, -15, -starRadius - 2.5, 0, 12));

    scene.add(createTextSprite('Exoplanet', 0, planetRadius + 3, 0, 15));
    scene.add(createTextSprite(`${pradEarth.toFixed(2)} x Earth`, 0, -planetRadius - 2.5, 0, 12));
    scene.add(createTextSprite(planetDesc, 0, -planetRadius - 4.5, 0, 10));

    scene.add(createTextSprite('Earth', 15, earthRadius + 3, 0, 15));
    scene.add(createTextSprite('(Reference)', 15, -earthRadius - 2.5, 0, 12));


    // Posicionar cámara
    camera.position.z = 30;
    camera.position.y = 2;

    // Animación
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Rotaciones
      star.rotation.y += 0.002;
      planet.rotation.y += 0.01;
      earth.rotation.y += 0.01;
      glow.rotation.y -= 0.001;

      renderer.render(scene, camera);
    };
    animate();

    // Manejar redimensionamiento
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;

      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };

    window.addEventListener('resize', handleResize);

    // Limpieza al desmontar
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      window.removeEventListener('resize', handleResize);

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
      earthGeometry.dispose();
      earthMaterial.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
      renderer.dispose();
    };
  }, [features]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="w-full h-full min-h-[500px] bg-black rounded-lg overflow-hidden"
      />

      {/* Overlay with planet information */}
      {features && features.koi_period && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-8 py-4 rounded-lg text-center">
          <div className="text-lg font-semibold">
            One year on this planet lasts {parseFloat(features.koi_period).toFixed(1)} Earth days
          </div>
        </div>
      )}
    </div>
  );
};

export default ExoplanetVisualization;
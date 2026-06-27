"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AmbientCanvas() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 100);
    camera.position.z = 6;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setSize(innerWidth, innerHeight);
    el.appendChild(renderer.domElement);

    const count = matchMedia("(max-width: 700px)").matches ? 420 : 850;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c1 = new THREE.Color("#f7c5dc");
    const c2 = new THREE.Color("#d9c4ff");
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - .5) * 14;
      positions[i * 3 + 1] = (Math.random() - .5) * 10;
      positions[i * 3 + 2] = (Math.random() - .5) * 5;
      const c = c1.clone().lerp(c2, Math.random());
      colors.set([c.r, c.g, c.b], i * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const points = new THREE.Points(geometry, new THREE.PointsMaterial({ size: .025, transparent: true, opacity: .7, vertexColors: true }));
    scene.add(points);

    let frame = 0;
    const animate = () => {
      points.rotation.y += .00035;
      points.rotation.x = Math.sin(performance.now() * .00008) * .08;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();
    const resize = () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    };
    addEventListener("resize", resize, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("resize", resize);
      geometry.dispose();
      (points.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="ambient-canvas" ref={host} aria-hidden="true" />;
}

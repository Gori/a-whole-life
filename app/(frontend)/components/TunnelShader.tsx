'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Adapted from shader by Frostbyte
// Original: https://www.shadertoy.com/view/XXX
// Licensed under CC BY-NC-SA 4.0
const fragmentShader = `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // 2d rotation matrix
  vec2 rot(vec2 v, float t) {
    float s = sin(t), c = cos(t);
    return mat2(c, -s, s, c) * v;
  }

  // ACES tonemap
  vec3 aces(vec3 c) {
    mat3 m1 = mat3(0.59719, 0.07600, 0.02840, 0.35458, 0.90834, 0.13383, 0.04823, 0.01566, 0.83777);
    mat3 m2 = mat3(1.60475, -0.10208, -0.00327, -0.53108, 1.10813, -0.07276, -0.07367, -0.00605, 1.07602);
    vec3 v = m1 * c;
    vec3 aa = v * (v + 0.0245786) - 0.000090537;
    vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081;
    return m2 * (aa / b);
  }

  // Xor's Dot Noise
  float noise(vec3 p) {
    const float PHI = 1.618033988;
    const mat3 GOLD = mat3(
      -0.571464913, 0.814921382, 0.096597072,
      -0.278044873, -0.303026659, 0.911518454,
      0.772087367, 0.494042493, 0.399753815
    );
    return dot(cos(GOLD * p), sin(PHI * p * GOLD));
  }

  void main() {
    vec2 u = vUv * uResolution;
    float t = uTime;
    vec3 p = vec3(0.0, 0.0, t);
    vec3 l = vec3(0.0);
    vec3 b;
    float s;

    vec3 d = normalize(vec3(2.0 * u - uResolution.xy, uResolution.y));

    for(float i = 0.0; i < 10.0; i++) {
      b = p;
      b.xy = rot(sin(b.xy), t * 1.5 + b.z * 3.0);
      s = 0.001 + abs(noise(b * 12.0) / 12.0 - noise(b)) * 0.4;
      s = max(s, 2.0 - length(p.xy));
      s += abs(p.y * 0.75 + sin(p.z + t * 0.1 + p.x * 1.5)) * 0.2;
      p += d * s;
      l += (1.0 + sin(i + length(p.xy * 0.1) + vec3(3.0, 1.5, 1.0))) / s;
    }

    vec3 color = aces(l * l / 600.0);
    gl_FragColor = vec4(color, 1.0);
  }
`

interface TunnelShaderProps {
  onReady?: () => void
}

export default function TunnelShader({ onReady }: TunnelShaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    let width = container.clientWidth
    let height = container.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const renderer = new THREE.WebGLRenderer({ antialias: false })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(width, height) },
    }

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    })

    const geometry = new THREE.PlaneGeometry(2, 2)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    let animationId: number
    let firstFrame = true
    const animate = (time: number) => {
      uniforms.uTime.value = time * 0.001
      renderer.render(scene, camera)
      if (firstFrame) {
        firstFrame = false
        onReady?.()
      }
      animationId = requestAnimationFrame(animate)
    }
    animationId = requestAnimationFrame(animate)

    const handleResize = () => {
      width = container.clientWidth
      height = container.clientHeight
      renderer.setSize(width, height)
      uniforms.uResolution.value.set(width, height)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 w-full h-full" style={{ background: '#000' }} />
}

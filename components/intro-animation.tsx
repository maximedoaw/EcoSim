"use client"

import { useEffect, useRef } from "react"
import { useThree } from "@react-three/fiber"
import { gsap } from "gsap"

interface IntroAnimationProps {
  onComplete: () => void
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const { camera } = useThree()
  const hasStarted = useRef(false)

  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true

    // Set initial camera position high above
    camera.position.set(0, 50, 0)
    camera.lookAt(0, 0, 0)

    // Animate camera down to final position
    gsap.to(camera.position, {
      duration: 4,
      x: 10,
      y: 10,
      z: 10,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.lookAt(0, 0, 0)
      },
      onComplete: () => {
        onComplete()
      },
    })
  }, [camera, onComplete])

  return null
}

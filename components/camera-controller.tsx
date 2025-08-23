"use client"

import { useRef, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

interface CameraControllerProps {
  playerPosition: [number, number, number]
  direction: { x: number; z: number }
  gameStarted: boolean
  onCameraAngleChange?: (angle: number) => void
}

export function CameraController({ playerPosition, direction, gameStarted, onCameraAngleChange }: CameraControllerProps) {
  const { camera, gl } = useThree()
  const targetPositionRef = useRef(new THREE.Vector3(...playerPosition))
  
  const isOrbitingRef = useRef(false)
  const orbitStartRef = useRef({ x: 0, y: 0 })
  const orbitDeltaRef = useRef({ x: 0, y: 0 })
  const orbitSensitivity = 0.5
  
  // Références pour la position et rotation de la caméra
  const cameraDistanceRef = useRef(8)
  const cameraHeightRef = useRef(4)
  const desiredAngleRef = useRef(0)
  const currentAngleRef = useRef(0)
  const orbitAngleRef = useRef(0)
  const orbitVerticalAngleRef = useRef(Math.PI / 6)
  
  // Référence pour mémoriser l'angle personnalisé quand l'utilisateur modifie l'orbite
  const customOrbitAngleRef = useRef<number | null>(null)

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 0 || event.button === 2) { // Clic gauche ou droit
        isOrbitingRef.current = true
        orbitStartRef.current = { x: event.clientX, y: event.clientY }
        gl.domElement.style.cursor = 'grabbing'
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (isOrbitingRef.current) {
        orbitDeltaRef.current = {
          x: (event.clientX - orbitStartRef.current.x) * orbitSensitivity,
          y: (event.clientY - orbitStartRef.current.y) * orbitSensitivity
        }
        
        orbitStartRef.current = { x: event.clientX, y: event.clientY }
        
        // Mettre à jour l'angle horizontal avec la souris
        orbitAngleRef.current += orbitDeltaRef.current.x * 0.01
        
        // Mettre à jour l'angle vertical avec la souris
        orbitVerticalAngleRef.current = Math.max(
          Math.PI / 6,
          Math.min(Math.PI / 2, orbitVerticalAngleRef.current - orbitDeltaRef.current.y * 0.01)
        )
        
        // Mémoriser l'angle personnalisé
        customOrbitAngleRef.current = orbitAngleRef.current
      }
    }

    const handleMouseUp = (event: MouseEvent) => {
      if (event.button === 0 || event.button === 2) {
        isOrbitingRef.current = false
        gl.domElement.style.cursor = 'grab'
      }
    }

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault() // Empêcher le menu contextuel
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      
      // Ajuster la distance de la caméra avec la molette
      cameraDistanceRef.current = Math.max(
        3,
        Math.min(15, cameraDistanceRef.current + event.deltaY * 0.01)
      )
      
      // Ajuster la hauteur en fonction de la distance
      cameraHeightRef.current = Math.max(
        2,
        Math.min(6, cameraHeightRef.current + event.deltaY * 0.005)
      )
    }

    const canvas = gl.domElement
    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('contextmenu', handleContextMenu)
    canvas.addEventListener('wheel', handleWheel, { passive: false })
    canvas.style.cursor = 'grab'

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('contextmenu', handleContextMenu)
      canvas.removeEventListener('wheel', handleWheel)
    }
  }, [gl])

  useFrame(() => {
    if (!gameStarted) return

    // Calculer la direction du mouvement du joueur
    const moveDirection = new THREE.Vector3(direction.x, 0, direction.z)
    
    // Si le joueur se déplace, calculer l'angle de déplacement
    if (moveDirection.length() > 0.1) {
      const moveAngle = Math.atan2(-moveDirection.x, -moveDirection.z)
      
      // Si on n'est pas en mode orbite, ajuster l'angle désiré pour suivre le joueur
      if (!isOrbitingRef.current) {
        desiredAngleRef.current = moveAngle
        
        // Si l'utilisateur a modifié l'orbite manuellement, réinitialiser
        if (customOrbitAngleRef.current !== null) {
          customOrbitAngleRef.current = null
        }
      }
    }
    
    // Déterminer l'angle cible
    let targetAngle;
    if (isOrbitingRef.current) {
      // Mode orbite manuel - utiliser l'angle d'orbite
      targetAngle = orbitAngleRef.current
    } else if (customOrbitAngleRef.current !== null) {
      // Après orbite manuelle - garder l'angle personnalisé jusqu'à changement de direction
      targetAngle = customOrbitAngleRef.current
    } else {
      // Mode automatique - suivre la direction du joueur
      targetAngle = desiredAngleRef.current
    }
    
    // Interpolation progressive de l'angle actuel vers l'angle cible
    currentAngleRef.current = THREE.MathUtils.lerp(
      currentAngleRef.current, 
      targetAngle, 
      0.05
    )
    
    // Notifier le composant parent de l'angle de la caméra
    if (onCameraAngleChange) {
      onCameraAngleChange(currentAngleRef.current)
    }
    
    // Calculer la position de la caméra
    const cameraOffset = new THREE.Vector3(
      Math.sin(currentAngleRef.current) * cameraDistanceRef.current,
      cameraHeightRef.current,
      Math.cos(currentAngleRef.current) * cameraDistanceRef.current
    )
    
    // Appliquer l'angle vertical en mode orbite
    if (isOrbitingRef.current || customOrbitAngleRef.current !== null) {
      cameraOffset.y = Math.sin(orbitVerticalAngleRef.current) * cameraDistanceRef.current
      cameraOffset.x = Math.sin(currentAngleRef.current) * Math.cos(orbitVerticalAngleRef.current) * cameraDistanceRef.current
      cameraOffset.z = Math.cos(currentAngleRef.current) * Math.cos(orbitVerticalAngleRef.current) * cameraDistanceRef.current
    }
    
    // Position cible de la caméra
    targetPositionRef.current.set(
      playerPosition[0] + cameraOffset.x,
      playerPosition[1] + cameraOffset.y,
      playerPosition[2] + cameraOffset.z
    )

    // Mouvement fluide de la caméra vers sa position cible
    camera.position.lerp(targetPositionRef.current, 0.1)

    // Regarder légèrement au-dessus du joueur pour une meilleure visibilité
    const lookAtTarget = new THREE.Vector3(
      playerPosition[0],
      playerPosition[1] + 1.5,
      playerPosition[2]
    )
    
    camera.lookAt(lookAtTarget)
  })

  return null
}
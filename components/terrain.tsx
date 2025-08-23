"use client"

import React from "react"

import { useMemo, useState } from "react"
import { useThree } from "@react-three/fiber"
import * as THREE from "three"

interface TerrainProps {
  onDrop?: (position: [number, number, number], itemType: string) => void
}

export function Terrain({ onDrop }: TerrainProps) {
  const { raycaster, camera, pointer } = useThree()
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(100, 100, 50, 50)
    const positions = geo.attributes.position.array as Float32Array

    // Add height variation for natural terrain
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const y = positions[i + 1]
      const distance = Math.sqrt(x * x + y * y)

      // Create hills and valleys
      positions[i + 2] = Math.sin(distance * 0.1) * 2 + Math.random() * 0.5 - 0.25
    }

    geo.attributes.position.needsUpdate = true
    geo.computeVertexNormals()
    return geo
  }, [])

  const handleClick = (event: any) => {
    if (draggedItem && onDrop) {
      const intersect = event.intersections[0]
      if (intersect) {
        const position: [number, number, number] = [intersect.point.x, intersect.point.y + 0.5, intersect.point.z]
        onDrop(position, draggedItem)
        setDraggedItem(null)
      }
    }
  }

  React.useEffect(() => {
    const handleDragStart = (event: CustomEvent) => {
      setDraggedItem(event.detail.itemType)
    }

    const handleDragEnd = () => {
      setDraggedItem(null)
    }

    window.addEventListener("ecosim-drag-start", handleDragStart as EventListener)
    window.addEventListener("ecosim-drag-end", handleDragEnd)

    return () => {
      window.removeEventListener("ecosim-drag-start", handleDragStart as EventListener)
      window.removeEventListener("ecosim-drag-end", handleDragEnd)
    }
  }, [])

  return (
    <mesh
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      position={[0, -0.5, 0]}
      onClick={handleClick}
    >
      <meshLambertMaterial color="#2d5016" transparent={draggedItem ? true : false} opacity={draggedItem ? 0.8 : 1.0} />
      {draggedItem && <meshBasicMaterial color="#4ade80" transparent opacity={0.3} />}
    </mesh>
  )
}

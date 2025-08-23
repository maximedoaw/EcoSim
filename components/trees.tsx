"use client"

import { useMemo } from "react"

export function Trees() {
  const trees = useMemo(() => {
    const treePositions = []
    for (let i = 0; i < 150; i++) {
      treePositions.push({
        x: (Math.random() - 0.5) * 90, // Extended range to cover larger terrain
        z: (Math.random() - 0.5) * 90,
        scale: 0.6 + Math.random() * 0.8,
        treeType: Math.floor(Math.random() * 3), // Different tree types
      })
    }
    return treePositions
  }, [])

  return (
    <group>
      {trees.map((tree, index) => (
        <Tree key={index} position={[tree.x, 0, tree.z]} scale={tree.scale} treeType={tree.treeType} />
      ))}
    </group>
  )
}

function Tree({
  position,
  scale,
  treeType = 0,
}: {
  position: [number, number, number]
  scale: number
  treeType?: number
}) {
  const getTreeColors = (type: number) => {
    switch (type) {
      case 0:
        return { trunk: "#8b4513", leaves1: "#22c55e", leaves2: "#16a34a" }
      case 1:
        return { trunk: "#654321", leaves1: "#15803d", leaves2: "#166534" }
      case 2:
        return { trunk: "#a0522d", leaves1: "#059669", leaves2: "#047857" }
      default:
        return { trunk: "#8b4513", leaves1: "#22c55e", leaves2: "#16a34a" }
    }
  }

  const colors = getTreeColors(treeType)

  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[0.3, 2, 0.3]} />
        <meshLambertMaterial color={colors.trunk} />
      </mesh>

      {/* Leaves - varied shapes for different tree types */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <boxGeometry args={treeType === 2 ? [1.8, 2.2, 1.8] : [2, 2, 2]} />
        <meshLambertMaterial color={colors.leaves1} />
      </mesh>

      <mesh position={[0, 3.5, 0]} castShadow>
        <boxGeometry args={treeType === 1 ? [1.2, 1.2, 1.2] : [1.5, 1.5, 1.5]} />
        <meshLambertMaterial color={colors.leaves2} />
      </mesh>

      {treeType === 0 && (
        <>
          <mesh position={[0.8, 1.8, 0]} castShadow>
            <boxGeometry args={[0.6, 0.1, 0.1]} />
            <meshLambertMaterial color={colors.trunk} />
          </mesh>
          <mesh position={[-0.6, 2.2, 0]} castShadow>
            <boxGeometry args={[0.4, 0.1, 0.1]} />
            <meshLambertMaterial color={colors.trunk} />
          </mesh>
        </>
      )}
    </group>
  )
}

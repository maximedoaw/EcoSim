"use client"

import { useMemo } from "react"
import { Plane, Box } from "@react-three/drei"
import type * as THREE from "three"

interface InfiniteTerrainProps {
  playerPosition: [number, number, number]
  onTerrainClick?: (position: [number, number, number]) => void
}

const getBiome = (x: number, z: number) => {
  const noise = Math.sin(x * 0.01) * Math.cos(z * 0.01)
  if (noise > 0.3) return "urban"
  if (noise < -0.3) return "water"
  return "forest"
}

export function InfiniteTerrain({ playerPosition, onTerrainClick }: InfiniteTerrainProps) {
  // Generate terrain chunks around player
  const terrainChunks = useMemo(() => {
    const chunks = []
    const chunkSize = 50
    const renderDistance = 3 // 3x3 chunks around player

    const playerChunkX = Math.floor(playerPosition[0] / chunkSize)
    const playerChunkZ = Math.floor(playerPosition[2] / chunkSize)

    for (let x = -renderDistance; x <= renderDistance; x++) {
      for (let z = -renderDistance; z <= renderDistance; z++) {
        const chunkX = playerChunkX + x
        const chunkZ = playerChunkZ + z
        const worldX = chunkX * chunkSize
        const worldZ = chunkZ * chunkSize

        // Determine biome based on position
        const biome = getBiome(worldX, worldZ)

        chunks.push({
          id: `${chunkX}-${chunkZ}`,
          position: [worldX, 0, worldZ] as [number, number, number],
          biome,
          chunkX,
          chunkZ,
        })
      }
    }

    return chunks
  }, [playerPosition])

  const handleClick = (event: THREE.Event, position: [number, number, number]) => {
    event.stopPropagation()
    if (onTerrainClick) {
      onTerrainClick(position)
    }
  }

  return (
    <group>
      {terrainChunks.map((chunk) => (
        <group key={chunk.id} position={chunk.position}>
          {/* Base terrain */}
          <Plane
            args={[50, 50]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
            onClick={(event) =>
              handleClick(event, [
                chunk.position[0] + (event.point.x - chunk.position[0]),
                0,
                chunk.position[2] + (event.point.z - chunk.position[2]),
              ])
            }
          >
            <meshLambertMaterial
              color={chunk.biome === "forest" ? "#2d5016" : chunk.biome === "water" ? "#1e40af" : "#6b7280"}
            />
          </Plane>

          {/* Biome-specific elements */}
          {chunk.biome === "forest" && <ForestElements chunkPosition={chunk.position} />}
          {chunk.biome === "urban" && <UrbanElements chunkPosition={chunk.position} />}
          {chunk.biome === "water" && <WaterElements chunkPosition={chunk.position} />}
        </group>
      ))}
    </group>
  )
}

function ForestElements({ chunkPosition }: { chunkPosition: [number, number, number] }) {
  const trees = useMemo(() => {
    const treePositions = []
    for (let i = 0; i < 20; i++) {
      treePositions.push([
        chunkPosition[0] + (Math.random() - 0.5) * 40,
        1,
        chunkPosition[2] + (Math.random() - 0.5) * 40,
      ] as [number, number, number])
    }
    return treePositions
  }, [chunkPosition])

  return (
    <>
      {trees.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Tree trunk */}
          <Box args={[0.5, 2, 0.5]} position={[0, 0, 0]} castShadow>
            <meshLambertMaterial color="#8B4513" />
          </Box>
          {/* Tree leaves */}
          <Box args={[2, 2, 2]} position={[0, 2, 0]} castShadow>
            <meshLambertMaterial color="#228B22" />
          </Box>
        </group>
      ))}
    </>
  )
}

function UrbanElements({ chunkPosition }: { chunkPosition: [number, number, number] }) {
  const buildings = useMemo(() => {
    const buildingPositions = []
    for (let i = 0; i < 8; i++) {
      buildingPositions.push([
        chunkPosition[0] + (Math.random() - 0.5) * 40,
        Math.random() * 5 + 2,
        chunkPosition[2] + (Math.random() - 0.5) * 40,
      ] as [number, number, number])
    }
    return buildingPositions
  }, [chunkPosition])

  return (
    <>
      {buildings.map((pos, i) => (
        <Box key={i} args={[3, pos[1] * 2, 3]} position={pos} castShadow>
          <meshLambertMaterial color="#708090" />
        </Box>
      ))}
    </>
  )
}

function WaterElements({ chunkPosition }: { chunkPosition: [number, number, number] }) {
  return (
    <Plane args={[45, 45]} rotation={[-Math.PI / 2, 0, 0]} position={[chunkPosition[0], 0.1, chunkPosition[2]]}>
      <meshLambertMaterial color="#4682B4" transparent opacity={0.8} />
    </Plane>
  )
}

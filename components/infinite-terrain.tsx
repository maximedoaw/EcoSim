"use client"

import { useMemo, useState, useEffect } from "react"
import { Plane, Box, Sphere, Text, Html } from "@react-three/drei"
import type * as THREE from "three"
import { EnvironmentType } from "@/types"
import { useEnvironment } from "@/hooks/use-select-environment"

interface InfiniteTerrainProps {
  playerPosition: [number, number, number]
  onTerrainClick?: (position: [number, number, number]) => void,
  currentEnvironment: EnvironmentType
}

// Types d'environnements disponibles



export function InfiniteTerrain({ playerPosition, onTerrainClick }: InfiniteTerrainProps) {
  const { currentEnvironment } = useEnvironment()
  
  // Fonction pour déterminer le biome en fonction de la position et de l'environnement sélectionné
  const getBiome = (x: number, z: number) => {
    return currentEnvironment
  }

  // Génération des chunks de terrain autour du joueur
  const terrainChunks = useMemo(() => {
    const chunks = []
    const chunkSize = 50
    const renderDistance = 5 // 5x5 chunks autour du joueur

    const playerChunkX = Math.floor(playerPosition[0] / chunkSize)
    const playerChunkZ = Math.floor(playerPosition[2] / chunkSize)

    for (let x = -renderDistance; x <= renderDistance; x++) {
      for (let z = -renderDistance; z <= renderDistance; z++) {
        const chunkX = playerChunkX + x
        const chunkZ = playerChunkZ + z
        const worldX = chunkX * chunkSize
        const worldZ = chunkZ * chunkSize

        // Déterminer le biome en fonction de la position
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
  }, [playerPosition, currentEnvironment])

  const handleClick = (event: any, position: [number, number, number]) => {
    event.stopPropagation()
    if (onTerrainClick) {
      onTerrainClick(position)
    }
  }

  return (
    <>
      <group>
        {terrainChunks.map((chunk) => (
          <group key={chunk.id} position={chunk.position}>
            {/* Terrain de base avec différentes hauteurs selon le biome */}
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
              <meshStandardMaterial
                color={
                  chunk.biome === "burnedForest" ? "#3a2a1d" : 
                  chunk.biome === "meltingGlaciers" ? "#e1f5fe" : 
                  chunk.biome === "pollutedCity" ? "#616161" : 
                  chunk.biome === "expandingDesert" ? "#ffd54f" : 
                  "#1a237e"
                }
                roughness={0.8}
                metalness={0.2}
              />
            </Plane>

            {/* Éléments spécifiques au biome */}
            {chunk.biome === "burnedForest" && <BurnedForestElements chunkPosition={chunk.position} />}
            {chunk.biome === "meltingGlaciers" && <MeltingGlaciersElements chunkPosition={chunk.position} />}
            {chunk.biome === "pollutedCity" && <PollutedCityElements chunkPosition={chunk.position} />}
            {chunk.biome === "expandingDesert" && <ExpandingDesertElements chunkPosition={chunk.position} />}
            {chunk.biome === "acidOcean" && <AcidOceanElements chunkPosition={chunk.position} />}
          </group>
        ))}
      </group>
    </>
  )
}

// Forêts brûlées 🌲🔥
function BurnedForestElements({ chunkPosition }: { chunkPosition: [number, number, number] }) {
  const elements = useMemo(() => {
    const trees = []
    const fires = []
    const rocks = []
    
    for (let i = 0; i < 20; i++) {
      const x = chunkPosition[0] + (Math.random() - 0.5) * 45
      const z = chunkPosition[2] + (Math.random() - 0.5) * 45
      
      // Arbres brûlés
      if (Math.random() > 0.3) {
        trees.push({
          position: [x, 0, z] as [number, number, number],
          height: Math.random() * 3 + 2,
          hasLeaves: Math.random() > 0.8,
          isBurning: Math.random() > 0.7
        })
      }
      
      // Feux
      if (Math.random() > 0.8) {
        fires.push({
          position: [x, 0.2, z] as [number, number, number],
          size: Math.random() * 0.5 + 0.3
        })
      }
      
      // Rochers
      if (Math.random() > 0.6) {
        rocks.push({
          position: [x, 0, z] as [number, number, number],
          size: Math.random() * 1.5 + 0.5
        })
      }
    }
    
    return { trees, fires, rocks }
  }, [chunkPosition])

  return (
    <>
      {/* Arbres brûlés */}
      {elements.trees.map((tree, i) => (
        <group key={`tree-${i}`} position={tree.position}>
          {/* Tronc d'arbre brûlé */}
          <Box args={[0.7, tree.height, 0.7]} position={[0, tree.height/2, 0]} castShadow>
            <meshStandardMaterial color="#4e342e" roughness={0.9} />
          </Box>
          {/* Feuilles brûlées (occasionnelles) */}
          {tree.hasLeaves && (
            <Box args={[2, 1.5, 2]} position={[0, tree.height + 0.8, 0]} castShadow>
              <meshStandardMaterial color="#3e2723" roughness={0.9} />
            </Box>
          )}
          {/* Feu (si applicable) */}
          {tree.isBurning && (
            <Sphere args={[0.8]} position={[0, tree.height + 1.5, 0]}>
              <meshStandardMaterial color="#ff6d00" emissive="#ff5200" roughness={0.2} />
            </Sphere>
          )}
        </group>
      ))}
      
      {/* Feux au sol */}
      {elements.fires.map((fire, i) => (
        <group key={`fire-${i}`} position={fire.position}>
          <Sphere args={[fire.size]}>
            <meshStandardMaterial color="#ff6d00" emissive="#ff5200" roughness={0.2} />
          </Sphere>
          <Box args={[0.5, 0.2, 0.5]} position={[0, -fire.size, 0]}>
            <meshStandardMaterial color="#5d4037" roughness={0.9} />
          </Box>
        </group>
      ))}
      
      {/* Rochers */}
      {elements.rocks.map((rock, i) => (
        <Box key={`rock-${i}`} args={[rock.size, rock.size * 0.7, rock.size]} position={rock.position} castShadow>
          <meshStandardMaterial color="#6d4c41" roughness={0.9} />
        </Box>
      ))}
      
      {/* Cendres au sol */}
      <Plane args={[45, 45]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]} receiveShadow>
        <meshStandardMaterial color="#5d4037" roughness={0.9} />
      </Plane>
    </>
  )
}

// Glaciers fondants ❄️
function MeltingGlaciersElements({ chunkPosition }: { chunkPosition: [number, number, number] }) {
  const elements = useMemo(() => {
    const iceBlocks = []
    const waterPools = []
    const rocks = []
    
    for (let i = 0; i < 30; i++) {
      const x = chunkPosition[0] + (Math.random() - 0.5) * 45
      const z = chunkPosition[2] + (Math.random() - 0.5) * 45
      
      // Blocs de glace
      iceBlocks.push({
        position: [x, Math.random() * 3, z] as [number, number, number],
        size: Math.random() * 4 + 2,
        isMelting: Math.random() > 0.4
      })
      
      // Flaques d'eau
      if (Math.random() > 0.7) {
        waterPools.push({
          position: [x, 0.1, z] as [number, number, number],
          size: Math.random() * 5 + 2
        })
      }
      
      // Rochers
      if (Math.random() > 0.8) {
        rocks.push({
          position: [x, 0, z] as [number, number, number],
          size: Math.random() * 2 + 1
        })
      }
    }
    
    return { iceBlocks, waterPools, rocks }
  }, [chunkPosition])

  return (
    <>
      {/* Blocs de glace */}
      {elements.iceBlocks.map((ice, i) => (
        <group key={`ice-${i}`} position={ice.position}>
          <Box args={[ice.size, ice.size, ice.size]} castShadow>
            <meshStandardMaterial color="#e1f5fe" transparent opacity={0.9} roughness={0.2} />
          </Box>
          {/* Eau de fonte */}
          {ice.isMelting && (
            <Box args={[ice.size * 0.8, 0.1, ice.size * 0.8]} position={[0, -ice.size/2 + 0.05, 0]}>
              <meshStandardMaterial color="#4fc3f7" transparent opacity={0.7} roughness={0.1} />
            </Box>
          )}
        </group>
      ))}
      
      {/* Flaques d'eau */}
      {elements.waterPools.map((pool, i) => (
        <Plane key={`pool-${i}`} args={[pool.size, pool.size]} rotation={[-Math.PI / 2, 0, 0]} position={pool.position}>
          <meshStandardMaterial color="#4fc3f7" transparent opacity={0.6} roughness={0.1} />
        </Plane>
      ))}
      
      {/* Rochers */}
      {elements.rocks.map((rock, i) => (
        <Box key={`rock-${i}`} args={[rock.size, rock.size * 0.7, rock.size]} position={rock.position} castShadow>
          <meshStandardMaterial color="#9e9e9e" roughness={0.9} />
        </Box>
      ))}
      
      {/* Surface glacée générale */}
      <Plane args={[45, 45]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#b3e5fc" transparent opacity={0.8} roughness={0.3} />
      </Plane>
    </>
  )
}

function PollutedCityElements({ chunkPosition }: { chunkPosition: [number, number, number] }) {
  const elements = useMemo(() => {
    const buildings = []
    const streets = []
    const smokeStacks = []
    const npcs = []
    const cars = []
    const trafficLights = []
    const factories = []
    
    // Créer un plan de ville avec des rues en grille
    const blockSize = 15
    const streetWidth = 5
    
    for (let x = -20; x <= 20; x += blockSize + streetWidth) {
      for (let z = -20; z <= 20; z += blockSize + streetWidth) {
        const worldX = chunkPosition[0] + x
        const worldZ = chunkPosition[2] + z
        
        // Rues principales
        streets.push({
          position: [worldX, 0.1, 0] as [number, number, number],
          width: streetWidth,
          depth: 45,
          isMain: x % (blockSize * 2 + streetWidth) === 0
        })
        
        streets.push({
          position: [0, 0.1, worldZ] as [number, number, number],
          width: 45,
          depth: streetWidth,
          isMain: z % (blockSize * 2 + streetWidth) === 0
        })
        
        // Bâtiments dans chaque bloc
        if (Math.abs(x) < 20 && Math.abs(z) < 20) {
          const buildingsInBlock = Math.floor(Math.random() * 4) + 2
          
          for (let i = 0; i < buildingsInBlock; i++) {
            const buildingX = worldX + (Math.random() - 0.5) * (blockSize - 4)
            const buildingZ = worldZ + (Math.random() - 0.5) * (blockSize - 4)
            const height = Math.floor(Math.random() * 12 + 6)
            const width = Math.random() * 8 + 6
            const depth = Math.random() * 8 + 6
            
            const isFactory = Math.random() > 0.8
            
            buildings.push({
              position: [buildingX, height/2, buildingZ] as [number, number, number],
              size: [width, height, depth] as [number, number, number],
              hasSmoke: Math.random() > 0.5,
              windows: Math.floor(Math.random() * 8) + 4,
              isFactory
            })
            
            // Usines avec cheminées
            if (isFactory) {
              smokeStacks.push({
                position: [buildingX, height, buildingZ] as [number, number, number],
                height: Math.random() * 5 + 3,
                intensity: Math.random() * 2 + 1
              })
              
              factories.push({
                position: [buildingX, 0, buildingZ] as [number, number, number],
                size: [width * 1.5, height * 0.8, depth * 1.5] as [number, number, number]
              })
            }
          }
        }
      }
    }
    
    // Voitures sur les routes
    for (let i = 0; i < 15; i++) {
      const streetType = Math.random() > 0.5 ? 'horizontal' : 'vertical'
      const posX = chunkPosition[0] + (Math.random() - 0.5) * 40
      const posZ = chunkPosition[2] + (Math.random() - 0.5) * 40
      
      cars.push({
        position: [posX, 0.8, posZ] as [number, number, number],
        color: `hsl(${Math.random() * 360}, 70%, 40%)`,
        size: [2, 0.8, 1] as [number, number, number]
      })
    }
    
    // Feux de circulation aux intersections
    for (let x = -20; x <= 20; x += blockSize + streetWidth) {
      for (let z = -20; z <= 20; z += blockSize + streetWidth) {
        if (Math.abs(x) < 20 && Math.abs(z) < 20) {
          trafficLights.push({
            position: [chunkPosition[0] + x + 3, 2, chunkPosition[2] + z + 3] as [number, number, number],
            state: Math.random() > 0.5 ? 'red' : 'green'
          })
        }
      }
    }
    
    // NPCs (habitants)
    for (let i = 0; i < 8; i++) {
      npcs.push({
        position: [
          chunkPosition[0] + (Math.random() - 0.5) * 40,
          1,
          chunkPosition[2] + (Math.random() - 0.5) * 40,
        ] as [number, number, number],
        walking: Math.random() > 0.5
      })
    }
    
    return { buildings, streets, smokeStacks, npcs, cars, trafficLights, factories }
  }, [chunkPosition])

  return (
    <>
      {/* Rues */}
      {elements.streets.map((street, i) => (
        <Box 
          key={`street-${i}`} 
          args={[street.width, 0.2, street.depth]} 
          position={street.position} 
          receiveShadow
        >
          <meshStandardMaterial 
            color={street.isMain ? "#263238" : "#37474f"} 
            roughness={0.9} 
          />
          {/* Marques routières */}
          {street.isMain && (
            <Box args={[0.2, 0.21, 2]} position={[0, 0.105, 0]}>
              <meshStandardMaterial color="#ffd600" emissive="#ffab00" />
            </Box>
          )}
        </Box>
      ))}
      
      {/* Bâtiments */}
      {elements.buildings.map((building, i) => (
        <group key={`bld-${i}`} position={building.position}>
          {/* Structure principale */}
          <Box args={building.size} castShadow>
            <meshStandardMaterial 
              color={building.isFactory ? "#546e7a" : "#78909c"} 
              roughness={0.8} 
            />
          </Box>
          
          {/* Fenêtres */}
          {Array.from({ length: building.windows }).map((_, j) => {
            const windowX = (j % 3) * (building.size[0] / 3) - building.size[0] / 3
            const windowZ = Math.floor(j / 3) * (building.size[2] / Math.ceil(building.windows / 3)) - building.size[2] / 3
            const windowY = Math.floor(j / 6) * (building.size[1] / Math.ceil(building.windows / 6)) + 1
            
            return (
              <Box 
                key={`win-${i}-${j}`} 
                args={[0.8, 1.2, 0.1]} 
                position={[windowX, windowY - building.size[1]/2 + 2, building.size[2]/2 + 0.1]} 
              >
                <meshStandardMaterial 
                  color={Math.random() > 0.7 ? "#ff6d00" : "#90caf9"} 
                  emissive={Math.random() > 0.7 ? "#ff5200" : "#64b5f6"} 
                  roughness={0.1} 
                />
              </Box>
            )
          })}
          
          {/* Fumée (si applicable) */}
          {building.hasSmoke && (
            <Sphere args={[1.2]} position={[0, building.size[1]/2 + 2, 0]}>
              <meshStandardMaterial color="#455a64" transparent opacity={0.7} />
            </Sphere>
          )}
        </group>
      ))}
      
      {/* Usines */}
      {elements.factories.map((factory, i) => (
        <Box key={`factory-${i}`} args={factory.size} position={factory.position}>
          <meshStandardMaterial color="#37474f" roughness={0.9} />
        </Box>
      ))}
      
      {/* Cheminées fumantes */}
      {elements.smokeStacks.map((stack, i) => (
        <group key={`stack-${i}`} position={stack.position}>
          <Box args={[1, stack.height, 1]} position={[0, stack.height/2, 0]}>
            <meshStandardMaterial color="#9e9e9e" roughness={0.8} />
          </Box>
          {/* Fumée plus intense */}
          <Sphere args={[1.5]} position={[0, stack.height + 1, 0]}>
            <meshStandardMaterial color="#37474f" transparent opacity={0.8} />
          </Sphere>
        </group>
      ))}
      
      {/* Voitures */}
      {elements.cars.map((car, i) => (
        <Box 
          key={`car-${i}`} 
          args={car.size} 
          position={car.position}
          rotation={[0, Math.random() * Math.PI * 2, 0]}
        >
          <meshStandardMaterial color={car.color} roughness={0.7} />
        </Box>
      ))}
      
      {/* Feux de circulation */}
      {elements.trafficLights.map((light, i) => (
        <group key={`light-${i}`} position={light.position}>
          <Box args={[0.3, 3, 0.3]} position={[0, 1.5, 0]}>
            <meshStandardMaterial color="#424242" roughness={0.8} />
          </Box>
          <Box args={[0.8, 0.8, 0.8]} position={[0, 3, 0]}>
            <meshStandardMaterial 
              color={light.state === 'red' ? '#f44336' : '#4caf50'} 
              emissive={light.state === 'red' ? '#d32f2f' : '#388e3c'} 
            />
          </Box>
        </group>
      ))}
      
      {/* NPCs (habitants) */}
      {elements.npcs.map((npc, i) => (
        <group key={`npc-${i}`} position={npc.position}>
          <Box args={[0.6, 2, 0.6]}>
            <meshStandardMaterial color="#ffb74d" roughness={0.8} />
          </Box>
          {/* Animation de marche */}
          {npc.walking && (
            <Box args={[0.3, 0.8, 0.3]} position={[0.2, -1, 0]} rotation={[0, 0, Math.PI/6]}>
              <meshStandardMaterial color="#ffb74d" roughness={0.8} />
            </Box>
          )}
        </group>
      ))}
      
      {/* Pollution atmosphérique */}
      <Plane args={[45, 45]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 15, 0]}>
        <meshStandardMaterial color="#546e7a" transparent opacity={0.4} />
      </Plane>
      
      {/* Déchets au sol */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Box
          key={`trash-${i}`}
          args={[0.5, 0.2, 0.5]}
          position={[
            chunkPosition[0] + (Math.random() - 0.5) * 40,
            0.1,
            chunkPosition[2] + (Math.random() - 0.5) * 40
          ]}
        >
          <meshStandardMaterial color="#757575" roughness={0.9} />
        </Box>
      ))}
    </>
  )
}

// Déserts en expansion 🏜️
function ExpandingDesertElements({ chunkPosition }: { chunkPosition: [number, number, number] }) {
  const elements = useMemo(() => {
    const sandDunes = []
    const deadPlants = []
    const cacti = []
    const oasis = []
    
    for (let i = 0; i < 30; i++) {
      const x = chunkPosition[0] + (Math.random() - 0.5) * 45
      const z = chunkPosition[2] + (Math.random() - 0.5) * 45
      
      // Dunes de sable
      sandDunes.push({
        position: [x, 0, z] as [number, number, number],
        height: Math.random() * 2 + 0.5,
        width: Math.random() * 10 + 5,
        depth: Math.random() * 10 + 5
      })
      
      // Plantes mortes
      if (Math.random() > 0.7) {
        deadPlants.push({
          position: [x, 0, z] as [number, number, number],
          height: Math.random() * 1 + 0.5
        })
      }
      
      // Cactus
      if (Math.random() > 0.8) {
        cacti.push({
          position: [x, 0, z] as [number, number, number],
          height: Math.random() * 2 + 1
        })
      }
      
      // Oasis (rare)
      if (Math.random() > 0.95) {
        oasis.push({
          position: [x, 0.1, z] as [number, number, number],
          size: Math.random() * 8 + 5
        })
      }
    }
    
    return { sandDunes, deadPlants, cacti, oasis }
  }, [chunkPosition])

  return (
    <>
      {/* Dunes de sable */}
      {elements.sandDunes.map((dune, i) => (
        <Box 
          key={`dune-${i}`} 
          args={[dune.width, dune.height, dune.depth]} 
          position={[dune.position[0], dune.height/2, dune.position[2]]} 
          castShadow
        >
          <meshStandardMaterial color="#ffd54f" roughness={0.9} />
        </Box>
      ))}
      
      {/* Plantes mortes */}
      {elements.deadPlants.map((plant, i) => (
        <group key={`plant-${i}`} position={plant.position}>
          <Box args={[0.2, plant.height, 0.2]} position={[0, plant.height/2, 0]}>
            <meshStandardMaterial color="#8d6e63" roughness={0.9} />
          </Box>
        </group>
      ))}
      
      {/* Cactus */}
      {elements.cacti.map((cactus, i) => (
        <group key={`cactus-${i}`} position={cactus.position}>
          <Box args={[0.7, cactus.height, 0.7]} position={[0, cactus.height/2, 0]}>
            <meshStandardMaterial color="#7cb342" roughness={0.8} />
          </Box>
          {/* Bras de cactus */}
          <Box args={[0.4, 0.4, cactus.height * 0.7]} position={[0.6, cactus.height * 0.7, 0]} rotation={[0, 0, Math.PI/4]}>
            <meshStandardMaterial color="#7cb342" roughness={0.8} />
          </Box>
        </group>
      ))}
      
      {/* Oasis */}
      {elements.oasis.map((oasis, i) => (
        <group key={`oasis-${i}`} position={oasis.position}>
          <Plane args={[oasis.size, oasis.size]} rotation={[-Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#4fc3f7" transparent opacity={0.7} roughness={0.1} />
          </Plane>
          {/* Palmier */}
          <Box args={[0.8, 4, 0.8]} position={[0, 2, 0]}>
            <meshStandardMaterial color="#8d6e63" roughness={0.9} />
          </Box>
          <Box args={[3, 1, 3]} position={[0, 4.5, 0]}>
            <meshStandardMaterial color="#7cb342" roughness={0.8} />
          </Box>
        </group>
      ))}
    </>
  )
}

// Océans acides 🌊🐟
function AcidOceanElements({ chunkPosition }: { chunkPosition: [number, number, number] }) {
  const elements = useMemo(() => {
    const acidPools = []
    const deadFish = []
    const acidBubbles = []
    const coral = []
    const rocks = []
    
    for (let i = 0; i < 20; i++) {
      const x = chunkPosition[0] + (Math.random() - 0.5) * 45
      const z = chunkPosition[2] + (Math.random() - 0.5) * 45
      
      // Pools d'acide
      acidPools.push({
        position: [x, 0.1, z] as [number, number, number],
        size: Math.random() * 6 + 3,
        intensity: Math.random() * 0.3 + 0.7
      })
      
      // Poissons morts
      if (Math.random() > 0.7) {
        deadFish.push({
          position: [x, 0.2, z] as [number, number, number],
          rotation: [0, Math.random() * Math.PI, 0] as [number, number, number]
        })
      }
      
      // Bulles d'acide
      if (Math.random() > 0.8) {
        acidBubbles.push({
          position: [x, Math.random() * 2 + 0.5, z] as [number, number, number],
          size: Math.random() * 0.4 + 0.2
        })
      }
      
      // Coraux morts
      if (Math.random() > 0.9) {
        coral.push({
          position: [x, 0, z] as [number, number, number],
          size: Math.random() * 1.5 + 0.5,
          height: Math.random() * 1 + 0.5
        })
      }
      
      // Rochers
      if (Math.random() > 0.85) {
        rocks.push({
          position: [x, 0, z] as [number, number, number],
          size: Math.random() * 2 + 1
        })
      }
    }
    
    return { acidPools, deadFish, acidBubbles, coral, rocks }
  }, [chunkPosition])

  return (
    <>
      {/* Surface d'eau acide principale */}
      <Plane args={[45, 45]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#1a237e" transparent opacity={0.8} roughness={0.2} />
      </Plane>
      
      {/* Pools d'acide plus concentrées */}
      {elements.acidPools.map((pool, i) => (
        <Plane 
          key={`pool-${i}`} 
          args={[pool.size, pool.size]} 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={pool.position}
        >
          <meshStandardMaterial color="#7b1fa2" transparent opacity={pool.intensity} roughness={0.1} />
        </Plane>
      ))}
      
      {/* Poissons morts */}
      {elements.deadFish.map((fish, i) => (
        <Box 
          key={`fish-${i}`} 
          args={[1, 0.3, 0.5]} 
          position={fish.position}
          rotation={fish.rotation}
        >
          <meshStandardMaterial color="#ff6f00" roughness={0.8} />
        </Box>
      ))}
      
      {/* Bulles acides */}
      {elements.acidBubbles.map((bubble, i) => (
        <Sphere 
          key={`bubble-${i}`} 
          args={[bubble.size]} 
          position={bubble.position}
        >
          <meshStandardMaterial color="#ea80fc" transparent opacity={0.7} roughness={0.1} />
        </Sphere>
      ))}
      
      {/* Coraux morts */}
      {elements.coral.map((coral, i) => (
        <Box 
          key={`coral-${i}`} 
          args={[coral.size, coral.height, coral.size]} 
          position={coral.position}
        >
          <meshStandardMaterial color="#ff5252" roughness={0.8} />
        </Box>
      ))}
      
      {/* Rochers */}
      {elements.rocks.map((rock, i) => (
        <Box 
          key={`rock-${i}`} 
          args={[rock.size, rock.size * 0.7, rock.size]} 
          position={rock.position}
        >
          <meshStandardMaterial color="#9e9e9e" roughness={0.9} />
        </Box>
      ))}
    </>
  )
}
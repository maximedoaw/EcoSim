"use client"

import { useState, useEffect } from "react"
import { EnvironmentType } from "@/types"
import { useSelectEnvironment } from "../hooks/use-select-environment"
import { useGameState } from "../hooks/use-game-state"

interface EnvironmentSelectorProps {
  className?: string
}

type Environment = {
  id: EnvironmentType;
  name: string;
  problem: string;
  objective: string;
  impact: string;
  benefits: string[];
  strategies: string[];
  points: number;
  communityActions: string[];
  targetScore: number;
  currentScore: number;
};

type Equipment = {
  id: string;
  name: string;
  description: string;
  detailedDescription: string;
  cost: number;
  environment: EnvironmentType;
  icon: string;
  impact: {
    co2: number;
    pollution: number;
    biodiversity: number;
    energy: number;
    community: number;
    water: number;
  };
};

type Mission = {
  progress: number;
  status: "idle" | "inProgress" | "paused" | "completed" | "failed";
  startTime: number | null;
  elapsedTime: number;
};

export function EnvironmentSelector({ className = "" }: EnvironmentSelectorProps) {
  const { currentEnvironment, setEnvironment } = useSelectEnvironment()
  const { gameStats, updateEcoScore, addCoins } = useGameState()
  const [isOpen, setIsOpen] = useState(false)
  const [isEquipmentOpen, setIsEquipmentOpen] = useState(false)
  const [selectedEnvDetails, setSelectedEnvDetails] = useState<Environment | null>(null)
  const [globalBudget, setGlobalBudget] = useState(5000)
  const [selectedEquipment, setSelectedEquipment] = useState<{id: string, count: number}[]>([])
  const [showDescription, setShowDescription] = useState<Equipment | null>(null)
  const [mission, setMission] = useState<Mission>({
    progress: 0,
    status: "idle",
    startTime: null,
    elapsedTime: 0
  })

  const environmentsData: Environment[] = [
    {
      id: "burnedForest",
      name: "Forêt brûlée",
      problem: "La déforestation réduit la capacité de la planète à absorber le CO2 et détruit la biodiversité.",
      objective: "Atteindre un score de biodiversité de 200 points",
      impact: "Réduction du CO2 atmosphérique, préservation de la biodiversité et amélioration de la qualité de l'air.",
      benefits: [
        "Absorption de 25 tonnes de CO2 par an",
        "Création d'habitats pour 50+ espèces",
        "Amélioration de la qualité de l'air local",
        "Prévention de l'érosion des sols"
      ],
      strategies: [
        "Vendre du bois certifié durable à 50$/m³ pour financer les équipements",
        "Organiser des écotours à 25$/personne pour sensibiliser et financer",
        "Créer une coopérative de produits forestiers non-ligneux (champignons, baies)",
        "Développer un programme de compensation carbone à 10$/arbre planté"
      ],
      points: gameStats.ecoScore.biodiversity,
      communityActions: [
        "Planter des arbres en groupe (5$/participant)",
        "Créer une application locale de suivi des plantations",
        "Partage de semences entre joueurs",
        "Organiser des marches de sensibilisation"
      ],
      targetScore: 200,
      currentScore: gameStats.ecoScore.biodiversity
    },
    {
      id: "pollutedCity",
      name: "Ville polluée",
      problem: "La surconsommation d'énergie fossile et la pollution urbaine augmentent l'effet de serre.",
      objective: "Atteindre un score d'énergie de 200 points",
      impact: "Diminution de la dépendance aux énergies fossiles et amélioration de la qualité de l'air.",
      benefits: [
        "Production de 100 MWh d'énergie renouvelable par an",
        "Réduction de 50 tonnes d'émissions de CO2",
        "Création d'emplois locaux dans les énergies vertes",
        "Sensibilisation de 500+ habitants aux énergies renouvelables"
      ],
      strategies: [
        "Vendre l'excédent d'énergie solaire à 0.15$/kWh au réseau",
        "Louer des espaces publicitaires sur les bâtiments écologiques à 200$/mois",
        "Proposer des audits énergétiques à 150$/bâtiment",
        "Créer une monnaie locale pour les échanges verts"
      ],
      points: gameStats.ecoScore.energy,
      communityActions: [
        "Installer des panneaux collectivement (cotisation 20$/personne)",
        "Organiser des événements de sensibilisation",
        "Mettre en place du covoiturage et transports verts",
        "Créer des jardins communautaires partagés"
      ],
      targetScore: 200,
      currentScore: gameStats.ecoScore.energy
    },
    {
      id: "meltingGlaciers",
      name: "Glacier fondant",
      problem: "La fonte des glaces accélère la montée du niveau des mers et perturbe les écosystèmes polaires.",
      objective: "Atteindre un score CO2 de 200 points",
      impact: "Stabilisation partielle de la fonte glaciaire et protection des espèces polaires.",
      benefits: [
        "Préservation de 1000 km² de surface glaciaire",
        "Protection de 10+ espèces polaires menacées",
        "Ralentissement de l'élévation du niveau de la mer",
        "Collecte de données précieuses pour la recherche climatique"
      ],
      strategies: [
        "Vendre les données climatiques à 500$/jeu de données aux instituts de recherche",
        "Proposer des expéditions scientifiques sponsorisées à 1000$/jour",
        "Créer un fonds de dotation pour la recherche polaire",
        "Développer un programme d'adoption symbolique d'espèces menacées à 50$/animal"
      ],
      points: gameStats.ecoScore.co2,
      communityActions: [
        "Participer à des nettoyages océaniques",
        "Financer des expéditions scientifiques (don 10$/personne)",
        "Partager des données sur la fonte glaciaire",
        "Organiser des conférences de sensibilisation"
      ],
      targetScore: 200,
      currentScore: gameStats.ecoScore.co2
    },
    {
      id: "expandingDesert",
      name: "Désert en expansion",
      problem: "La désertification réduit les terres cultivables et provoque des migrations climatiques.",
      objective: "Atteindre un score d'eau de 200 points",
      impact: "Amélioration de la sécurité alimentaire et stockage accru de carbone dans le sol.",
      benefits: [
        "Séquestration de 100 tonnes de CO2 dans le sol",
        "Création de 20 hectares de terres cultivables",
        "Approvisionnement en nourriture pour 100 familles",
        "Préservation des nappes phréatiques locales"
      ],
      strategies: [
        "Vendre les récoltes issues de l'agriculture durable à 3$/kg",
        "Proposer des systèmes d'irrigation en location à 50$/mois",
        "Développer l'agrotourisme à 40$/nuit",
        "Commercialiser des semences adaptées à 10$/sachet"
      ],
      points: gameStats.ecoScore.water,
      communityActions: [
        "Créer des jardins collectifs (cotisation 15$/personne)",
        "Partager des systèmes d'irrigation low-cost",
        "Former des agriculteurs à l'agroforesterie",
        "Organiser des marchés de produits locaux"
      ],
      targetScore: 200,
      currentScore: gameStats.ecoScore.water
    },
    {
      id: "acidOcean",
      name: "Océan acide",
      problem: "La pollution plastique et l'acidification détruisent la vie marine.",
      objective: "Atteindre un score de pollution de 200 points",
      impact: "Protection de la biodiversité marine et amélioration de la pêche durable.",
      benefits: [
        "Nettoyage de 5 tonnes de déchets plastiques",
        "Protection de 15+ espèces marines",
        "Amélioration de la qualité de l'eau sur 10 km de côtes",
        "Sensibilisation de 1000+ personnes à la pollution marine"
      ],
      strategies: [
        "Vendre le plastique recyclé à 0.5$/kg aux usines de transformation",
        "Proposer des excursions écotouristiques à 35$/personne",
        "Développer la pêche durable avec vente directe à 8$/kg",
        "Créer une ligne de produits dérivés écoresponsables"
      ],
      points: gameStats.ecoScore.pollution,
      communityActions: [
        "Organiser des nettoyages de plages",
        "Créer un système de tri communautaire",
        "Sensibiliser sur la consommation de plastique",
        "Développer la pêche collaborative"
      ],
      targetScore: 200,
      currentScore: gameStats.ecoScore.pollution
    }
  ];

  const equipmentData: Equipment[] = [
    // Équipements pour Forêt brûlée
    { 
      id: "e1", 
      name: "Kit de plantation", 
      description: "Outils pour planter des arbres", 
      detailedDescription: "Kit complet incluant pelles, pioches, gants et guide de plantation. Essentiel pour le reboisement efficace. Chaque kit permet de planter 10 arbres.",
      cost: 120, 
      environment: "burnedForest", 
      icon: "🌱", 
      impact: { co2: 8, pollution: 3, biodiversity: 20, energy: 0, community: 5, water: 2 } 
    },
    { 
      id: "e2", 
      name: "Sacs de graines", 
      description: "Variétés résistantes pour reboisement", 
      detailedDescription: "Mélange de graines d'espèces natives résistantes aux incendies. Inclut des chênes, pins et érables adaptés au climat local. Chaque sac couvre 100m².",
      cost: 80, 
      environment: "burnedForest", 
      icon: "🌿", 
      impact: { co2: 5, pollution: 2, biodiversity: 15, energy: 0, community: 3, water: 1 } 
    },
    { 
      id: "e3", 
      name: "Système d'irrigation", 
      description: "Économiseur d'eau pour jeunes plants", 
      detailedDescription: "Système goutte-à-goutte solaire avec réservoir de 500L. Réduit la consommation d'eau de 70% et fonctionne à l'énergie solaire.",
      cost: 350, 
      environment: "burnedForest", 
      icon: "💧", 
      impact: { co2: 3, pollution: 1, biodiversity: 10, energy: 5, community: 2, water: 15 } 
    },
    { 
      id: "e4", 
      name: "Serre communautaire", 
      description: "Cultiver des plants avant transplantation", 
      detailedDescription: "Serre modulaire de 50m² avec système de contrôle climatique. Permet de faire germer 1000 plants simultanément avant transplantation en forêt.",
      cost: 2000, 
      environment: "burnedForest", 
      icon: "🌻", 
      impact: { co2: 6, pollution: 3, biodiversity: 18, energy: 8, community: 12, water: 5 } 
    },
    { 
      id: "e5", 
      name: "Clôture de protection", 
      description: "Protéger les jeunes plants des animaux", 
      detailedDescription: "Clôture écologique biodégradable de 100m. Protège les jeunes plants contre les herbivores sans nuire à la faune locale.",
      cost: 200, 
      environment: "burnedForest", 
      icon: "🛡️", 
      impact: { co2: 2, pollution: 0, biodiversity: 8, energy: 0, community: 3, water: 0 } 
    },
    
    // Équipements pour Ville polluée
    { 
      id: "e6", 
      name: "Panneaux solaires", 
      description: "Production d'énergie renouvelable", 
      detailedDescription: "Panneaux solaires photovoltaïques de 300W avec onduleur. Production estimée: 450kWh/an. Installation incluse sur toitures urbaines.",
      cost: 1500, 
      environment: "pollutedCity", 
      icon: "☀️", 
      impact: { co2: 25, pollution: 8, biodiversity: 3, energy: 35, community: 5, water: 0 } 
    },
    { 
      id: "e7", 
      name: "Vélo électrique", 
      description: "Transport écologique en ville", 
      detailedDescription: "Vélo à assistance électrique avec autonomie de 60km. Parfait pour les déplacements urbains. Réduction des émissions de 2kg CO2/jour.",
      cost: 800, 
      environment: "pollutedCity", 
      icon: "🚲", 
      impact: { co2: 15, pollution: 5, biodiversity: 2, energy: 8, community: 4, water: 0 } 
    },
    { 
      id: "e8", 
      name: "Éolienne urbaine", 
      description: "Générer de l'énergie avec le vent", 
      detailedDescription: "Petite éolienne verticale adaptée aux zones urbaines. Production: 100kWh/mois. Silencieuse et sans danger pour la faune.",
      cost: 2500, 
      environment: "pollutedCity", 
      icon: "🌬️", 
      impact: { co2: 18, pollution: 6, biodiversity: 2, energy: 28, community: 4, water: 0 } 
    },
    { 
      id: "e9", 
      name: "Station de recharge", 
      description: "Recharger les véhicules électriques", 
      detailedDescription: "Station de recharge rapide pour véhicules électriques. Capacité: 4 véhicules simultanément. Alimentation solaire optionnelle.",
      cost: 1200, 
      environment: "pollutedCity", 
      icon: "🔌", 
      impact: { co2: 12, pollution: 4, biodiversity: 0, energy: 20, community: 6, water: 0 } 
    },
    { 
      id: "e10", 
      name: "Toit vert", 
      description: "Isolation naturelle et absorption CO2", 
      detailedDescription: "Système complet de végétalisation de toiture. Réduit les îlots de chaleur urbains, absorbe le CO2 et améliore l'isolation.",
      cost: 1800, 
      environment: "pollutedCity", 
      icon: "🏢", 
      impact: { co2: 10, pollution: 5, biodiversity: 12, energy: 8, community: 7, water: 6 } 
    },
    
    // Équipements pour Glacier fondant
    { 
      id: "e11", 
      name: "Capteur de température", 
      description: "Surveillance de la fonte des glaces", 
      detailedDescription: "Capteur haute précision pour mesurer les variations de température. Transmet les données en temps réel via satellite.",
      cost: 600, 
      environment: "meltingGlaciers", 
      icon: "🌡️", 
      impact: { co2: 2, pollution: 1, biodiversity: 1, energy: 1, community: 3, water: 0 } 
    },
    { 
      id: "e12", 
      name: "Station météo", 
      description: "Collecte de données climatiques", 
      detailedDescription: "Station météorologique complète avec anémomètre, pluviomètre et baromètre. Données accessibles en ligne.",
      cost: 800, 
      environment: "meltingGlaciers", 
      icon: "📡", 
      impact: { co2: 3, pollution: 1, biodiversity: 1, energy: 2, community: 4, water: 0 } 
    },
    
    // Équipements pour Désert en expansion
    { 
      id: "e13", 
      name: "Système d'irrigation", 
      description: "Économiseur d'eau pour zones arides", 
      detailedDescription: "Système goutte-à-goutte solaire avec réservoir de 1000L. Idéal pour les cultures en milieu désertique.",
      cost: 750, 
      environment: "expandingDesert", 
      icon: "💧", 
      impact: { co2: 4, pollution: 2, biodiversity: 5, energy: 2, community: 3, water: 10 } 
    },
    { 
      id: "e14", 
      name: "Plante résistante", 
      description: "Espèces adaptées à la sécheresse", 
      detailedDescription: "Sélection de plantes natives résistantes à la sécheresse. Inclut cactus, agaves et autres espèces adaptées.",
      cost: 400, 
      environment: "expandingDesert", 
      icon: "🌾", 
      impact: { co2: 3, pollution: 1, biodiversity: 6, energy: 1, community: 2, water: 5 } 
    },
    
    // Équipements pour Océan acide
    { 
      id: "e15", 
      name: "Filet de nettoyage", 
      description: "Collecte des déchets en sea", 
      detailedDescription: "Filet spécialisé pour collecter les déchets plastiques en mer sans nuire à la faune marine. Capacité: 50kg.",
      cost: 400, 
      environment: "acidOcean", 
      icon: "🧹", 
      impact: { co2: 3, pollution: 10, biodiversity: 5, energy: 1, community: 4, water: 8 } 
    },
    { 
      id: "e16", 
      name: "Récif artificiel", 
      description: "Recréer des habitats marins", 
      detailedDescription: "Structures modulaires qui imitent les récifs naturels. Favorise la biodiversité marine et protège les côtes.",
      cost: 1200, 
      environment: "acidOcean", 
      icon: "🐠", 
      impact: { co2: 4, pollution: 5, biodiversity: 15, energy: 2, community: 6, water: 7 } 
    },
    
    // Équipements gratuits (outils de base)
    { 
      id: "free1", 
      name: "Kit éducatif", 
      description: "Matériel de sensibilisation", 
      detailedDescription: "Kit complet avec brochures, affiches et présentations pour sensibiliser la communauté aux enjeux environnementaux.",
      cost: 0, 
      environment: "burnedForest", 
      icon: "📚", 
      impact: { co2: 1, pollution: 1, biodiversity: 2, energy: 1, community: 8, water: 1 } 
    },
    { 
      id: "free2", 
      name: "Application mobile", 
      description: "Suivi des actions environnementales", 
      detailedDescription: "Application mobile pour suivre l'impact des actions, connecter la communauté et partager les meilleures pratiques.",
      cost: 0, 
      environment: "pollutedCity", 
      icon: "📱", 
      impact: { co2: 1, pollution: 1, biodiversity: 1, energy: 2, community: 10, water: 1 } 
    }
  ];

  const environments = environmentsData.map(env => ({
    id: env.id,
    label: env.name,
    emoji: env.id === "burnedForest" ? "🌲🔥" : 
           env.id === "meltingGlaciers" ? "❄️" : 
           env.id === "pollutedCity" ? "🌆☁️" : 
           env.id === "expandingDesert" ? "🏜️" : "🌊🐟",
    description: env.problem.substring(0, 60) + "..."
  }))

  // Mettre à jour les scores actuels des environnements
  useEffect(() => {
    setSelectedEnvDetails(prev => {
      if (!prev) return null
      const updatedEnv = environmentsData.find(env => env.id === prev.id)
      return updatedEnv ? { ...updatedEnv, currentScore: getCurrentEnvironmentScore(updatedEnv.id) } : null
    })
  }, [gameStats, currentEnvironment])

  // Simulation de progression de la mission basée sur l'EcoScore
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (mission.status === "inProgress" && selectedEnvDetails) {
      interval = setInterval(() => {
        setMission(prev => {
          const currentScore = getCurrentEnvironmentScore(selectedEnvDetails.id);
          const targetScore = selectedEnvDetails.targetScore;
          const newProgress = Math.min((currentScore / targetScore) * 100, 100);
          const isCompleted = newProgress >= 100;
          
          return {
            ...prev,
            progress: newProgress,
            status: isCompleted ? "completed" : prev.status,
            elapsedTime: prev.startTime ? Date.now() - prev.startTime : 0
          };
        });
      }, 2000);
    }
    
    return () => clearInterval(interval);
  }, [mission.status, selectedEnvDetails]);

  const getCurrentEnvironmentScore = (envId: EnvironmentType): number => {
    switch (envId) {
      case "burnedForest": return gameStats.ecoScore.biodiversity;
      case "pollutedCity": return gameStats.ecoScore.energy;
      case "meltingGlaciers": return gameStats.ecoScore.co2;
      case "expandingDesert": return gameStats.ecoScore.water;
      case "acidOcean": return gameStats.ecoScore.pollution;
      default: return 0;
    }
  }

  const handleEnvironmentSelect = (envId: EnvironmentType) => {
    setEnvironment(envId)
    
    const envDetails = environmentsData.find(env => env.id === envId)
    if (envDetails) {
      setSelectedEnvDetails({ 
        ...envDetails, 
        currentScore: getCurrentEnvironmentScore(envId) 
      })
    }
  }

  const handleEquipmentSelection = (equipmentId: string, cost: number) => {
    const existingIndex = selectedEquipment.findIndex(item => item.id === equipmentId)
    
    if (existingIndex >= 0) {
      // Augmenter la quantité
      const newEquipment = [...selectedEquipment]
      newEquipment[existingIndex].count += 1
      setSelectedEquipment(newEquipment)
      setGlobalBudget(prev => prev - cost)
    } else if (globalBudget >= cost || cost === 0) {
      // Ajouter nouvel équipement
      setSelectedEquipment([...selectedEquipment, { id: equipmentId, count: 1 }])
      if (cost > 0) {
        setGlobalBudget(prev => prev - cost)
      }
    }
  }

  const removeEquipment = (equipmentId: string, cost: number) => {
    const existingIndex = selectedEquipment.findIndex(item => item.id === equipmentId)
    
    if (existingIndex >= 0) {
      const newEquipment = [...selectedEquipment]
      if (newEquipment[existingIndex].count > 1) {
        newEquipment[existingIndex].count -= 1
      } else {
        newEquipment.splice(existingIndex, 1)
      }
      setSelectedEquipment(newEquipment)
      if (cost > 0) {
        setGlobalBudget(prev => prev + cost)
      }
    }
  }

  const getTotalCost = () => {
    return selectedEquipment.reduce((total, item) => {
      const equipment = equipmentData.find(e => e.id === item.id)
      return total + (equipment?.cost || 0) * item.count
    }, 0)
  }

  const applyEquipmentEffects = () => {
    selectedEquipment.forEach(item => {
      const equipment = equipmentData.find(e => e.id === item.id)
      if (equipment) {
        // Appliquer l'impact pour chaque unité de l'équipement
        for (let i = 0; i < item.count; i++) {
          updateEcoScore(equipment.impact)
        }
      }
    })
  }

  const startMission = () => {
    if (selectedEquipment.length === 0) {
      alert("Sélectionnez au moins un équipement pour commencer la mission!")
      return
    }
    
    setMission({
      progress: getCurrentEnvironmentScore(currentEnvironment) / (selectedEnvDetails?.targetScore || 100) * 100,
      status: "inProgress",
      startTime: Date.now(),
      elapsedTime: 0
    })
    
    applyEquipmentEffects()
  }

  const pauseMission = () => {
    setMission(prev => ({
      ...prev,
      status: "paused",
      elapsedTime: prev.startTime ? Date.now() - prev.startTime : 0
    }))
  }

  const resumeMission = () => {
    setMission(prev => ({
      ...prev,
      status: "inProgress",
      startTime: Date.now() - prev.elapsedTime
    }))
  }

  const resetMission = () => {
    setMission({
      progress: 0,
      status: "idle",
      startTime: null,
      elapsedTime: 0
    })
    
    setGlobalBudget(prev => prev + getTotalCost())
    setSelectedEquipment([])
  }

  const completeMission = () => {
    if (mission.status === "completed") {
      const reward = Math.floor(getTotalCost() * 0.3) + 100 // 30% du coût + bonus fixe
      setGlobalBudget(prev => prev + reward)
      addCoins(reward)
      setMission(prev => ({ ...prev, status: "idle" }))
      setSelectedEquipment([])
    }
  }

  const filteredEquipment = equipmentData.filter(equipment => 
    equipment.environment === currentEnvironment || selectedEquipment.some(item => item.id === equipment.id)
  )

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000) % 60
    const minutes = Math.floor(ms / 60000) % 60
    const hours = Math.floor(ms / 3600000)
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500'
    if (progress < 60) return 'bg-yellow-500'
    if (progress < 80) return 'bg-blue-500'
    return 'bg-green-500'
  }

  // Modale Minecraft pour les descriptions d'équipement
  const EquipmentModal = () => {
    if (!showDescription) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="bg-green-800 border-4 border-green-600 rounded-lg p-6 w-11/12 max-w-md mx-4">
          {/* En-tête style Minecraft */}
          <div className="border-b-4 border-green-700 pb-3 mb-4 flex justify-between items-center">
            <h3 className="text-xl font-bold text-yellow-300" style={{ textShadow: "2px 2px 0 #000" }}>
              {showDescription.icon} {showDescription.name}
            </h3>
            <button 
              onClick={() => setShowDescription(null)}
              className="text-white hover:text-yellow-300 text-2xl"
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>
          
          {/* Contenu de la modale */}
          <div className="space-y-4">
            <div>
              <h4 className="text-yellow-300 font-medium mb-1" style={{ textShadow: "1px 1px 0 #000" }}>Description</h4>
              <p className="text-white">{showDescription.detailedDescription}</p>
            </div>
            
            <div>
              <h4 className="text-yellow-300 font-medium mb-1" style={{ textShadow: "1px 1px 0 #000" }}>Coût</h4>
              <p className="text-white">{showDescription.cost === 0 ? "Gratuit" : `${showDescription.cost}$`}</p>
            </div>
            
            <div>
              <h4 className="text-yellow-300 font-medium mb-1" style={{ textShadow: "1px 1px 0 #000" }}>Impact environnemental</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-white">
                <div className="flex items-center">
                  <span className="w-6">🌍</span>
                  <span>CO₂: +{showDescription.impact.co2}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-6">🌊</span>
                  <span>Pollution: +{showDescription.impact.pollution}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-6">🌱</span>
                  <span>Biodiversité: +{showDescription.impact.biodiversity}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-6">⚡</span>
                  <span>Énergie: +{showDescription.impact.energy}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-6">👥</span>
                  <span>Communauté: +{showDescription.impact.community}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-6">💧</span>
                  <span>Eau: +{showDescription.impact.water}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Pied de page style Minecraft */}
          <div className="mt-6 pt-3 border-t-4 border-green-700">
            <button
              onClick={() => setShowDescription(null)}
              className="w-full bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded font-bold transition-colors"
              style={{ textShadow: "1px 1px 0 #000" }}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Bouton Équipement en haut à gauche */}
      <button
        onClick={() => setIsEquipmentOpen(!isEquipmentOpen)}
        className="fixed top-4 left-4 z-50 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors flex items-center gap-2"
      >
        <span>⚙️</span>
        <span>Équipement</span>
        {mission.status !== "idle" && (
          <span className="bg-white text-blue-600 text-xs rounded-full px-2 py-1">
            {mission.status === "inProgress" ? "En cours" : 
             mission.status === "paused" ? "En pause" : 
             mission.status === "completed" ? "Terminée" : "Échouée"}
          </span>
        )}
      </button>

      {/* Panneau des équipements */}
      {isEquipmentOpen && (
        <div className="fixed top-16 left-4 z-40 w-80 bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-xl p-4 border border-slate-600">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold">⚙️ Équipements disponibles</h3>
            <button 
              onClick={() => setIsEquipmentOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="mb-4 p-3 bg-slate-700/50 rounded">
            <div className="text-white font-medium">Budget mission: <span className="text-green-400">{globalBudget}$</span></div>
            <div className="text-white font-medium">Vos pièces: <span className="text-yellow-400">{gameStats.coins}$</span></div>
            <div className="text-slate-400 text-sm">Sélectionnez les équipements pour votre mission</div>
          </div>
          
          {/* Barre de progression de la mission */}
          {mission.status !== "idle" && selectedEnvDetails && (
            <div className="mb-4 bg-slate-700/30 p-3 rounded">
              <div className="flex justify-between text-sm text-white mb-1">
                <span>Progression: {Math.round(mission.progress)}%</span>
                <span>{getCurrentEnvironmentScore(selectedEnvDetails.id)}/{selectedEnvDetails.targetScore}</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(mission.progress)}`}
                  style={{ width: `${mission.progress}%` }}
                ></div>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Statut: {mission.status === "inProgress" ? "En cours" : 
                        mission.status === "paused" ? "En pause" : 
                        mission.status === "completed" ? "Terminée" : "Prête à démarrer"}
              </div>
            </div>
          )}
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredEquipment.map(equipment => {
              const selectedCount = selectedEquipment.find(item => item.id === equipment.id)?.count || 0
              const canAfford = globalBudget >= equipment.cost || equipment.cost === 0
              
              return (
                <div
                  key={equipment.id}
                  className={`p-3 rounded transition-all ${
                    selectedCount > 0
                      ? 'bg-green-600/30 border border-green-500'
                      : canAfford
                      ? 'bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 cursor-pointer'
                      : 'bg-red-900/30 border border-red-700 opacity-60'
                  }`}
                  onClick={() => canAfford && handleEquipmentSelection(equipment.id, equipment.cost)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{equipment.icon}</span>
                    <div className="flex-1">
                      <div className="text-white font-medium">{equipment.name}</div>
                      <div className="text-slate-400 text-sm">{equipment.description}</div>
                      {selectedCount > 0 && (
                        <div className="text-green-400 text-xs mt-1">
                          Quantité: {selectedCount}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`font-bold ${selectedCount > 0 ? 'text-green-400' : 'text-white'}`}>
                        {equipment.cost === 0 ? 'Gratuit' : `${equipment.cost}$`}
                      </div>
                      {selectedCount > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeEquipment(equipment.id, equipment.cost)
                          }}
                          className="text-red-400 hover:text-red-300 text-xs"
                        >
                          Retirer
                        </button>
                      )}
                      {equipment.detailedDescription && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowDescription(equipment)
                          }}
                          className="bg-blue-500 hover:bg-blue-400 text-white px-2 py-1 rounded text-xs transition-colors flex items-center gap-1"
                        >
                          <span>ℹ️</span>
                          <span>Détails</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          <div className="mt-4 flex gap-2 flex-wrap">
            {mission.status === "idle" && (
              <button
                onClick={startMission}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-colors"
                disabled={selectedEquipment.length === 0}
              >
                Démarrer mission
              </button>
            )}
            
            {mission.status === "inProgress" && (
              <>
                <button
                  onClick={pauseMission}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded transition-colors"
                >
                  Pause
                </button>
                <button
                  onClick={resetMission}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-colors"
                >
                  Annuler
                </button>
              </>
            )}
            
            {mission.status === "paused" && (
              <>
                <button
                  onClick={resumeMission}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-colors"
                >
                  Reprendre
                </button>
                <button
                  onClick={resetMission}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-colors"
                >
                  Annuler
                </button>
              </>
            )}
            
            {mission.status === "completed" && (
              <>
                <button
                  onClick={completeMission}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors"
                >
                  Réclamer récompense
                </button>
                <button
                  onClick={resetMission}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded transition-colors"
                >
                  Nouvelle mission
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modale pour les descriptions d'équipement */}
      <EquipmentModal />

      {/* Bouton flottant pour ouvrir/fermer le panneau */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed z-50 bottom-4 right-4 w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${
          isOpen ? 'bg-red-500' : 'bg-green-500'
        } shadow-lg hover:shadow-xl`}
        aria-label={isOpen ? "Fermer le sélecteur d'environnement" : "Ouvrir le sélecteur d'environnement"}
      >
        {isOpen ? '✕' : '🌍'}
      </button>

      {/* Panneau principal */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-slate-900/95 backdrop-blur-sm z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} ${className}`}>
        <div className="h-full flex flex-col overflow-hidden">
          {/* En-tête */}
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Environnements</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>
            <p className="text-slate-400 text-sm mt-1">Choisissez un environnement à explorer</p>
          </div>

          {/* Contenu défilable */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Liste des environnements */}
            <div className="space-y-3 mb-6">
              {environments.map(env => (
                <button
                  key={env.id}
                  onClick={() => handleEnvironmentSelect(env.id as EnvironmentType)}
                  className={`w-full p-3 rounded-lg text-left transition-all duration-200 flex items-start gap-3 ${
                    currentEnvironment === env.id 
                      ? 'bg-green-600/20 border border-green-500/50' 
                      : 'bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50'
                  }`}
                >
                  <span className="text-2xl">{env.emoji}</span>
                  <div className="flex-1">
                    <div className="font-medium text-white">{env.label}</div>
                    <div className="text-xs text-slate-400 mt-1">{env.description}</div>
                  </div>
                  {currentEnvironment === env.id && (
                    <span className="text-green-500 text-lg">✓</span>
                  )}
                </button>
              ))}
            </div>

            {/* Détails de l'environnement sélectionné */}
            {selectedEnvDetails && (
              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-3">Détails de l'environnement</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-1">Problème</h4>
                    <p className="text-sm text-slate-400">{selectedEnvDetails.problem}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-1">Objectif</h4>
                    <p className="text-sm text-slate-400">{selectedEnvDetails.objective}</p>
                    <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full ${getProgressColor((selectedEnvDetails.currentScore / selectedEnvDetails.targetScore) * 100)}`}
                        style={{ width: `${(selectedEnvDetails.currentScore / selectedEnvDetails.targetScore) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Progression: {selectedEnvDetails.currentScore}/{selectedEnvDetails.targetScore}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-1">Impact sur 10 ans</h4>
                    <p className="text-sm text-slate-400">{selectedEnvDetails.impact}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-1">Stratégies de financement</h4>
                    <ul className="text-sm text-slate-400 space-y-2 mt-2">
                      {selectedEnvDetails.strategies.map((strategy, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-green-400 mr-2">💰</span>
                          <span>{strategy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-1">Actions communautaires</h4>
                    <ul className="text-sm text-slate-400 space-y-1 mt-1">
                      {selectedEnvDetails.communityActions.map((action, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-blue-400 mr-2">👥</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pied de page */}
          <div className="p-4 border-t border-slate-700">
            <div className="text-xs text-slate-400">
              Environnement actuel: {environments.find(e => e.id === currentEnvironment)?.label}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay pour fermer en cliquant à côté (sur mobile) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
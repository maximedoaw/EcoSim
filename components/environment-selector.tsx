"use client"

import { useState, useEffect } from "react"
import { EnvironmentType } from "@/types"
import { useEnvironment } from "../hooks/use-select-environment"

interface EnvironmentSelectorProps {
  className?: string
}

type Environment = {
  name: string;
  problem: string;
  objective: string;
  impact: string;
  benefits: string[];
  budget: number;
  strategies: string[];
  points: number;
  duration: string;
  communityActions: string[];
};

type Tool = {
  id: string;
  name: string;
  description: string;
  cost: number;
  environment: EnvironmentType;
  icon: string;
};

type Mission = {
  progress: number;
  status: "idle" | "inProgress" | "paused" | "completed" | "failed";
  startTime: number | null;
  elapsedTime: number;
};

const environmentsData: Environment[] = [
  {
    name: "Forêt",
    problem: "La déforestation réduit la capacité de la planète à absorber le CO2 et détruit la biodiversité.",
    objective: "Planter et protéger 1 000 arbres en 2 ans.",
    impact: "Réduction du CO2 atmosphérique, préservation de la biodiversité et amélioration de la qualité de l'air.",
    benefits: [
      "Absorption de 25 tonnes de CO2 par an",
      "Création d'habitats pour 50+ espèces",
      "Amélioration de la qualité de l'air local",
      "Prévention de l'érosion des sols"
    ],
    budget: 500,
    strategies: [
      "Investir 200 $ dans des graines + pépinières locales.",
      "Organiser des collectes communautaires pour financer des reboisements.",
      "Revendre du bois recyclé pour récupérer des fonds (économie circulaire)."
    ],
    points: 200,
    duration: "2 ans",
    communityActions: [
      "Planter des arbres en groupe.",
      "Créer une application locale de suivi des plantations.",
      "Partage de semences entre joueurs."
    ]
  },
  {
    name: "Ville",
    problem: "La surconsommation d'énergie fossile et la pollution urbaine augmentent l'effet de serre.",
    objective: "Installer 50 panneaux solaires communautaires en 3 ans.",
    impact: "Diminution de la dépendance aux énergies fossiles et amélioration de la qualité de l'air.",
    benefits: [
      "Production de 100 MWh d'énergie renouvelable par an",
      "Réduction de 50 tonnes d'émissions de CO2",
      "Création d'emplois locaux dans les énergies vertes",
      "Sensibilisation de 500+ habitants aux énergies renouvelables"
    ],
    budget: 500,
    strategies: [
      "Investir 150 $ dans des micro-solutions (lampadaires solaires, chargeurs).",
      "Créer une coopérative énergétique pour mutualiser les coûts.",
      "Crowdfunding avec la communauté pour des projets solaires."
    ],
    points: 200,
    duration: "3 ans",
    communityActions: [
      "Installer des panneaux collectivement.",
      "Organiser des événements de sensibilisation.",
      "Mettre en place du covoiturage et transports verts."
    ]
  },
  {
    name: "Glacier",
    problem: "La fonte des glaces accélère la montée du niveau des mers et perturbe les écosystèmes polaires.",
    objective: "Réduire les émissions locales de CO2 de 20% en 5 ans.",
    impact: "Stabilisation partielle de la fonte glaciaire et protection des espèces polaires.",
    benefits: [
      "Préservation de 1000 km² de surface glaciaire",
      "Protection de 10+ espèces polaires menacées",
      "Ralentissement de l'élévation du niveau de la mer",
      "Collecte de données précieuses pour la recherche climatique"
    ],
    budget: 500,
    strategies: [
      "Investir 100 $ dans des campagnes de sensibilisation.",
      "Financer la recherche et protection via dons ciblés.",
      "Revendre du plastique recyclé pour récolter des fonds."
    ],
    points: 200,
    duration: "5 ans",
    communityActions: [
      "Participer à des nettoyages océaniques.",
      "Financer des expéditions scientifiques.",
      "Partager des données sur la fonte glaciaire."
    ]
  },
  {
    name: "Désert",
    problem: "La désertification réduit les terres cultivables et provoque des migrations climatiques.",
    objective: "Reverdir 50 hectares de terres arides en 4 ans.",
    impact: "Amélioration de la sécurité alimentaire et stockage accru de carbone dans le sol.",
    benefits: [
      "Séquestration de 100 tonnes de CO2 dans le sol",
      "Création de 20 hectares de terres cultivables",
      "Approvisionnement en nourriture pour 100 familles",
      "Préservation des nappes phréatiques locales"
    ],
    budget: 500,
    strategies: [
      "Investir 200 $ dans des techniques d'irrigation goutte-à-goutte.",
      "Utiliser des semences résistantes à la sécheresse.",
      "Mettre en place des coopératives agricoles."
    ],
    points: 200,
    duration: "4 ans",
    communityActions: [
      "Créer des jardins collectifs.",
      "Partager des systèmes d'irrigation low-cost.",
      "Former des agriculteurs à l'agroforesterie."
    ]
  },
  {
    name: "Océan",
    problem: "La pollution plastique et l'acidification détruisent la vie marine.",
    objective: "Réduire de 50% les déchets plastiques collectés en 3 ans.",
    impact: "Protection de la biodiversité marine et amélioration de la pêche durable.",
    benefits: [
      "Nettoyage de 5 tonnes de déchets plastiques",
      "Protection de 15+ espèces marines",
      "Amélioration de la qualité de l'eau sur 10 km de côtes",
      "Sensibilisation de 1000+ personnes à la pollution marine"
    ],
    budget: 500,
    strategies: [
      "Investir 100 $ dans des filets de collecte communautaires.",
      "Mettre en place un système de consigne pour le plastique.",
      "Vendre du plastique recyclé pour réinvestir."
    ],
    points: 200,
    duration: "3 ans",
    communityActions: [
      "Organiser des nettoyages de plages.",
      "Créer un système de tri communautaire.",
      "Sensibiliser sur la consommation de plastique."
    ]
  }
];

const toolsData: Tool[] = [
  { id: "t1", name: "Kit de plantation", description: "Outils pour planter des arbres efficacement", cost: 50, environment: "burnedForest", icon: "🌱" },
  { id: "t2", name: "Système d'irrigation", description: "Économiseur d'eau pour zones arides", cost: 75, environment: "expandingDesert", icon: "💧" },
  { id: "t3", name: "Panneaux solaires", description: "Production d'énergie renouvelable", cost: 100, environment: "pollutedCity", icon: "☀️" },
  { id: "t4", name: "Filet de nettoyage", description: "Collecte des déchets en mer", cost: 40, environment: "acidOcean", icon: "🧹" },
  { id: "t5", name: "Capteur de température", description: "Surveillance de la fonte des glaces", cost: 60, environment: "meltingGlaciers", icon: "🌡️" },
  { id: "t6", name: "Sacs de graines", description: "Variétés résistantes pour reboisement", cost: 30, environment: "burnedForest", icon: "🌿" },
  { id: "t7", name: "Vélo électrique", description: "Transport écologique en ville", cost: 80, environment: "pollutedCity", icon: "🚲" }
];

export function EnvironmentSelector({ className = "" }: EnvironmentSelectorProps) {
  const { currentEnvironment, setEnvironment, switchToPrevious, hasPrevious } = useEnvironment()
  const [isOpen, setIsOpen] = useState(false)
  const [isToolsOpen, setIsToolsOpen] = useState(false)
  const [selectedEnvDetails, setSelectedEnvDetails] = useState<Environment | null>(null)
  const [globalBudget, setGlobalBudget] = useState(500)
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [mission, setMission] = useState<Mission>({
    progress: 0,
    status: "idle",
    startTime: null,
    elapsedTime: 0
  })

  const environments: { id: EnvironmentType, label: string, emoji: string, description: string }[] = [
    { id: "burnedForest", label: "Forêts brûlées", emoji: "🌲🔥", description: "Zones déforestées et incendiées" },
    { id: "meltingGlaciers", label: "Glaciers fondants", emoji: "❄️", description: "Glaces en fonte et montée des eaux" },
    { id: "pollutedCity", label: "Villes polluées", emoji: "🌆☁️", description: "Urbanisation et pollution atmosphérique" },
    { id: "expandingDesert", label: "Déserts en expansion", emoji: "🏜️", description: "Désertification et sécheresse" },
    { id: "acidOcean", label: "Océans acides", emoji: "🌊🐟", description: "Acidification des océans" }
  ]

  // Afficher les détails de l'environnement actuel au chargement
  useEffect(() => {
    const envNameMap: Record<EnvironmentType, string> = {
      burnedForest: "Forêt",
      meltingGlaciers: "Glacier",
      pollutedCity: "Ville",
      expandingDesert: "Désert",
      acidOcean: "Océan"
    }
    
    const envDetails = environmentsData.find(env => env.name === envNameMap[currentEnvironment])
    setSelectedEnvDetails(envDetails || null)
  }, [currentEnvironment])

  // Simulation de progression de la mission
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (mission.status === "inProgress") {
      interval = setInterval(() => {
        setMission(prev => {
          const newProgress = Math.min(prev.progress + 0.5, 100);
          const isCompleted = newProgress >= 100;
          
          return {
            ...prev,
            progress: newProgress,
            status: isCompleted ? "completed" : prev.status,
            elapsedTime: prev.startTime ? Date.now() - prev.startTime : 0
          };
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [mission.status]);

  const handleEnvironmentSelect = (envId: EnvironmentType) => {
    setEnvironment(envId)
    
    // Trouver les détails correspondants
    const envNameMap: Record<EnvironmentType, string> = {
      burnedForest: "Forêt",
      meltingGlaciers: "Glacier",
      pollutedCity: "Ville",
      expandingDesert: "Désert",
      acidOcean: "Océan"
    }
    
    const envDetails = environmentsData.find(env => env.name === envNameMap[envId])
    setSelectedEnvDetails(envDetails || null)
  }

  const handleToolSelection = (toolId: string, cost: number) => {
    if (selectedTools.includes(toolId)) {
      setSelectedTools(selectedTools.filter(id => id !== toolId))
      setGlobalBudget(prev => prev + cost)
    } else if (globalBudget >= cost) {
      setSelectedTools([...selectedTools, toolId])
      setGlobalBudget(prev => prev - cost)
    }
  }

  const startMission = () => {
    if (selectedTools.length === 0) {
      alert("Sélectionnez au moins un outil pour commencer la mission!")
      return
    }
    
    setMission({
      progress: 0,
      status: "inProgress",
      startTime: Date.now(),
      elapsedTime: 0
    })
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
    
    // Rembourser les outils sélectionnés
    const totalSpent = selectedTools.reduce((total, toolId) => {
      const tool = toolsData.find(t => t.id === toolId)
      return total + (tool?.cost || 0)
    }, 0)
    setGlobalBudget(prev => prev + totalSpent)
    setSelectedTools([])
  }

  const completeMission = () => {
    if (mission.status === "completed") {
      const reward = Math.floor(Math.random() * 100) + 50
      setGlobalBudget(prev => prev + reward)
      setMission(prev => ({ ...prev, status: "idle" }))
    }
  }

  const filteredTools = toolsData.filter(tool => 
    tool.environment === currentEnvironment || selectedTools.includes(tool.id)
  )

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000) % 60
    const minutes = Math.floor(ms / 60000) % 60
    const hours = Math.floor(ms / 3600000)
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <>
      {/* Bouton Outils en haut à gauche */}
      <button
        onClick={() => setIsToolsOpen(!isToolsOpen)}
        className="fixed top-4 left-4 z-50 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors flex items-center gap-2"
      >
        <span>🛠️</span>
        <span>Outils</span>
        {mission.status !== "idle" && (
          <span className="bg-white text-blue-600 text-xs rounded-full px-2 py-1">
            {mission.status === "inProgress" ? "En cours" : 
             mission.status === "paused" ? "En pause" : 
             mission.status === "completed" ? "Terminée" : "Échouée"}
          </span>
        )}
      </button>

      {/* Panneau des outils */}
      {isToolsOpen && (
        <div className="fixed top-16 left-4 z-40 w-80 bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-xl p-4 border border-slate-600">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold">🛠️ Outils disponibles</h3>
            <button 
              onClick={() => setIsToolsOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="mb-4 p-3 bg-slate-700/50 rounded">
            <div className="text-white font-medium">Budget global: <span className="text-green-400">{globalBudget}$</span></div>
            <div className="text-slate-400 text-sm">Sélectionnez les outils pour votre mission</div>
          </div>
          
          {/* Barre de progression de la mission */}
          {mission.status !== "idle" && (
            <div className="mb-4 bg-slate-700/30 p-3 rounded">
              <div className="flex justify-between text-sm text-white mb-1">
                <span>Progression: {Math.round(mission.progress)}%</span>
                <span>{formatTime(mission.elapsedTime)}</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300" 
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
            {filteredTools.map(tool => (
              <div
                key={tool.id}
                onClick={() => handleToolSelection(tool.id, tool.cost)}
                className={`p-3 rounded cursor-pointer transition-all ${
                  selectedTools.includes(tool.id)
                    ? 'bg-green-600/30 border border-green-500'
                    : globalBudget >= tool.cost
                    ? 'bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600'
                    : 'bg-red-900/30 border border-red-700 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{tool.icon}</span>
                  <div className="flex-1">
                    <div className="text-white font-medium">{tool.name}</div>
                    <div className="text-slate-400 text-sm">{tool.description}</div>
                  </div>
                  <div className={`font-bold ${selectedTools.includes(tool.id) ? 'text-green-400' : 'text-white'}`}>
                    {tool.cost}$
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex gap-2 flex-wrap">
            {mission.status === "idle" && (
              <button
                onClick={startMission}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-colors"
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
                  Mettre en pause
                </button>
                <button
                  onClick={resetMission}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-colors"
                >
                  Abandonner
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
                  Abandonner
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
                  onClick={() => handleEnvironmentSelect(env.id)}
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
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-1">Impact</h4>
                    <p className="text-sm text-slate-400">{selectedEnvDetails.impact}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-1">Avantages climatiques et écologiques</h4>
                    <ul className="text-sm text-slate-400 space-y-2 mt-2">
                      {selectedEnvDetails.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-green-400 mr-2">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-1">Budget</h4>
                      <p className="text-sm text-slate-400">{selectedEnvDetails.budget} $</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-1">Points</h4>
                      <p className="text-sm text-slate-400">{selectedEnvDetails.points}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-1">Durée</h4>
                    <p className="text-sm text-slate-400">{selectedEnvDetails.duration}</p>
                    <p className="text-xs text-slate-500 mt-1">Atteignez vos objectifs dans ce délai pour maximiser les bénéfices écologiques</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-1">Stratégies</h4>
                    <ul className="text-sm text-slate-400 space-y-1 mt-1">
                      {selectedEnvDetails.strategies.map((strategy, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-2">•</span>
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
                          <span className="mr-2">•</span>
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
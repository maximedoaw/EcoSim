"use client"

import { useState } from "react"
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
  budget: number;
  strategies: string[];
  points: number;
  duration: string;
  communityActions: string[];
};

const environmentsData: Environment[] = [
  {
    name: "Forêt",
    problem: "La déforestation réduit la capacité de la planète à absorber le CO2 et détruit la biodiversité.",
    objective: "Planter et protéger 1 000 arbres en 2 ans.",
    impact: "Réduction du CO2 atmosphérique, préservation de la biodiversité et amélioration de la qualité de l’air.",
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
    problem: "La surconsommation d’énergie fossile et la pollution urbaine augmentent l’effet de serre.",
    objective: "Installer 50 panneaux solaires communautaires en 3 ans.",
    impact: "Diminution de la dépendance aux énergies fossiles et amélioration de la qualité de l’air.",
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
    budget: 500,
    strategies: [
      "Investir 200 $ dans des techniques d’irrigation goutte-à-goutte.",
      "Utiliser des semences résistantes à la sécheresse.",
      "Mettre en place des coopératives agricoles."
    ],
    points: 200,
    duration: "4 ans",
    communityActions: [
      "Créer des jardins collectifs.",
      "Partager des systèmes d’irrigation low-cost.",
      "Former des agriculteurs à l’agroforesterie."
    ]
  },
  {
    name: "Océan",
    problem: "La pollution plastique et l’acidification détruisent la vie marine.",
    objective: "Réduire de 50% les déchets plastiques collectés en 3 ans.",
    impact: "Protection de la biodiversité marine et amélioration de la pêche durable.",
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

export function EnvironmentSelector({ className = "" }: EnvironmentSelectorProps) {
  const { currentEnvironment, setEnvironment, switchToPrevious, hasPrevious } = useEnvironment()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedEnvDetails, setSelectedEnvDetails] = useState<Environment | null>(null)

  const environments: { id: EnvironmentType, label: string, emoji: string, description: string }[] = [
    { id: "burnedForest", label: "Forêts brûlées", emoji: "🌲🔥", description: "Zones déforestées et incendiées" },
    { id: "meltingGlaciers", label: "Glaciers fondants", emoji: "❄️", description: "Glaces en fonte et montée des eaux" },
    { id: "pollutedCity", label: "Villes polluées", emoji: "🌆☁️", description: "Urbanisation et pollution atmosphérique" },
    { id: "expandingDesert", label: "Déserts en expansion", emoji: "🏜️", description: "Désertification et sécheresse" },
    { id: "acidOcean", label: "Océans acides", emoji: "🌊🐟", description: "Acidification des océans" }
  ]

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

  return (
    <>
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
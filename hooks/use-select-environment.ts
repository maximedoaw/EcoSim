import { EnvironmentType } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface EnvironmentState {
  currentEnvironment: EnvironmentType
  setEnvironment: (environment: EnvironmentType) => void
  environmentHistory: EnvironmentType[]
  addToHistory: (environment: EnvironmentType) => void
  clearHistory: () => void
  getPreviousEnvironment: () => EnvironmentType | null
}

export const useSelectEnvironment = create<EnvironmentState>()(
  persist(
    (set, get) => ({
      // Environnement par défaut
      currentEnvironment: 'burnedForest',
      
      // Définir l'environnement actuel
      setEnvironment: (environment: EnvironmentType) => {
        set((state) => ({
          currentEnvironment: environment,
          environmentHistory: [...state.environmentHistory, environment].slice(-10) // Garder les 10 derniers
        }))
      },
      
      // Historique des environnements
      environmentHistory: ['burnedForest'],
      
      // Ajouter à l'historique
      addToHistory: (environment: EnvironmentType) => {
        set((state) => ({
          environmentHistory: [...state.environmentHistory, environment].slice(-10)
        }))
      },
      
      // Vider l'historique
      clearHistory: () => {
        set({ environmentHistory: [] })
      },
      
      // Obtenir l'environnement précédent
      getPreviousEnvironment: () => {
        const { environmentHistory } = get()
        if (environmentHistory.length > 1) {
          return environmentHistory[environmentHistory.length - 2]
        }
        return null
      }
    }),
    {
      name: 'environment-storage', // Nom du stockage
      // Optionnel: vous pouvez sérialiser/désérialiser si nécessaire
    }
  )
)

// Hook personnalisé pour une utilisation facile
export const useEnvironment = () => {
  const { 
    currentEnvironment, 
    setEnvironment, 
    environmentHistory, 
    getPreviousEnvironment,
    clearHistory 
  } = useSelectEnvironment()

  // Fonction pour basculer vers l'environnement précédent
  const switchToPrevious = () => {
    const previous = getPreviousEnvironment()
    if (previous) {
      setEnvironment(previous)
    }
  }

  // Fonction pour obtenir les statistiques d'utilisation
  const getEnvironmentStats = () => {
    const stats: Record<EnvironmentType, number> = {
      burnedForest: 0,
      meltingGlaciers: 0,
      pollutedCity: 0,
      expandingDesert: 0,
      acidOcean: 0
    }

    environmentHistory.forEach(env => {
      stats[env] = (stats[env] || 0) + 1
    })

    return stats
  }

  // Fonction pour réinitialiser complètement
  const resetEnvironment = () => {
    setEnvironment('burnedForest')
    clearHistory()
  }

  return {
    currentEnvironment,
    setEnvironment,
    environmentHistory,
    switchToPrevious,
    getEnvironmentStats,
    resetEnvironment,
    hasPrevious: environmentHistory.length > 1
  }
}
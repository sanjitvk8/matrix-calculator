import { supabase } from '@/lib/supabase'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://0.0.0.0:8000'

// Validate environment variable
if (!import.meta.env.VITE_API_BASE_URL) {
  console.warn('VITE_API_BASE_URL not set, using fallback URL:', API_BASE_URL)
}

export interface Matrix {
  data: number[][]
  rows: number
  cols: number
}

export interface CalculationRequest {
  operation: string
  matrices: Matrix[]
  mode: 'learn' | 'calc'
}

export interface CalculationResponse {
  result: any
  steps?: string[]
  error?: string
}

class ApiService {
  private async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('No active session')
    }
    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    }
  }

  async calculateBasic(request: CalculationRequest): Promise<CalculationResponse> {
    const response = await fetch(`${API_BASE_URL}/basic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  async calculateAdvanced(request: CalculationRequest): Promise<CalculationResponse> {
    const headers = await this.getAuthHeaders()
    
    const response = await fetch(`${API_BASE_URL}/advanced`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  async getHistory(): Promise<any[]> {
    try {
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${API_BASE_URL}/history`, {
        method: 'GET',
        headers,
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch history')
      }

      return response.json()
    } catch (error) {
      console.error('History fetch error:', error)
      throw error
    }
  }

  async saveCalculation(calculation: any): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      await supabase
        .from('calculations')
        .insert({
          user_id: user.id,
          operation: calculation.operation,
          matrices: calculation.matrices,
          result: calculation.result,
          mode: calculation.mode,
        })
    }
  }
}

export const apiService = new ApiService()
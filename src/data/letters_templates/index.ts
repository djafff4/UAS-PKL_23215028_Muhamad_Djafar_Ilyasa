import type { LetterConfig } from '@/types/letter-config'

import contract from './contract.json'
import appointment from './appointment.json'
import workCertificate from './work-certificate.json'
import termination from './termination.json'

export const letterTemplates: LetterConfig[] = [
  contract as LetterConfig,
  appointment as LetterConfig,
  workCertificate as LetterConfig,
  termination as LetterConfig,
]

export function getLetterConfigById(id: string): LetterConfig | undefined {
  return letterTemplates.find(t => t.id === id)
}

export function getLetterTemplatesByCategory(category: LetterConfig['category']): LetterConfig[] {
  return letterTemplates.filter(t => t.category === category)
}

import type { User } from '@/types'

export const mockUsers: User[] = [
  { id: '1', name: 'Djafar Ilyasa', email: 'ceo@akman.id', role: 'SUPER_ADMIN', divisi: 'Eksekutif' },
  { id: '2', name: 'Muhammad Affif', email: 'cto@akman.id', role: 'DIREKTUR', divisi: 'Teknologi' },
  { id: '3', name: 'Direktur Akademik', email: 'akademik@akman.id', role: 'DIREKTUR', divisi: 'Akademik' },
  { id: '4', name: 'Direktur Marketing', email: 'marketing@akman.id', role: 'DIREKTUR', divisi: 'Marketing' },
  { id: '5', name: 'Direktur Penempatan', email: 'penempatan@akman.id', role: 'DIREKTUR', divisi: 'Penempatan' },
  { id: '6', name: 'Kepala Hubungan Industri', email: 'industri@akman.id', role: 'STAFF', divisi: 'Hubungan Industri' },
]

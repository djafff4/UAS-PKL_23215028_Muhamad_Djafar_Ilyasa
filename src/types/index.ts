// ── Backend Role Model ──
export interface BackendRole {
  id: string
  name: string
  label: string
  category: 'pillar' | 'addon'
  description?: string
}

// ── Backend Profile Model ──
export interface BackendProfile {
  full_name?: string
  avatar_url?: string
  avatar_focal_x?: number
  avatar_focal_y?: number
  avatar_focal_mode?: 'auto' | 'manual'
  gender?: string
  date_of_birth?: string
  birth_place?: string
  address?: string
  bio?: string
  branch_id?: string | null
}

// ── Backend User Model (from GET /auth/me) ──
export interface BackendUser {
  id: string
  akman_id: string
  email: string
  phone: string
  is_active: boolean
  roles: BackendRole[]
  profile?: BackendProfile | null
  staff_detail?: any | null
  instructor_detail?: any | null
  participant_detail?: any | null
}

// ── Legacy local User (for mock data compatibility) ──
export type UserRole = 'SUPER_ADMIN' | 'DIREKTUR_UTAMA' | 'DIREKTUR' | 'STAFF' | 'MULTIMEDIA'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  divisi: string
}

export type TaskStatus = 'PENDING' | 'PROGRESS' | 'REVIEW' | 'DONE' | 'CANCELLED'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: 'RENDAH' | 'SEDANG' | 'TINGGI' | 'KRITIS'
  assignee: User
  deadline: string
  progress: number
  createdAt: string
  updatedAt: string
}

export interface KPI {
  id: string
  divisi: string
  user: User
  indikator: string
  target: number
  pencapaian: number
  periode: string
  status: 'ON_TRACK' | 'NEED_ATTENTION' | 'BEHIND'
}

export interface RoadmapMilestone {
  id: string
  title: string
  description: string
  deadline: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED'
  progress: number
  divisi: string
}

export interface Activity {
  id: string
  user: User
  action: string
  target: string
  timestamp: string
  type: 'task' | 'kpi' | 'roadmap' | 'document' | 'meeting'
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  read: boolean
  createdAt: string
}

export interface Divisi {
  id: string
  name: string
  description: string
  head: User
  memberCount: number
}

export interface Document {
  id: string
  title: string
  type: string
  divisi: string
  uploadedBy: User
  uploadedAt: string
  fileSize: string
}

export interface Meeting {
  id: string
  title: string
  date: string
  time: string
  location: string
  participants: User[]
  notulen?: string
  status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'
  created_at?: string
  updated_at?: string
}

export interface Note {
  id: string
  title: string
  content: string
  category: string
  is_personal: boolean
  pinned: boolean
  tags: string[]
  created_by: string
  created_at: string
  updated_at: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  user: User
  category: 'FITUR_BARU' | 'OPTIMASI' | 'INOVASI' | 'IMPROVEMENT'
  date: string
  impact: string
}

// ── Staff Activity Feed ──
export interface StaffActivityItem {
  id: string
  user_id: string
  user_name: string
  user_avatar: string
  action: string
  target: string
  target_type: string
  timestamp: string
}

// ── Staff Management ──
export interface StaffListItem {
  id: string
  akman_id: string
  email: string
  phone: string
  full_name: string
  gender: string
  position: string
  department: string
  reports_to: string | null
  roles: string[]
  is_active: boolean
  created_at: string
}

export interface StaffDetail {
  id: string
  akman_id: string
  email: string
  phone: string
  full_name: string
  gender: string
  position: string
  department: string
  reports_to: string | null
  roles: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

// ── CV / Resume ──
export type CVTemplate = 'akman-academy' | 'akman-corporate' | 'modern' | 'executive' | 'minimalist' | 'creative'

export interface CVSkillDetail {
  name: string
  percentage: number
}

export interface Education {
  id: string
  institution: string
  degree: string
  field_of_study: string
  start_year: string
  end_year: string
  description?: string
  gpa?: string
}

export interface Experience {
  id: string
  company: string
  position: string
  location?: string
  start_date: string
  end_date?: string
  current: boolean
  description: string
  achievements?: string[]
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  url?: string
  description?: string
}

export type LanguageLevel = 'dasar' | 'menengah' | 'lancar'

export interface Language {
  id: string
  name: string
  level: LanguageLevel
}

export interface SocialMedia {
  facebook?: string
  instagram?: string
  tiktok?: string
  youtube?: string
  whatsapp?: string
  linkedin?: string
  twitter?: string
  github?: string
}

export interface CV {
  id: string
  user_id?: string
  title: string
  template: CVTemplate
  summary: string

  // Personal info (prefilled from profile)
  full_name: string
  email: string
  phone: string
  avatar_url?: string
  position?: string        // Opsional — jabatan tidak wajib
  department?: string
  date_of_birth?: string   // Tanggal lahir dari profil
  birth_place?: string     // Tempat lahir dari profil

  // Sections
  education: Education[]
  experience: Experience[]
  skills: string[]
  skill_details: CVSkillDetail[]
  certifications: Certification[]
  languages: Language[]
  social_media?: SocialMedia

  // Metadata
  created_at: string
  updated_at: string

  // Creator info (populated by backend join, not stored in DB)
  creator_name?: string
  creator_avatar?: string
}

// ── Dashboard / Donut Chart ──
export interface DonutSegment {
  label: string
  value: number
  color: string
  percentage: number
}

// ── Keuangan (Finance) ──
export type FinanceTransactionType = 'PEMASUKAN' | 'PENGELUARAN'

export interface FinanceTransaction {
  id: string
  type: FinanceTransactionType
  amount: number
  category: string
  description: string
  date: string
  evidence_photo: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface FinanceSummary {
  totalPemasukan: number
  totalPengeluaran: number
  saldo: number
  transaksiBulanIni: number
}

// ── Staff Contract Letter ──
export type ContractStatus = 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED' | 'CANCELLED'

export interface StaffContract {
  id: string
  staff_id: string
  staff_name: string
  contract_number: string
  contract_type: 'PKWT' | 'PKWTT' | 'PERJANJIAN_KERJA'
  position: string
  department: string
  start_date: string
  end_date: string | null
  salary: number | null
  signature_type: 'traditional' | 'qrcode'
  status: ContractStatus
  notes: string
  file_url: string | null
  created_at: string
  updated_at: string
}

// ── Staff Appointment Letter ──
export type AppointmentStatus = 'DRAFT' | 'ACTIVE' | 'REVOKED' | 'CANCELLED'

export interface StaffAppointmentLetter {
  id: string
  staff_id: string
  staff_name: string
  letter_number: string
  appointment_type: 'PENUNJUKAN' | 'PENGANGKATAN' | 'PERPINDAHAN' | 'PENUGASAN'
  position: string
  department: string
  effective_date: string
  end_date: string | null
  reports_to: string | null
  signature_type: 'traditional' | 'qrcode'
  status: AppointmentStatus
  notes: string
  file_url: string | null
  created_at: string
  updated_at: string
}

// ── Staff Work Certificate (Surat Keterangan Kerja Aktif) ──
export type WorkCertificateStatus = 'DRAFT' | 'ACTIVE' | 'REVOKED' | 'CANCELLED'

export interface StaffWorkCertificate {
  id: string
  staff_id: string
  staff_name: string
  letter_number: string
  certificate_type: 'AKTIF'
  purpose: string          // Keperluan surat (syarat pengajuan finansial/visa/etc)
  position: string
  department: string
  start_date: string       // Tanggal mulai bekerja
  signature_type: 'traditional' | 'qrcode'
  status: WorkCertificateStatus
  notes: string
  file_url: string | null
  created_at: string
  updated_at: string
}

// ── Staff Termination Letter (Surat Keterangan Kerja Non-Aktif / Paklaring) ──
export type TerminationStatus = 'DRAFT' | 'ACTIVE' | 'REVOKED' | 'CANCELLED'

export interface StaffTerminationLetter {
  id: string
  staff_id: string
  staff_name: string
  letter_number: string
  termination_type: 'KONTRAK_BERAKHIR' | 'PENGUNDURAN_DIRI' | 'PHK' | 'LAINNYA'
  position: string
  department: string
  start_date: string       // Tanggal mulai bekerja
  end_date: string         // Tanggal berakhir kerja
  reason: string           // Alasan berakhir (opsional)
  signature_type: 'traditional' | 'qrcode'
  status: TerminationStatus
  notes: string
  file_url: string | null
  created_at: string
  updated_at: string
}

// ── E-Library ──

export interface EBookCategory {
  id: string
  tenant_id: string
  brand_id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}

export interface EBook {
  id: string
  tenant_id: string
  brand_id: string
  category_id: string | null
  title: string
  author: string
  isbn: string
  publisher: string
  published_year: number
  description: string
  language: string
  page_count: number

  book_type: string

  storage_provider: string
  storage_file_id: string
  storage_folder_id: string

  original_file_name: string
  file_format: string
  file_size: number

  cover_image_url: string
  thumbnail_url: string

  preview_available: boolean
  preview_page_count: number

  ai_summary: string
  keywords: string[]

  upload_status: string
  preview_status: string
  ai_status: string

  access_type: string

  uploaded_by: string | null
  department_id: string | null
  folder_path: string

  created_at: string
  updated_at: string
  category?: EBookCategory | null
  previews?: EBookPreview[]
  tags?: EBookTag[]
  versions?: EBookVersion[]
}

export interface EBookPreview {
  id: string
  book_id: string
  page_number: number
  image_url: string
  width: number
  height: number
  created_at: string
}

export interface EBookTag {
  id: string
  tenant_id: string
  brand_id: string
  name: string
  created_at: string
  updated_at: string
}

export interface EBookVersion {
  id: string
  book_id: string
  version_number: number
  storage_file_id: string
  file_format: string
  file_size: number
  change_notes: string
  created_by: string
  created_at: string
}

export interface EBookAccessLog {
  id: string
  book_id: string
  user_id: string
  action: string
  ip_address: string
  user_agent: string
  created_at: string
}

export interface EBookPreview {
  id: string
  book_id: string
  page_number: number
  image_url: string
  width: number
  height: number
  created_at: string
}

export interface EBookTag {
  id: string
  tenant_id: string
  brand_id: string
  name: string
  created_at: string
  updated_at: string
}

export type BorrowingStatus = 'borrowed' | 'returned' | 'overdue'

export interface EBookBorrowing {
  id: string
  tenant_id: string
  brand_id: string
  book_id: string
  user_id: string
  borrowed_at: string
  due_date: string
  returned_at: string | null
  status: BorrowingStatus
  notes: string
  created_at: string
  updated_at: string
  book?: EBook | null
}

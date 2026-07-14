import type { LetterTemplate } from './template'

export interface LetterConfig extends LetterTemplate {
  body_template_id: string
  has_cover_page?: boolean
}

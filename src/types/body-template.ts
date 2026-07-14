// Body template types for letter content

export interface BodyTextBlock {
  type: 'paragraph' | 'heading' | 'subheading'
  content: string // May contain {{ variable }} placeholders
  style?: 'normal' | 'bold' | 'italic' | 'indent'
  class?: string // CSS class name
}

export interface BodyTableField {
  label: string
  value: string // May contain {{ variable }} placeholders
}

export interface BodyTableBlock {
  type: 'table'
  title?: string
  fields: BodyTableField[]
  style?: 'default' | 'highlighted' | 'bordered'
  class?: string
}

export interface BodyArticleBlock {
  type: 'article'
  number: number
  title: string
  content: BodyTextBlock[]
}

export interface BodySummaryItem {
  label: string
  value: string // May contain {{ variable }} placeholders
}

export interface BodySummaryBlock {
  type: 'summary'
  title: string
  items: BodySummaryItem[]
}

export type BodyBlock = BodyTextBlock | BodyTableBlock | BodyArticleBlock | BodySummaryBlock

export interface LetterBodyTemplate {
  id: string
  name: string
  category: 'work_certificate' | 'termination' | 'appointment' | 'contract'
  title: string
  subtitle?: string
  blocks: BodyBlock[]
}

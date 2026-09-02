export type Specialty =
  | 'Clínica médica'
  | 'Cardiología'
  | 'Dermatología'
  | 'Pediatría'

export interface Professional {
  id: number
  name: string
  specialty: Specialty
  credential: string
  location: string
  initials: string
  accent: string
  nextAvailable: string
  slots: string[]
}

export interface Appointment {
  id: number
  dateLabel: string
  day: string
  month: string
  time: string
  professional: string
  specialty: Specialty
  location: string
  status: 'Confirmado' | 'Pendiente'
}

export interface BookingSelection {
  professional: Professional
  time: string
}

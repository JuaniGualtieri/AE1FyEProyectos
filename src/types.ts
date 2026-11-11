export type Specialty =
  | 'Clínica médica'
  | 'Cardiología'
  | 'Dermatología'
  | 'Pediatría'

export interface Professional {
  id: number
  name: string
  specialty: Specialty
  location: string
  initials: string
  accent: string
  availability: { date: string; times: string[] }[]
}

export interface BookingSelection {
  professionalId: number
  date: string
  time: string
}

export interface Appointment extends BookingSelection {
  status: 'Confirmado' | 'Pendiente'
}

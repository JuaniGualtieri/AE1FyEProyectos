import type { Appointment, BookingSelection, Professional, Specialty } from '../types'

export const specialties: Array<'Todas' | Specialty> = [
  'Todas',
  'Clínica médica',
  'Cardiología',
  'Dermatología',
  'Pediatría',
]

export const sites = ['Sede Centro', 'Sede Costanera']
export const firstDemoDay = '2026-11-12'
export const lastDemoDay = '2026-11-16'

export const professionals: Professional[] = [
  {
    id: 1,
    name: 'Dra. Elena Ríos',
    specialty: 'Clínica médica',
    location: 'Sede Centro',
    initials: 'ER',
    accent: '#d7ece7',
    availability: [
      { date: '2026-11-12', times: ['10:30', '11:15', '16:00'] },
      { date: '2026-11-16', times: ['09:30', '12:00'] },
    ],
  },
  {
    id: 2,
    name: 'Dr. Martín Salas',
    specialty: 'Cardiología',
    location: 'Sede Centro',
    initials: 'MS',
    accent: '#e5e7f5',
    availability: [
      { date: '2026-11-12', times: ['09:00', '12:30'] },
      { date: '2026-11-13', times: ['10:15', '17:15'] },
    ],
  },
  {
    id: 3,
    name: 'Dra. Paula Ferreyra',
    specialty: 'Dermatología',
    location: 'Sede Costanera',
    initials: 'PF',
    accent: '#f5e4dc',
    availability: [
      { date: '2026-11-13', times: ['08:45', '14:00', '15:30'] },
      { date: '2026-11-16', times: ['09:00', '10:15'] },
    ],
  },
  {
    id: 4,
    name: 'Dr. Joaquín Molina',
    specialty: 'Pediatría',
    location: 'Sede Costanera',
    initials: 'JM',
    accent: '#f5ebca',
    availability: [
      { date: '2026-11-12', times: ['10:00', '13:15', '18:00'] },
      { date: '2026-11-16', times: ['09:00', '11:45'] },
    ],
  },
]

export const initialAppointments: Appointment[] = [
  { professionalId: 1, date: '2026-11-12', time: '10:30', status: 'Confirmado' },
]

const demoKey = 'clinical-demo-appointments-v1'
const monthFormatter = new Intl.DateTimeFormat('es-AR', { month: 'short', timeZone: 'UTC' })
const dateFormatter = new Intl.DateTimeFormat('es-AR', {
  weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC',
})

export function demoDate(date: string) {
  return dateFormatter.format(new Date(date + 'T00:00:00Z'))
}

export function demoMonth(date: string) {
  return monthFormatter.format(new Date(date + 'T00:00:00Z')).replace('.', '').toUpperCase()
}

export function bookingKey(slot: BookingSelection) {
  return [slot.professionalId, slot.date, slot.time].join('/')
}

export function loadAppointments(): Appointment[] {
  try {
    const saved = localStorage.getItem(demoKey)
    if (saved === null) return initialAppointments
    const data: unknown = JSON.parse(saved)
    if (!Array.isArray(data)) return initialAppointments
    const seen = new Set<string>()
    return data.filter((item): item is Appointment => {
      if (!item || (item.status !== 'Confirmado' && item.status !== 'Pendiente')) return false
      const available = professionals.some((p) => p.id === item.professionalId
        && p.availability.some((day) => day.date === item.date && day.times.includes(item.time)))
      if (!available || seen.has(bookingKey(item))) return false
      seen.add(bookingKey(item))
      return true
    })
  } catch {
    return initialAppointments
  }
}

export function saveAppointments(appointments: Appointment[]) {
  try {
    localStorage.setItem(demoKey, JSON.stringify(appointments))
  } catch {
    // Keep the current session usable when browser storage is unavailable.
  }
}

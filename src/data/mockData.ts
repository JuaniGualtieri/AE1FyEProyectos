import type { Appointment, Professional, Specialty } from '../types'

export const specialties: Array<'Todas' | Specialty> = [
  'Todas',
  'Clínica médica',
  'Cardiología',
  'Dermatología',
  'Pediatría',
]

export const professionals: Professional[] = [
  {
    id: 1,
    name: 'Dra. Elena Ríos',
    specialty: 'Clínica médica',
    credential: 'M.P. 48.210',
    location: 'Sede Centro',
    initials: 'ER',
    accent: '#d7ece7',
    nextAvailable: 'Hoy',
    slots: ['10:30', '11:15', '16:00'],
  },
  {
    id: 2,
    name: 'Dr. Martín Salas',
    specialty: 'Cardiología',
    credential: 'M.P. 39.851',
    location: 'Sede Centro',
    initials: 'MS',
    accent: '#e5e7f5',
    nextAvailable: 'Mañana',
    slots: ['09:00', '12:30', '17:15'],
  },
  {
    id: 3,
    name: 'Dra. Paula Ferreyra',
    specialty: 'Dermatología',
    credential: 'M.P. 51.902',
    location: 'Sede Nueva Córdoba',
    initials: 'PF',
    accent: '#f5e4dc',
    nextAvailable: 'Vie. 05 sep.',
    slots: ['08:45', '14:00', '15:30'],
  },
  {
    id: 4,
    name: 'Dr. Joaquín Molina',
    specialty: 'Pediatría',
    credential: 'M.P. 45.118',
    location: 'Sede Nueva Córdoba',
    initials: 'JM',
    accent: '#f5ebca',
    nextAvailable: 'Vie. 05 sep.',
    slots: ['10:00', '13:15', '18:00'],
  },
]

export const initialAppointments: Appointment[] = [
  {
    id: 101,
    dateLabel: 'Jueves 3 de septiembre',
    day: '03',
    month: 'SEP',
    time: '10:30',
    professional: 'Dra. Elena Ríos',
    specialty: 'Clínica médica',
    location: 'Sede Centro · Consultorio 4',
    status: 'Confirmado',
  },
]

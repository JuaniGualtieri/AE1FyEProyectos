import { useMemo, useState } from 'react'
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  HelpCircle,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react'
import { BookingModal } from './components/BookingModal'
import { Logo } from './components/Logo'
import { initialAppointments, professionals, specialties } from './data/mockData'
import type { Appointment, BookingSelection, Specialty } from './types'

function App() {
  const [activeSpecialty, setActiveSpecialty] = useState<'Todas' | Specialty>('Todas')
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('Todas las sedes')
  const [selection, setSelection] = useState<BookingSelection | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)
  const [toast, setToast] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)

  const filteredProfessionals = useMemo(() => {
    const normalized = searchTerm.trim().toLocaleLowerCase('es')
    return professionals.filter((professional) => {
      const matchesSpecialty =
        activeSpecialty === 'Todas' || professional.specialty === activeSpecialty
      const matchesLocation =
        location === 'Todas las sedes' || professional.location === location
      const matchesSearch =
        normalized.length === 0 ||
        `${professional.name} ${professional.specialty}`
          .toLocaleLowerCase('es')
          .includes(normalized)
      return matchesSpecialty && matchesLocation && matchesSearch
    })
  }, [activeSpecialty, location, searchTerm])

  const confirmBooking = () => {
    if (!selection) return

    const newAppointment: Appointment = {
      id: Date.now(),
      dateLabel: 'Jueves 3 de septiembre',
      day: '03',
      month: 'SEP',
      time: selection.time,
      professional: selection.professional.name,
      specialty: selection.professional.specialty,
      location: `${selection.professional.location} · Consultorio a confirmar`,
      status: 'Pendiente',
    }
    setAppointments((current) => [...current, newAppointment])
    setSelection(null)
    setToast(true)
    window.setTimeout(() => setToast(false), 3500)
  }

  const runSearch = () => {
    document.querySelector('#professionals')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <div className="demo-banner">
        <ShieldCheck size={15} />
        <span><strong>Entorno demostrativo:</strong> los datos son ficticios y no tienen validez médica.</span>
      </div>

      <header className="site-header">
        <div className="header-inner">
          <a href="#top" className="logo-link"><Logo /></a>
          <nav className={mobileMenu ? 'main-nav open' : 'main-nav'} aria-label="Navegación principal">
            <a href="#appointments" onClick={() => setMobileMenu(false)}>Mis turnos</a>
            <a href="#professionals" onClick={() => setMobileMenu(false)}>Profesionales</a>
            <a href="#help" onClick={() => setMobileMenu(false)}>Ayuda</a>
          </nav>
          <div className="header-actions">
            <button className="icon-button notification" aria-label="Notificaciones">
              <Bell size={20} /><span>2</span>
            </button>
            <button className="profile-button">
              <span className="profile-avatar">SO</span>
              <span className="profile-copy"><b>Sofía</b><small>Mi cuenta</small></span>
              <ChevronDown size={16} />
            </button>
            <button
              className="icon-button menu-button"
              aria-label={mobileMenu ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenu}
              onClick={() => setMobileMenu((open) => !open)}
            >
              {mobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="welcome-pill"><Sparkles size={15} /> Hola, Sofía</div>
              <h1>Tu salud, más simple<br />y cerca tuyo.</h1>
              <p>Encontrá profesionales, elegí un horario y organizá tus turnos desde un solo lugar.</p>
            </div>

            <div className="search-panel" aria-label="Buscar un turno">
              <div className="search-panel-title">
                <div><CalendarDays size={21} /><strong>Buscá tu próximo turno</strong></div>
                <span>Disponibilidad simulada</span>
              </div>
              <div className="search-grid">
                <label>
                  <span>Especialidad o profesional</span>
                  <div className="field"><Search size={18} /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Ej. Cardiología" /></div>
                </label>
                <label>
                  <span>Sede</span>
                  <div className="field"><MapPin size={18} /><select value={location} onChange={(event) => setLocation(event.target.value)}><option>Todas las sedes</option><option>Sede Centro</option><option>Sede Nueva Córdoba</option></select><ChevronDown size={16} /></div>
                </label>
                <label>
                  <span>Fecha</span>
                  <div className="field"><CalendarDays size={18} /><input type="date" defaultValue="2026-09-03" /></div>
                </label>
                <button className="button search-button" onClick={runSearch}>Buscar turno <ChevronRight size={18} /></button>
              </div>
            </div>
          </div>
        </section>

        <div className="content-wrap">
          <section className="appointments-section" id="appointments">
            <div className="section-heading">
              <div><p className="eyebrow">Tu agenda</p><h2>Próximos turnos</h2></div>
              <button className="text-button">Ver todos <ChevronRight size={17} /></button>
            </div>

            <div className="appointments-grid">
              <div className="appointments-list">
                {appointments.slice(0, 2).map((appointment) => (
                  <article className="appointment-card" key={appointment.id}>
                    <div className="date-block"><strong>{appointment.day}</strong><span>{appointment.month}</span></div>
                    <div className="appointment-main">
                      <span className={`status-badge ${appointment.status === 'Pendiente' ? 'pending' : ''}`}><CheckCircle2 size={14} />{appointment.status}</span>
                      <h3>{appointment.professional}</h3>
                      <p>{appointment.specialty}</p>
                      <div className="appointment-meta"><span><Clock3 size={16} />{appointment.time} hs</span><span><MapPin size={16} />{appointment.location}</span></div>
                    </div>
                    <button className="button secondary compact">Ver detalle</button>
                  </article>
                ))}
              </div>

              <aside className="reminder-card">
                <div className="reminder-icon"><Bell size={23} /></div>
                <div><p className="eyebrow">Recordatorio</p><h3>Tu turno es mañana</h3><p>Recordá llegar 10 minutos antes y traer tu credencial.</p></div>
                <button className="icon-button" aria-label="Ver recordatorio"><ChevronRight size={20} /></button>
              </aside>
            </div>
          </section>

          <section className="professionals-section" id="professionals">
            <div className="section-heading professionals-heading">
              <div><p className="eyebrow">Atención disponible</p><h2>Encontrá un profesional</h2><p>Elegí por especialidad y reservá el horario que mejor se adapte a vos.</p></div>
              <button className="filter-button"><SlidersHorizontal size={17} /> Más filtros</button>
            </div>

            <div className="specialty-tabs" role="group" aria-label="Filtrar por especialidad">
              {specialties.map((specialty) => (
                <button key={specialty} className={specialty === activeSpecialty ? 'active' : ''} onClick={() => setActiveSpecialty(specialty)}>{specialty}</button>
              ))}
            </div>

            <div className="professionals-grid">
              {filteredProfessionals.map((professional) => (
                <article className="professional-card" key={professional.id}>
                  <div className="professional-profile">
                    <div className="avatar" style={{ background: professional.accent }}>{professional.initials}</div>
                    <div><h3>{professional.name}</h3><p>{professional.specialty}</p><small>{professional.credential}</small></div>
                  </div>
                  <div className="location-row"><MapPin size={16} /><span>{professional.location}</span></div>
                  <div className="availability-row"><span>Próxima disponibilidad</span><strong>{professional.nextAvailable}</strong></div>
                  <div className="slots">
                    {professional.slots.map((slot) => <button key={slot} onClick={() => setSelection({ professional, time: slot })}>{slot}</button>)}
                  </div>
                  <button className="button card-action" onClick={() => setSelection({ professional, time: professional.slots[0] })}>Ver disponibilidad <ChevronRight size={17} /></button>
                </article>
              ))}
            </div>

            {filteredProfessionals.length === 0 && (
              <div className="empty-state"><UserRound size={28} /><h3>No encontramos resultados</h3><p>Probá otra especialidad, sede o nombre.</p><button className="text-button" onClick={() => { setSearchTerm(''); setLocation('Todas las sedes'); setActiveSpecialty('Todas') }}>Limpiar filtros</button></div>
            )}
          </section>

          <section className="help-strip" id="help">
            <div className="help-icon"><HelpCircle size={24} /></div>
            <div><h2>¿Necesitás ayuda para reservar?</h2><p>En una implementación real, el equipo de admisión podría acompañarte.</p></div>
            <button className="button secondary">Ver preguntas frecuentes</button>
          </section>
        </div>
      </main>

      <footer>
        <div><Logo /><p>Portal de pacientes · Prototipo académico</p></div>
        <p>Clinical no reemplaza la consulta con un profesional de la salud.</p>
      </footer>

      {selection && <BookingModal selection={selection} onClose={() => setSelection(null)} onConfirm={confirmBooking} />}
      <div className={toast ? 'toast visible' : 'toast'} role="status"><CheckCircle2 size={20} /><div><strong>Turno agregado</strong><span>La reserva simulada aparece en tu agenda.</span></div></div>
    </div>
  )
}

export default App

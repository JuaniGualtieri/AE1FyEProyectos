import { useEffect, useState } from 'react'
import {
  Bell, CalendarDays, CheckCircle2, ChevronDown, ChevronRight, Clock3,
  HelpCircle, MapPin, Menu, Search, ShieldCheck, Sparkles, UserRound, X,
} from 'lucide-react'
import { BookingModal } from './components/BookingModal'
import { Logo } from './components/Logo'
import {
  bookingKey, demoDate, demoMonth, firstDemoDay, initialAppointments, lastDemoDay,
  loadAppointments, professionals, saveAppointments, sites, specialties,
} from './data/mockData'
import type { Appointment, BookingSelection, Specialty } from './types'

const allSites = 'Todas las sedes'
const normalize = (text: string) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()

function App() {
  const [activeSpecialty, setActiveSpecialty] = useState<'Todas' | Specialty>('Todas')
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState(allSites)
  const [date, setDate] = useState('')
  const [selection, setSelection] = useState<BookingSelection | null>(null)
  const [details, setDetails] = useState<Appointment | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>(loadAppointments)
  const [toast, setToast] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => { saveAppointments(appointments) }, [appointments])
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 3800)
    return () => window.clearTimeout(timer)
  }, [toast])

  const booked = new Set(appointments.map(bookingKey))
  const query = normalize(searchTerm)
  const filteredProfessionals = professionals
    .filter((p) => (activeSpecialty === 'Todas' || p.specialty === activeSpecialty)
      && (location === allSites || p.location === location)
      && normalize(`${p.name} ${p.specialty}`).includes(query))
    .flatMap((professional) => {
      const days = professional.availability
        .filter((day) => !date || day.date === date)
        .map((day) => ({
          ...day,
          times: day.times.filter((time) => !booked.has(bookingKey({ professionalId: professional.id, date: day.date, time }))),
        }))
        .filter((day) => day.times.length > 0)
      return days.length ? [{ professional, days }] : []
    })

  const sortedAppointments = [...appointments].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
  const nextAppointment = sortedAppointments[0]
  const modalSlot = selection ?? details
  const modalProfessional = professionals.find((p) => p.id === modalSlot?.professionalId)
  const closeModal = () => { setSelection(null); setDetails(null) }

  const confirmBooking = () => {
    if (!selection) return
    const key = bookingKey(selection)
    setAppointments((current) => current.some((item) => bookingKey(item) === key)
      ? current
      : [...current, { ...selection, status: 'Pendiente' }])
    setShowAll(true)
    closeModal()
    setToast('La reserva simulada aparece en tu agenda.')
  }

  const cancelBooking = () => {
    if (!details) return
    setAppointments((current) => current.filter((item) => bookingKey(item) !== bookingKey(details)))
    closeModal()
    setToast('El turno se canceló y el horario volvió a estar disponible.')
  }

  const clearFilters = () => {
    setSearchTerm('')
    setLocation(allSites)
    setDate('')
    setActiveSpecialty('Todas')
  }

  return (
    <div className="app-shell" id="top">
      <div className="demo-banner">
        <ShieldCheck size={15} />
        <span><strong>Demostración académica:</strong> datos ficticios. Las reservas no tienen validez real.</span>
      </div>

      <header className="site-header">
        <div className="header-inner">
          <a href="#top" className="logo-link"><Logo /></a>
          <nav id="main-nav" className={mobileMenu ? 'main-nav open' : 'main-nav'} aria-label="Navegación principal">
            <a href="#appointments" onClick={() => setMobileMenu(false)}>Mis turnos</a>
            <a href="#professionals" onClick={() => setMobileMenu(false)}>Profesionales</a>
            <a href="#help" onClick={() => setMobileMenu(false)}>Ayuda</a>
          </nav>
          <div className="header-actions">
            <a href="#reminder" className="icon-button notification" aria-label="Ir al recordatorio de turnos">
              <Bell size={20} />{nextAppointment && <span aria-hidden="true">1</span>}
            </a>
            <div className="profile-button"><span className="profile-avatar">SO</span><span className="profile-copy"><b>Sofía</b><small>Perfil ficticio</small></span></div>
            <button className="icon-button menu-button" aria-label={mobileMenu ? 'Cerrar menú' : 'Abrir menú'}
              aria-controls="main-nav" aria-expanded={mobileMenu} onClick={() => setMobileMenu((open) => !open)}>
              {mobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="welcome-pill"><Sparkles size={15} /> Portal de pacientes</div>
              <h1>Hola, Sofía.<br />Organizá tus turnos.</h1>
              <p>Buscá un profesional, elegí un horario y probá cómo funciona la agenda de Clinical.</p>
            </div>
            <form className="search-panel" aria-label="Buscar un turno" onSubmit={(event) => {
              event.preventDefault()
              const results = document.querySelector<HTMLElement>('#professionals-title')
              results?.focus({ preventScroll: true })
              results?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}>
              <div className="search-panel-title">
                <div><CalendarDays size={21} /><strong>Buscá tu próximo turno</strong></div>
                <span>Agenda ficticia del 12 al 16 de noviembre</span>
              </div>
              <div className="search-grid">
                <label>
                  <span>Especialidad o profesional</span>
                  <div className="field"><Search size={18} /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Ej. Cardiología" /></div>
                </label>
                <label>
                  <span id="site-field-label">Sede</span>
                  <div className="field"><MapPin size={18} /><select aria-labelledby="site-field-label" value={location} onChange={(event) => setLocation(event.target.value)}>
                    <option>{allSites}</option>{sites.map((site) => <option key={site}>{site}</option>)}
                  </select><ChevronDown size={16} /></div>
                </label>
                <label>
                  <span>Fecha <small>(opcional)</small></span>
                  <div className="field"><CalendarDays size={18} /><input type="date" min={firstDemoDay} max={lastDemoDay} value={date} onChange={(event) => setDate(event.target.value)} /></div>
                </label>
                <button className="button search-button" type="submit">Buscar turno <ChevronRight size={18} /></button>
              </div>
            </form>
          </div>
        </section>

        <div className="content-wrap">
          <section className="appointments-section" id="appointments">
            <div className="section-heading">
              <div><p className="eyebrow">Tu agenda</p><h2>Próximos turnos</h2></div>
              {appointments.length > 2 && <button className="text-button" onClick={() => setShowAll(!showAll)}>
                {showAll ? 'Mostrar menos' : `Ver todos (${appointments.length})`} <ChevronRight size={17} />
              </button>}
            </div>

            <div className="appointments-grid">
              <div className="appointments-list">
                {(showAll ? sortedAppointments : sortedAppointments.slice(0, 2)).map((appointment) => {
                  const p = professionals.find((professional) => professional.id === appointment.professionalId)!
                  return <article className="appointment-card" key={bookingKey(appointment)}>
                    <div className="date-block"><strong>{appointment.date.slice(8)}</strong><span>{demoMonth(appointment.date)}</span></div>
                    <div className="appointment-main">
                      <span className={`status-badge ${appointment.status === 'Pendiente' ? 'pending' : ''}`}><CheckCircle2 size={14} />{appointment.status}</span>
                      <h3>{p.name}</h3>
                      <p>{p.specialty}</p>
                      <div className="appointment-meta"><span><Clock3 size={16} />{appointment.time} hs</span><span><MapPin size={16} />{p.location}</span></div>
                    </div>
                    <button className="button secondary compact" onClick={() => setDetails(appointment)} aria-label={`Ver detalle: ${p.name}, ${appointment.time}`}>Ver detalle</button>
                  </article>
                })}
                {appointments.length === 0 && <div className="empty-state"><CalendarDays size={28} /><h3>No tenés turnos reservados</h3><a className="text-button" href="#professionals">Buscar disponibilidad <ChevronRight size={17} /></a></div>}
              </div>

              <aside className="reminder-card" id="reminder">
                <div className="reminder-icon"><Bell size={23} /></div>
                <div><p className="eyebrow">Recordatorio</p><h3>{nextAppointment ? 'Tu próximo turno' : 'Sin recordatorios'}</h3>
                  <p>{nextAppointment ? `${demoDate(nextAppointment.date)} · ${nextAppointment.time} hs` : 'El próximo turno que reserves aparecerá acá.'}</p></div>
                {nextAppointment && <button className="icon-button" aria-label="Ver recordatorio" onClick={() => setDetails(nextAppointment)}><ChevronRight size={20} /></button>}
              </aside>
            </div>
          </section>

          <section className="professionals-section" id="professionals">
            <div className="section-heading professionals-heading">
              <div><p className="eyebrow">Disponibilidad simulada</p><h2 id="professionals-title" tabIndex={-1}>Encontrá un profesional</h2>
                <p aria-live="polite">{filteredProfessionals.length} {filteredProfessionals.length === 1 ? 'profesional disponible' : 'profesionales disponibles'}</p></div>
              {(searchTerm || location !== allSites || date || activeSpecialty !== 'Todas') && <button className="filter-button" onClick={clearFilters}>Limpiar filtros</button>}
            </div>

            <div className="specialty-tabs" role="group" aria-label="Filtrar por especialidad">
              {specialties.map((specialty) => <button key={specialty} aria-pressed={specialty === activeSpecialty}
                className={specialty === activeSpecialty ? 'active' : ''} onClick={() => setActiveSpecialty(specialty)}>{specialty}</button>)}
            </div>

            <div className="professionals-grid">
              {filteredProfessionals.map(({ professional, days }) => (
                <article className="professional-card" key={professional.id}>
                  <div className="professional-profile">
                    <div className="avatar" style={{ background: professional.accent }}>{professional.initials}</div>
                    <div><h3>{professional.name}</h3><p>{professional.specialty}</p></div>
                  </div>
                  <div className="location-row"><MapPin size={16} /><span>{professional.location} · Corrientes</span></div>
                  {days.map((day) => <div key={day.date}>
                    <div className="availability-row"><strong>{demoDate(day.date)}</strong></div>
                    <div className="slots">{day.times.map((time) => <button key={time}
                      aria-label={`Reservar con ${professional.name}, ${demoDate(day.date)}, ${time}`}
                      onClick={() => setSelection({ professionalId: professional.id, date: day.date, time })}>{time}</button>)}</div>
                  </div>)}
                </article>
              ))}
            </div>
            {filteredProfessionals.length === 0 && <div className="empty-state"><UserRound size={28} />
              <h3>No encontramos horarios</h3><p>Probá otra fecha, sede o especialidad.</p><button className="text-button" onClick={clearFilters}>Mostrar toda la disponibilidad</button>
            </div>}
          </section>

          <section className="help-strip" id="help">
            <div className="help-icon"><HelpCircle size={24} /></div>
            <div><h2>Ayuda para usar la demo</h2><p>Elegí un horario disponible. Podés cancelar el turno desde su detalle.</p>
              <details><summary>¿Dónde se guardan los turnos?</summary><p>Solo en este navegador, con datos ficticios. No se envía ninguna notificación ni solicitud a centros de salud.</p></details>
            </div>
            <button className="button secondary" onClick={() => {
              setAppointments(initialAppointments); clearFilters(); setShowAll(false); setToast('La agenda volvió a su estado inicial.')
            }}>Reiniciar demo</button>
          </section>
        </div>
      </main>

      <footer>
        <div><Logo /><p>Portal de pacientes · Prototipo académico</p></div>
        <p>Reservas simuladas en centros ficticios de Corrientes.</p>
      </footer>

      {modalSlot && modalProfessional && <BookingModal selection={modalSlot} professional={modalProfessional} details={Boolean(details)}
        onClose={closeModal} onAction={details ? cancelBooking : confirmBooking} />}
      <div className={toast ? 'toast visible' : 'toast'} role="status">
        {toast && <><CheckCircle2 size={20} /><div><strong>Agenda actualizada</strong><span>{toast}</span></div></>}
      </div>
    </div>
  )
}

export default App

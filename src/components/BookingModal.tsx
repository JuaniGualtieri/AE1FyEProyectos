import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { CalendarDays, Check, Clock3, MapPin, X } from 'lucide-react'
import { demoDate } from '../data/mockData'
import type { BookingSelection, Professional } from '../types'

interface BookingModalProps {
  selection: BookingSelection
  professional: Professional
  details?: boolean
  onClose: () => void
  onAction: () => void
}

export function BookingModal({ selection, professional, details, onClose, onAction }: BookingModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    const previous = document.activeElement
    dialog?.showModal()
    return () => {
      dialog?.close()
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus({ preventScroll: true })
    }
  }, [])
  const heading = details ? 'Detalle del turno' : 'Revisá los datos de tu reserva'

  let action: ReactNode = <><Check size={18} /> Confirmar turno</>
  if (details) action = 'Cancelar turno simulado'
  return (
    <dialog
      ref={ref}
      className="booking-modal"
      aria-labelledby="booking-title"
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      <div className="booking-modal-body">
        <button className="icon-button modal-close" onClick={onClose} aria-label="Cerrar" autoFocus>
          <X size={20} />
        </button>
        <div className="modal-icon"><CalendarDays size={24} /></div>
        <p className="eyebrow">Agenda de demostración</p>
        <h2 id="booking-title">{heading}</h2>
        <p className="modal-copy">La reserva es ficticia y se guarda solo en este navegador.</p>
        <div className="booking-summary">
          <div className="avatar small" style={{ background: professional.accent }}>{professional.initials}</div>
          <div><strong>{professional.name}</strong><span>{professional.specialty}</span></div>
        </div>
        <dl className="booking-details">
          <div><CalendarDays size={18} /><dt>Fecha</dt><dd>{demoDate(selection.date)}</dd></div>
          <div><Clock3 size={18} /><dt>Horario</dt><dd>{selection.time} hs</dd></div>
          <div><MapPin size={18} /><dt>Sede</dt><dd>{professional.location}</dd></div>
        </dl>
        <div className="modal-actions">
          <button className="button secondary" onClick={onClose}>Volver</button>
          <button className={details ? 'button danger' : 'button primary'} onClick={onAction}>{action}</button>
        </div>
      </div>
    </dialog>
  )
}

import { CalendarDays, Check, Clock3, MapPin, X } from 'lucide-react'
import type { BookingSelection } from '../types'

interface BookingModalProps {
  selection: BookingSelection
  onClose: () => void
  onConfirm: () => void
}

export function BookingModal({
  selection,
  onClose,
  onConfirm,
}: BookingModalProps) {
  const { professional, time } = selection

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="booking-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="icon-button modal-close" onClick={onClose} aria-label="Cerrar">
          <X size={20} />
        </button>
        <div className="modal-icon"><CalendarDays size={24} /></div>
        <p className="eyebrow">Confirmar turno</p>
        <h2 id="booking-title">Revisá los datos de tu reserva</h2>
        <p className="modal-copy">
          Esta acción es una simulación. No se enviará información a ningún centro de salud.
        </p>

        <div className="booking-summary">
          <div className="avatar small" style={{ background: professional.accent }}>
            {professional.initials}
          </div>
          <div>
            <strong>{professional.name}</strong>
            <span>{professional.specialty}</span>
          </div>
        </div>
        <dl className="booking-details">
          <div><CalendarDays size={18} /><dt>Fecha</dt><dd>Jueves 3 de septiembre</dd></div>
          <div><Clock3 size={18} /><dt>Horario</dt><dd>{time} hs</dd></div>
          <div><MapPin size={18} /><dt>Sede</dt><dd>{professional.location}</dd></div>
        </dl>

        <div className="modal-actions">
          <button className="button secondary" onClick={onClose}>Volver</button>
          <button className="button primary" onClick={onConfirm}>
            <Check size={18} /> Confirmar turno
          </button>
        </div>
      </section>
    </div>
  )
}

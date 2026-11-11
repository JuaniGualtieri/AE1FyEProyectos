# Clinical — Portal de pacientes

Prototipo académico de Clinical. La demo incluye disponibilidad por fecha y sede, filtros por especialidad, reservas, cancelaciones y una agenda con recordatorio local. Toda la información es ficticia. La agenda se guarda en el navegador y puede volver a su estado inicial con **Reiniciar demo**. No hay backend ni integración con centros de salud.

## Ejecutar localmente

```bash
npm ci
npm run dev
```

## Recorrido de presentación

1. Buscá Cardiología, en Sede Centro, el 13 de noviembre de 2026.
2. Elegí las 10:15 y confirmá la reserva simulada.
3. Abrí **Mis turnos** para comprobar que la reserva aparece. Recargá y revisá que se conserve.
4. Abrí el detalle y cancelá: el horario vuelve a estar disponible.
5. Usá **Reiniciar demo** para recuperar el estado inicial.

## Verificación

```bash
npm run lint
npm run build
```

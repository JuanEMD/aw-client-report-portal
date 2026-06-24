# TODO — AW Client Report Portal

## Data & Assets

- [ ] **Obtener "Data Point List" del equipo** — El mapeo exacto de campos está en imágenes embebidas en `doc/Report notes.md` que no se incluyeron en el repo. Solicitar los archivos `Pasted image 20260623144733.png`, `Pasted image 20260623150645.png`, `Pasted image 20260623150542.png`, `Pasted image 20260623150520.png`, `Pasted image 20260623155626.png`.
- [ ] **Obtener PDFs sample de SACS y TCC** — Para referencia exacta de layout (mencionados en PRD screenshots 05:18, 13:08, 20:52).

## Funcionalidad

- [ ] **Implementar PDF generation** — Decidir entre Puppeteer (HTML+SVG → PDF) o pdfkit (dibujo programático). La lógica queda en `backend/src/services/pdf.service.js`.
- [ ] **Confirmar Canva Export** — ¿Se implementa en V1 o queda para V2? El stub está en `backend/src/services/canva.service.js`.
- [ ] **Confirmar Dropbox auto-save** — Mencionado pero no comprometido. Stub en `backend/src/services/external-apis.js`.
- [ ] **Definir esquema exacto de `report_data`** — Los field_keys dependen de la Data Point List.

## Autenticación

- [ ] **Configurar JWT_SECRET** — Pendiente de definir.
- [ ] **Crear usuarios iniciales** — Andrew, Rebecca, Maryann (seed data).

## UI / UX

- [ ] **Diseñar layout visual de SACS y TCC** — Coincidir con las plantillas existentes de Canva/PDF.
- [ ] **Implementar report preview** — Vista previa del PDF antes de generar.
- [ ] **Estilos BEM + CSS Modules** — Aplicar nomenclatura en todos los componentes.

## Infraestructura

- [ ] **Configurar Railway deploy** — Variables de entorno: `CANVA_API_KEY`, `JWT_SECRET`, `DATABASE_PATH`.
- [ ] **Mejorar .gitignore** — Agregar `*.db`, `.env`, `dist/`.

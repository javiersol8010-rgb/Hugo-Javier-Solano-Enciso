# Plan de Sincronización Automática con Google Sheets y Google Drive

Este plan detalla la arquitectura y los pasos para automatizar la sincronización entre el prototipo de inducción SENA y la hoja de cálculo en Google Drive, cumpliendo con tus requerimientos: ejecución automática al aprobar la evaluación y guardado en segundo plano con notificación sutil.

---

## 1. Objetivos del Sistema Automático

1. **Cero configuración repetitiva:** Una vez concedidos los permisos de Google Drive y Sheets, la plataforma no solicitará abrir modales ni configurar columnas manualmente.
2. **Disparo automático por evento:** En el momento exacto en que el aprendiz complete la evaluación con 80% o más y se genere el certificado oficial, la aplicación despachará automáticamente el registro en segundo plano.
3. **Persistencia de sesión y hoja de cálculo:** 
   - Detectar la sesión de Google activa de manera transparente.
   - Reutilizar automáticamente la hoja de cálculo existente `"SENA - Registro de Aprendices Inducción (Acuerdo 0009)"` en Google Drive o crearla en el primer uso.
4. **Retroalimentación sutil y no invasiva:**
   - Notificación emergente (Toast) flotante: *"✓ Registro sincronizado automáticamente en Google Drive"*.
   - Botón directo para "Abrir Hoja de Cálculo" disponible tanto en el encabezado como en la vista del Certificado Oficial.

---

## 2. Arquitectura de la Solución

```
   [ Aprendiz aprueba Evaluación con >= 80% ]
                        │
                        ▼
          [ handlePassAssessment ] en App.tsx
                        │
       ┌────────────────┴────────────────┐
       ▼                                 ▼
[ Genera Certificado ]        [ Auto-Sync en Segundo Plano ]
                                         │
                        ┌────────────────┴────────────────┐
                        ▼                                 ▼
              ¿Google Conectado?                 ¿No Conectado aún?
                        │                                 │
                        ├─────────────┐                   ├──────────────────┐
                     ( SÍ )        ( NO )              ( SÍ )             ( NO )
                        │                                 │
                        ▼                                 ▼
         [ Buscar o Crear Hoja ]            [ Banner sutil en Certificado: ]
         [ "SENA - Registro..." ]           [ "Conectar Google Drive para" ]
                        │                   [ "auto-guardar tu registro"   ]
                        ▼                                 │ (Al hacer 1 clic)
         [ Insertar fila de datos ]                       ▼
         [ con Acuerdo 0009 2024 ]          [ Auto-sincroniza de inmediato ]
                        │
                        ▼
      [ Notificación Toast Flotante ]
      [ + Enlace directo en Certificado ]
```

---

## 3. Componentes y Modificaciones

### A. Servicio de Sincronización Automática (`src/services/sheetsSync.ts`)
- Implementar la función `autoSyncApprenticeRecord`:
  - Recibe el perfil del aprendiz, puntaje obtenido, fecha de certificación y código de verificación.
  - Verifica silenciosamente el token en memoria o caché de sesión.
  - Si la hoja ya fue localizada previamente (ID en memoria), añade la fila de inmediato sin búsquedas redundantes en Drive.
  - Si no existe, crea la hoja formateada con encabezados verdes SENA, fija la primera fila e inserta el registro.
  - Retorna la URL pública de la hoja para que esté disponible inmediatamente.

### B. Gestor de Eventos en Evaluación y Certificado (`src/App.tsx` & `src/components/OfficialCertificate.tsx`)
- En `handlePassAssessment`:
  - Activar el disparador de sincronización en background sin bloquear la interfaz ni interrumpir la celebración del aprendiz.
  - Gestionar estado de notificación flotante (`toastSyncNotification`).
  - Mostrar el enlace persistente a la hoja de cálculo directamente en el Certificado Oficial y en la barra superior.

### C. Manejo de Casos de Sesión Pendiente
- Si el usuario aún no ha iniciado sesión con Google al momento de aprobar:
  - En la pantalla del Certificado Oficial se despliega un botón sutil: *"Sincronizar este certificado en Google Drive con 1 clic"*.
  - Al conceder el permiso, se sincroniza de forma inmediata y automática sin requerir pasos adicionales.

---

## 4. Campos Registrados Automáticamente en Google Sheets

Cada fila incorporará de manera automática los siguientes campos:

| Columna | Campo | Ejemplo |
|---|---|---|
| A | Fecha y Hora | `2025-05-18 10:30:15` |
| B | Nombre del Aprendiz | `Carlos Andrés Pérez` |
| C | Tipo de Documento | `Cédula de Ciudadanía` |
| D | Número de Documento | `1020304050` |
| E | Programa de Formación | `Análisis y Desarrollo de Software (ADSO)` |
| F | Ficha de Caracterización | `2879541` |
| G | Centro de Formación | `Centro de Biotecnología Agropecuaria` |
| H | Regional SENA | `Regional Cundinamarca` |
| I | Puntaje Evaluación | `95%` |
| J | Estado | `Aprobado - Inducción Completada` |
| K | Código Certificado | `SENA-IND-2025-ABCD12` |
| L | Reglamento Aplicado | `Acuerdo No. 0009 de 2024` |

---

## 5. Plan de Verificación

1. **Compilación y Linting:**
   - Ejecutar `compile_applet` y `lint_applet` para garantizar cero errores de TypeScript y dependencias.
2. **Prueba del Flujo Automático:**
   - Simular la aprobación de la evaluación con perfil completo.
   - Confirmar el despacho silencioso del registro a Google Sheets.
   - Validar la visualización del Toast de confirmación y el enlace directo en el Certificado.

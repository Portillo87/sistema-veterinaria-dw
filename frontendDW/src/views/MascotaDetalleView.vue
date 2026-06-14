<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Modal } from 'bootstrap'
import { perroService } from '@/services/perroService.js'
import { historialService } from '@/services/historialService.js'

const route = useRoute()
const router = useRouter()

// ── Estado reactivo de la vista ───────────────────────────────────────────────
const mascota = ref(null)
const historial = ref([])
const cargando = ref(true)
const guardando = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

// Controla si el modal del historial opera en modo edición o creación
const modoEdicion = ref(false)
const historialIdEditar = ref(null)
const registroAEliminar = ref(null)

// Objeto reactivo que almacena los campos del formulario de consulta médica
const form = ref({
  fechaConsulta: '',
  motivoConsulta: '',
  diagnostico: '',
  tratamiento: '',
  veterinarioResponsable: ''
})

// ── Helpers de Modal Bootstrap 5 ─────────────────────────────────────────────
// Modal.getOrCreateInstance() garantiza que siempre se trabaja con el elemento
// DOM correcto, incluso después de navegar entre rutas y remontar el componente.

function abrirModalHistorial () {
  const el = document.getElementById('modalHistorial')
  Modal.getOrCreateInstance(el).show()
}

function cerrarModalHistorial () {
  const el = document.getElementById('modalHistorial')
  Modal.getInstance(el)?.hide()
}

function abrirModalElim () {
  const el = document.getElementById('modalEliminarHistorial')
  Modal.getOrCreateInstance(el).show()
}

function cerrarModalElim () {
  const el = document.getElementById('modalEliminarHistorial')
  Modal.getInstance(el)?.hide()
}

// ── Utilidades de formato de fecha ───────────────────────────────────────────
// Convierte una fecha ISO al formato requerido por input[type="date"] (YYYY-MM-DD)
function toDateInput (isoDate) {
  if (!isoDate) return ''
  return new Date(isoDate).toISOString().split('T')[0]
}

// Formatea una fecha ISO para mostrarla en español de El Salvador
function formatFecha (isoDate) {
  if (!isoDate) return '—'
  return new Date(isoDate).toLocaleDateString('es-SV', { dateStyle: 'long' })
}

// ── Carga paralela de datos de la mascota y su historial clínico ──────────────
// Se obtienen ambos recursos simultáneamente con Promise.all() para optimizar
// el tiempo de carga. El ID de la mascota se toma del parámetro de la ruta.
async function cargarDatos () {
  cargando.value = true
  try {
    const [resMascota, resHistorial] = await Promise.all([
      perroService.getById(route.params.id),
      historialService.getByMascota(route.params.id)
    ])
    mascota.value = resMascota.data.datos
    historial.value = resHistorial.data.datos || []
  } catch {
    errorMsg.value = 'Error al cargar los datos de la mascota'
  } finally {
    cargando.value = false
  }
}

onMounted(cargarDatos)

// ── Abrir formulario para registrar nueva consulta médica ─────────────────────
function nuevaConsulta () {
  modoEdicion.value = false
  historialIdEditar.value = null
  // Precarga la fecha de hoy como valor por defecto
  form.value = {
    fechaConsulta: toDateInput(new Date()),
    motivoConsulta: '',
    diagnostico: '',
    tratamiento: '',
    veterinarioResponsable: ''
  }
  errorMsg.value = ''
  abrirModalHistorial()
}

// ── Abrir formulario para editar una consulta existente ───────────────────────
function editarConsulta (registro) {
  modoEdicion.value = true
  historialIdEditar.value = registro._id
  // Precarga los datos actuales del registro en el formulario
  form.value = {
    fechaConsulta: toDateInput(registro.fechaConsulta),
    motivoConsulta: registro.motivoConsulta,
    diagnostico: registro.diagnostico,
    tratamiento: registro.tratamiento,
    veterinarioResponsable: registro.veterinarioResponsable
  }
  errorMsg.value = ''
  abrirModalHistorial()
}

// ── Guardar consulta médica (crear o actualizar) ──────────────────────────────
async function guardarConsulta () {
  errorMsg.value = ''
  guardando.value = true
  try {
    // Incluye el ID de la mascota para mantener la relación en la base de datos
    const payload = { ...form.value, mascota: route.params.id }
    if (modoEdicion.value) {
      await historialService.update(historialIdEditar.value, payload)
      successMsg.value = 'Consulta actualizada correctamente ✓'
    } else {
      await historialService.create(payload)
      successMsg.value = 'Consulta registrada correctamente ✓'
    }
    cerrarModalHistorial()
    // Recarga solo el historial (la info de la mascota no cambió)
    const res = await historialService.getByMascota(route.params.id)
    historial.value = res.data.datos || []
    setTimeout(() => { successMsg.value = '' }, 3500)
  } catch (err) {
    const data = err.response?.data
    errorMsg.value = data?.mensaje || 'Error al guardar la consulta'
    if (data?.errores) errorMsg.value += ': ' + data.errores.join(', ')
  } finally {
    guardando.value = false
  }
}

// ── Confirmar y ejecutar la eliminación de una consulta ───────────────────────
function confirmarEliminar (registro) {
  registroAEliminar.value = registro
  abrirModalElim()
}

async function eliminarConsulta () {
  guardando.value = true
  try {
    await historialService.delete(registroAEliminar.value._id)
    cerrarModalElim()
    // Recarga el historial para reflejar la eliminación
    const res = await historialService.getByMascota(route.params.id)
    historial.value = res.data.datos || []
    successMsg.value = 'Consulta eliminada correctamente ✓'
    setTimeout(() => { successMsg.value = '' }, 3500)
  } catch {
    errorMsg.value = 'Error al eliminar la consulta'
  } finally {
    guardando.value = false
  }
}
</script>

<template>
  <div>
    <!-- Breadcrumb de navegación jerárquica -->
    <nav aria-label="breadcrumb" class="mb-3">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/" class="text-decoration-none">Dashboard</router-link>
        </li>
        <li class="breadcrumb-item">
          <router-link to="/mascotas" class="text-decoration-none">Mascotas</router-link>
        </li>
        <li class="breadcrumb-item active">
          {{ mascota?.nombre || 'Detalle' }}
        </li>
      </ol>
    </nav>

    <!-- Estado: cargando datos -->
    <div v-if="cargando" class="text-center py-5 text-muted">
      <div class="spinner-border text-primary mb-3"></div>
      <div>Cargando información de la mascota…</div>
    </div>

    <!-- Estado: mascota no encontrada (error 404 del backend) -->
    <div v-else-if="!mascota" class="text-center py-5">
      <i class="bi bi-exclamation-triangle-fill text-danger display-4 mb-3 d-block"></i>
      <p class="text-muted">No se encontró la mascota solicitada.</p>
      <button class="btn btn-outline-primary" @click="router.push('/mascotas')">
        <i class="bi bi-arrow-left me-1"></i>Volver a Mascotas
      </button>
    </div>

    <!-- Contenido principal de la vista -->
    <template v-else>
      <!-- Encabezado con nombre y botón de regreso -->
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div class="d-flex align-items-center gap-3">
          <button class="btn btn-outline-secondary btn-sm"
                  title="Volver a la lista de mascotas"
                  @click="router.push('/mascotas')">
            <i class="bi bi-arrow-left"></i>
          </button>
          <div>
            <h1 class="page-title mb-0">
              <i class="bi bi-heart-fill text-danger me-2"></i>{{ mascota.nombre }}
            </h1>
            <p class="text-muted mb-0 small">{{ mascota.raza }} · {{ mascota.edad }} años</p>
          </div>
        </div>
      </div>

      <!-- Alerta de operación exitosa -->
      <div v-if="successMsg"
           class="alert alert-success alert-dismissible d-flex align-items-center gap-2 mb-3">
        <i class="bi bi-check-circle-fill"></i>{{ successMsg }}
        <button type="button" class="btn-close ms-auto" @click="successMsg = ''"></button>
      </div>

      <!-- Fila con tarjetas de información: mascota y propietario -->
      <div class="row g-4 mb-4">

        <!-- ── TARJETA: INFORMACIÓN DE LA MASCOTA ── -->
        <div class="col-12 col-lg-6">
          <div class="card shadow-sm h-100">
            <div class="card-header bg-white py-3">
              <h5 class="mb-0 fw-bold">
                <i class="bi bi-heart-fill text-danger me-2"></i>Información de la Mascota
              </h5>
            </div>
            <div class="card-body">
              <!-- Ícono representativo -->
              <div class="d-flex align-items-center justify-content-center mb-4">
                <div class="rounded-circle d-flex align-items-center justify-content-center"
                     style="width:90px;height:90px;
                            background:linear-gradient(135deg,#fce4ec,#f48fb1);">
                  <i class="bi bi-heart-fill text-danger" style="font-size:2.5rem;"></i>
                </div>
              </div>

              <!-- Datos de la mascota en formato lista de definición -->
              <dl class="row mb-0">
                <dt class="col-5 text-muted small fw-semibold">NOMBRE</dt>
                <dd class="col-7 fw-bold">{{ mascota.nombre }}</dd>

                <dt class="col-5 text-muted small fw-semibold">RAZA</dt>
                <dd class="col-7">{{ mascota.raza }}</dd>

                <dt class="col-5 text-muted small fw-semibold">EDAD</dt>
                <dd class="col-7">{{ mascota.edad }} año{{ mascota.edad !== 1 ? 's' : '' }}</dd>

                <dt class="col-5 text-muted small fw-semibold">PESO</dt>
                <dd class="col-7">{{ mascota.peso }} kg</dd>

                <dt class="col-5 text-muted small fw-semibold">SEXO</dt>
                <dd class="col-7">
                  <span :class="mascota.sexo === 'Macho' ? 'badge-macho' : 'badge-hembra'">
                    {{ mascota.sexo }}
                  </span>
                </dd>

                <dt class="col-5 text-muted small fw-semibold">REGISTRADA</dt>
                <dd class="col-7 small text-muted">{{ formatFecha(mascota.createdAt) }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <!-- ── TARJETA: INFORMACIÓN DEL PROPIETARIO ── -->
        <div class="col-12 col-lg-6">
          <div class="card shadow-sm h-100">
            <div class="card-header bg-white py-3">
              <h5 class="mb-0 fw-bold">
                <i class="bi bi-person-fill text-success me-2"></i>Información del Propietario
              </h5>
            </div>
            <div class="card-body">
              <!-- Propietario asignado: muestra sus datos obtenidos via populate() -->
              <div v-if="mascota.propietario">
                <div class="d-flex align-items-center justify-content-center mb-4">
                  <div class="rounded-circle d-flex align-items-center justify-content-center"
                       style="width:90px;height:90px;
                              background:linear-gradient(135deg,#e8f5e9,#81c784);">
                    <i class="bi bi-person-fill text-success" style="font-size:2.5rem;"></i>
                  </div>
                </div>

                <!-- Datos del propietario en formato lista de definición -->
                <dl class="row mb-0">
                  <dt class="col-5 text-muted small fw-semibold">NOMBRE</dt>
                  <dd class="col-7 fw-bold">{{ mascota.propietario.nombreCompleto }}</dd>

                  <dt class="col-5 text-muted small fw-semibold">DUI</dt>
                  <dd class="col-7"><code>{{ mascota.propietario.dui }}</code></dd>

                  <dt class="col-5 text-muted small fw-semibold">TELÉFONO</dt>
                  <dd class="col-7">
                    <a :href="`tel:${mascota.propietario.telefono}`"
                       class="text-decoration-none">
                      <i class="bi bi-telephone-fill text-primary me-1"></i>
                      {{ mascota.propietario.telefono }}
                    </a>
                  </dd>

                  <dt class="col-5 text-muted small fw-semibold">CORREO</dt>
                  <dd class="col-7">
                    <a :href="`mailto:${mascota.propietario.correo}`"
                       class="text-decoration-none small">
                      {{ mascota.propietario.correo }}
                    </a>
                  </dd>

                  <dt class="col-5 text-muted small fw-semibold">DIRECCIÓN</dt>
                  <dd class="col-7 small text-muted">{{ mascota.propietario.direccion }}</dd>
                </dl>
              </div>

              <!-- Sin propietario asignado -->
              <div v-else class="text-center py-4 text-muted">
                <i class="bi bi-person-x-fill display-5 mb-2 d-block opacity-25"></i>
                Sin propietario asignado
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── TABLA DE HISTORIAL CLÍNICO ── -->
      <div class="card shadow-sm">
        <div class="card-header bg-white py-3 d-flex align-items-center justify-content-between">
          <h5 class="mb-0 fw-bold">
            <i class="bi bi-clipboard2-pulse-fill text-warning me-2"></i>Historial Clínico
            <span class="badge bg-warning text-dark ms-2">{{ historial.length }}</span>
          </h5>
          <button class="btn btn-warning text-dark d-flex align-items-center gap-2"
                  @click="nuevaConsulta">
            <i class="bi bi-plus-circle-fill"></i>
            <span class="d-none d-sm-inline">Nueva Consulta</span>
          </button>
        </div>
        <div class="card-body p-0">

          <!-- Sin consultas registradas para esta mascota -->
          <div v-if="historial.length === 0" class="text-center py-5 text-muted">
            <i class="bi bi-clipboard2-pulse display-5 d-block mb-3 opacity-25"></i>
            <p>No hay consultas médicas registradas para esta mascota.</p>
            <button class="btn btn-warning text-dark" @click="nuevaConsulta">
              <i class="bi bi-plus-circle-fill me-1"></i>Registrar primera consulta
            </button>
          </div>

          <!-- Tabla de consultas médicas ordenadas por fecha (más reciente primero) -->
          <div v-else class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th class="px-4">Fecha</th>
                  <th>Motivo</th>
                  <th>Diagnóstico</th>
                  <th>Tratamiento</th>
                  <th>Veterinario</th>
                  <th class="text-center px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in historial" :key="r._id">
                  <td class="px-4 small fw-semibold text-nowrap">
                    <i class="bi bi-calendar2-check text-warning me-1"></i>
                    {{ formatFecha(r.fechaConsulta) }}
                  </td>
                  <td class="small">{{ r.motivoConsulta }}</td>
                  <td class="small">{{ r.diagnostico }}</td>
                  <td class="small">{{ r.tratamiento }}</td>
                  <td class="small">
                    <i class="bi bi-person-badge text-secondary me-1"></i>
                    {{ r.veterinarioResponsable }}
                  </td>
                  <td class="text-center px-4">
                    <div class="d-flex gap-1 justify-content-center">
                      <button class="btn btn-outline-primary btn-sm"
                              title="Editar consulta"
                              @click="editarConsulta(r)">
                        <i class="bi bi-pencil-fill"></i>
                      </button>
                      <button class="btn btn-outline-danger btn-sm"
                              title="Eliminar consulta"
                              @click="confirmarEliminar(r)">
                        <i class="bi bi-trash-fill"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>

    <!-- ===== MODAL: FORMULARIO NUEVA / EDITAR CONSULTA MÉDICA ===== -->
    <div class="modal fade" id="modalHistorial" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-clipboard2-plus-fill me-2 text-warning"></i>
              {{ modoEdicion ? 'Editar Consulta Médica' : 'Nueva Consulta Médica' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <!-- Mensaje de error del servidor -->
            <div v-if="errorMsg"
                 class="alert alert-danger d-flex align-items-center gap-2 mb-3">
              <i class="bi bi-exclamation-triangle-fill"></i>{{ errorMsg }}
            </div>

            <form @submit.prevent="guardarConsulta" id="formHistorial">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold">
                    Fecha de Consulta <span class="text-danger">*</span>
                  </label>
                  <input v-model="form.fechaConsulta" type="date"
                         class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">
                    Veterinario Responsable <span class="text-danger">*</span>
                  </label>
                  <input v-model.trim="form.veterinarioResponsable" type="text"
                         class="form-control" placeholder="Dr. Nombre Apellido"
                         required />
                </div>
                <div class="col-12">
                  <label class="form-label fw-semibold">
                    Motivo de Consulta <span class="text-danger">*</span>
                  </label>
                  <input v-model.trim="form.motivoConsulta" type="text"
                         class="form-control"
                         placeholder="Ej: Revisión general, vacunación, etc."
                         required />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">
                    Diagnóstico <span class="text-danger">*</span>
                  </label>
                  <textarea v-model.trim="form.diagnostico" class="form-control"
                            rows="3" placeholder="Describe el diagnóstico…"
                            required></textarea>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">
                    Tratamiento <span class="text-danger">*</span>
                  </label>
                  <textarea v-model.trim="form.tratamiento" class="form-control"
                            rows="3" placeholder="Medicamentos, dosis, indicaciones…"
                            required></textarea>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-circle me-1"></i>Cancelar
            </button>
            <button type="submit" form="formHistorial"
                    class="btn btn-warning text-dark" :disabled="guardando">
              <span v-if="guardando" class="spinner-border spinner-border-sm me-1"></span>
              <i v-else class="bi bi-check-circle me-1"></i>
              {{ modoEdicion ? 'Actualizar' : 'Registrar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== MODAL: CONFIRMAR ELIMINACIÓN DE CONSULTA ===== -->
    <div class="modal fade" id="modalEliminarHistorial" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>Eliminar Consulta
            </h5>
            <button type="button" class="btn-close btn-close-white"
                    data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-center py-4">
            <i class="bi bi-clipboard2-x-fill text-danger display-4 mb-3 d-block"></i>
            <p class="mb-1">¿Eliminar la consulta del:</p>
            <p class="fw-bold fs-6 text-danger">
              {{ formatFecha(registroAEliminar?.fechaConsulta) }}
            </p>
            <p class="text-muted small">Motivo: {{ registroAEliminar?.motivoConsulta }}</p>
            <p class="text-muted small">Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-circle me-1"></i>Cancelar
            </button>
            <button type="button" class="btn btn-danger"
                    @click="eliminarConsulta" :disabled="guardando">
              <span v-if="guardando" class="spinner-border spinner-border-sm me-1"></span>
              <i v-else class="bi bi-trash-fill me-1"></i>Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

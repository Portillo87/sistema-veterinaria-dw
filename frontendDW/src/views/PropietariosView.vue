<script setup>
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import { propietarioService } from '@/services/propietarioService.js'

// ── Estado reactivo de la vista ───────────────────────────────────────────────
const propietarios = ref([])
const cargando = ref(true)
const guardando = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

// Controla si el modal muestra el formulario en modo edición o creación
const modoEdicion = ref(false)
const propietarioIdEditar = ref(null)
const propietarioAEliminar = ref(null)

// Objeto reactivo que almacena los datos del formulario
const form = ref({
  nombreCompleto: '',
  dui: '',
  telefono: '',
  correo: '',
  direccion: ''
})

// ── Helpers de Modal Bootstrap 5 ─────────────────────────────────────────────
// Se usa Modal.getOrCreateInstance() en lugar de almacenar la instancia en una
// variable de módulo. Esto evita referencias obsoletas al elemento DOM cuando
// Vue Router desmonta y vuelve a montar el componente entre navegaciones.

function abrirModalForm () {
  const el = document.getElementById('modalPropietario')
  Modal.getOrCreateInstance(el).show()
}

function cerrarModalForm () {
  const el = document.getElementById('modalPropietario')
  Modal.getInstance(el)?.hide()
}

function abrirModalEliminar () {
  const el = document.getElementById('modalEliminar')
  Modal.getOrCreateInstance(el).show()
}

function cerrarModalEliminar () {
  const el = document.getElementById('modalEliminar')
  Modal.getInstance(el)?.hide()
}

// ── Carga inicial de datos ────────────────────────────────────────────────────
// Al montar el componente, obtiene la lista de propietarios desde la API
async function cargarPropietarios () {
  cargando.value = true
  try {
    const res = await propietarioService.getAll()
    propietarios.value = res.data.datos || []
  } catch {
    errorMsg.value = 'Error al cargar los propietarios. Verifique la conexión con el servidor.'
  } finally {
    cargando.value = false
  }
}

onMounted(cargarPropietarios)

// ── Abrir formulario para registrar nuevo propietario ─────────────────────────
function nuevoP () {
  modoEdicion.value = false
  propietarioIdEditar.value = null
  form.value = { nombreCompleto: '', dui: '', telefono: '', correo: '', direccion: '' }
  errorMsg.value = ''
  abrirModalForm()
}

// ── Abrir formulario para editar un propietario existente ─────────────────────
function editarP (p) {
  modoEdicion.value = true
  propietarioIdEditar.value = p._id
  // Precarga los datos actuales del propietario en el formulario
  form.value = {
    nombreCompleto: p.nombreCompleto,
    dui: p.dui,
    telefono: p.telefono,
    correo: p.correo,
    direccion: p.direccion
  }
  errorMsg.value = ''
  abrirModalForm()
}

// ── Guardar propietario (crear o actualizar según el modo activo) ─────────────
async function guardarP () {
  errorMsg.value = ''
  guardando.value = true
  try {
    if (modoEdicion.value) {
      await propietarioService.update(propietarioIdEditar.value, form.value)
      successMsg.value = 'Propietario actualizado correctamente ✓'
    } else {
      await propietarioService.create(form.value)
      successMsg.value = 'Propietario registrado correctamente ✓'
    }
    cerrarModalForm()
    await cargarPropietarios()
    // Oculta el mensaje de éxito después de 3.5 segundos
    setTimeout(() => { successMsg.value = '' }, 3500)
  } catch (err) {
    const data = err.response?.data
    errorMsg.value = data?.mensaje || 'Error al guardar el propietario'
  } finally {
    guardando.value = false
  }
}

// ── Confirmar y ejecutar la eliminación de un propietario ─────────────────────
function confirmarEliminar (p) {
  propietarioAEliminar.value = p
  abrirModalEliminar()
}

async function eliminarP () {
  guardando.value = true
  try {
    await propietarioService.delete(propietarioAEliminar.value._id)
    cerrarModalEliminar()
    await cargarPropietarios()
    successMsg.value = 'Propietario eliminado correctamente ✓'
    setTimeout(() => { successMsg.value = '' }, 3500)
  } catch {
    errorMsg.value = 'Error al eliminar el propietario'
  } finally {
    guardando.value = false
  }
}
</script>

<template>
  <div>
    <!-- Encabezado de la vista -->
    <div class="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h1 class="page-title mb-0">
          <i class="bi bi-people-fill text-success me-2"></i>Propietarios
        </h1>
        <p class="text-muted mb-0 small">Gestión completa de propietarios de mascotas</p>
      </div>
      <button class="btn btn-success d-flex align-items-center gap-2" @click="nuevoP">
        <i class="bi bi-person-plus-fill"></i>
        <span class="d-none d-sm-inline">Nuevo Propietario</span>
      </button>
    </div>

    <!-- Alerta de operación exitosa -->
    <div v-if="successMsg"
         class="alert alert-success alert-dismissible d-flex align-items-center gap-2 mb-3">
      <i class="bi bi-check-circle-fill"></i>
      {{ successMsg }}
      <button type="button" class="btn-close ms-auto" @click="successMsg = ''"></button>
    </div>

    <!-- Tabla de propietarios registrados -->
    <div class="card shadow-sm">
      <div class="card-header bg-white py-3">
        <h5 class="mb-0 fw-bold">
          <i class="bi bi-list-ul me-2 text-success"></i>
          Lista de Propietarios
          <span class="badge bg-success ms-2">{{ propietarios.length }}</span>
        </h5>
      </div>
      <div class="card-body p-0">

        <!-- Estado: cargando datos desde el servidor -->
        <div v-if="cargando" class="text-center py-5 text-muted">
          <div class="spinner-border text-success mb-2"></div>
          <div>Cargando propietarios…</div>
        </div>

        <!-- Estado: no hay propietarios registrados -->
        <div v-else-if="propietarios.length === 0" class="text-center py-5 text-muted">
          <i class="bi bi-people display-5 d-block mb-3 opacity-25"></i>
          <p>No hay propietarios registrados.</p>
          <button class="btn btn-success" @click="nuevoP">
            <i class="bi bi-person-plus-fill me-1"></i>Registrar primer propietario
          </button>
        </div>

        <!-- Tabla de datos -->
        <div v-else class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th class="px-4">#</th>
                <th>Nombre Completo</th>
                <th>DUI</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Dirección</th>
                <th class="text-center px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, i) in propietarios" :key="p._id">
                <td class="px-4 text-muted small">{{ i + 1 }}</td>
                <td class="fw-semibold">
                  <i class="bi bi-person-circle text-success me-1"></i>
                  {{ p.nombreCompleto }}
                </td>
                <td><code class="text-muted">{{ p.dui }}</code></td>
                <td>
                  <i class="bi bi-telephone-fill text-primary me-1" style="font-size:.8rem;"></i>
                  {{ p.telefono }}
                </td>
                <td>
                  <a :href="`mailto:${p.correo}`" class="text-decoration-none small">
                    {{ p.correo }}
                  </a>
                </td>
                <td class="small text-muted">{{ p.direccion }}</td>
                <td class="text-center px-4">
                  <div class="d-flex gap-2 justify-content-center">
                    <button class="btn btn-outline-primary btn-sm"
                            title="Editar propietario"
                            @click="editarP(p)">
                      <i class="bi bi-pencil-fill"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm"
                            title="Eliminar propietario"
                            @click="confirmarEliminar(p)">
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

    <!-- ===== MODAL: FORMULARIO CREAR / EDITAR PROPIETARIO ===== -->
    <div class="modal fade" id="modalPropietario" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-person-fill me-2 text-success"></i>
              {{ modoEdicion ? 'Editar Propietario' : 'Nuevo Propietario' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">

            <!-- Mensaje de error del servidor -->
            <div v-if="errorMsg"
                 class="alert alert-danger d-flex align-items-center gap-2 mb-3">
              <i class="bi bi-exclamation-triangle-fill"></i>{{ errorMsg }}
            </div>

            <form @submit.prevent="guardarP" id="formPropietario">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label fw-semibold">
                    Nombre Completo <span class="text-danger">*</span>
                  </label>
                  <input v-model.trim="form.nombreCompleto" type="text"
                         class="form-control" placeholder="Ej: Juan Carlos Pérez López"
                         required maxlength="100" />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">
                    DUI <span class="text-danger">*</span>
                  </label>
                  <input v-model.trim="form.dui" type="text" class="form-control"
                         placeholder="00000000-0" required
                         pattern="\d{8}-\d" title="Formato: 00000000-0" />
                  <div class="form-text">Formato: 8 dígitos, guión, 1 dígito</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">
                    Teléfono <span class="text-danger">*</span>
                  </label>
                  <input v-model.trim="form.telefono" type="tel" class="form-control"
                         placeholder="7777-7777" required />
                </div>
                <div class="col-12">
                  <label class="form-label fw-semibold">
                    Correo Electrónico <span class="text-danger">*</span>
                  </label>
                  <input v-model.trim="form.correo" type="email" class="form-control"
                         placeholder="correo@ejemplo.com" required />
                </div>
                <div class="col-12">
                  <label class="form-label fw-semibold">
                    Dirección <span class="text-danger">*</span>
                  </label>
                  <textarea v-model.trim="form.direccion" class="form-control"
                            rows="2" placeholder="Colonia, Calle, Número…"
                            required></textarea>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-circle me-1"></i>Cancelar
            </button>
            <button type="submit" form="formPropietario"
                    class="btn btn-success" :disabled="guardando">
              <span v-if="guardando" class="spinner-border spinner-border-sm me-1"></span>
              <i v-else class="bi bi-check-circle me-1"></i>
              {{ modoEdicion ? 'Actualizar' : 'Registrar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== MODAL: CONFIRMAR ELIMINACIÓN ===== -->
    <div class="modal fade" id="modalEliminar" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>Confirmar Eliminación
            </h5>
            <button type="button" class="btn-close btn-close-white"
                    data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-center py-4">
            <i class="bi bi-person-x-fill text-danger display-4 mb-3 d-block"></i>
            <p class="mb-1">¿Estás seguro de que deseas eliminar a:</p>
            <p class="fw-bold fs-5 text-danger">{{ propietarioAEliminar?.nombreCompleto }}</p>
            <p class="text-muted small">Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-circle me-1"></i>Cancelar
            </button>
            <button type="button" class="btn btn-danger"
                    @click="eliminarP" :disabled="guardando">
              <span v-if="guardando" class="spinner-border spinner-border-sm me-1"></span>
              <i v-else class="bi bi-trash-fill me-1"></i>Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

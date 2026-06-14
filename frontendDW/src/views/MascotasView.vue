<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Modal } from 'bootstrap'
import { perroService } from '@/services/perroService.js'
import { propietarioService } from '@/services/propietarioService.js'

const router = useRouter()

// ── Estado reactivo de la vista ───────────────────────────────────────────────
const mascotas = ref([])
const propietarios = ref([])
const cargando = ref(true)
const guardando = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

// Controla si el modal opera en modo edición o creación
const modoEdicion = ref(false)
const mascotaIdEditar = ref(null)
const mascotaAEliminar = ref(null)

// Objeto reactivo que almacena los datos del formulario de mascota
const form = ref({
  nombre: '',
  raza: '',
  edad: '',
  peso: '',
  sexo: '',
  propietario: ''
})

// ── Helpers de Modal Bootstrap 5 ─────────────────────────────────────────────
// Modal.getOrCreateInstance() obtiene la instancia existente o crea una nueva.
// Evita referencias obsoletas al DOM cuando el componente es desmontado y remontado.

function abrirModalForm () {
  const el = document.getElementById('modalMascota')
  Modal.getOrCreateInstance(el).show()
}

function cerrarModalForm () {
  const el = document.getElementById('modalMascota')
  Modal.getInstance(el)?.hide()
}

function abrirModalElim () {
  const el = document.getElementById('modalEliminarMascota')
  Modal.getOrCreateInstance(el).show()
}

function cerrarModalElim () {
  const el = document.getElementById('modalEliminarMascota')
  Modal.getInstance(el)?.hide()
}

// ── Carga paralela de mascotas y propietarios ─────────────────────────────────
// Se cargan ambos recursos en paralelo con Promise.all() para optimizar el tiempo
// de carga. Los propietarios son necesarios para el select dinámico del formulario.
async function cargarDatos () {
  cargando.value = true
  try {
    const [resMascotas, resPropietarios] = await Promise.all([
      perroService.getAll(),
      propietarioService.getAll()
    ])
    mascotas.value = resMascotas.data.datos || []
    propietarios.value = resPropietarios.data.datos || []
  } catch {
    errorMsg.value = 'Error al cargar los datos. Verifique la conexión con el servidor.'
  } finally {
    cargando.value = false
  }
}

onMounted(cargarDatos)

// ── Abrir formulario para registrar nueva mascota ─────────────────────────────
function nuevaM () {
  modoEdicion.value = false
  mascotaIdEditar.value = null
  form.value = { nombre: '', raza: '', edad: '', peso: '', sexo: '', propietario: '' }
  errorMsg.value = ''
  abrirModalForm()
}

// ── Abrir formulario para editar una mascota existente ────────────────────────
function editarM (m) {
  modoEdicion.value = true
  mascotaIdEditar.value = m._id
  // Extrae el ID del propietario, ya sea que venga como objeto populado o como string
  form.value = {
    nombre: m.nombre,
    raza: m.raza,
    edad: m.edad,
    peso: m.peso,
    sexo: m.sexo,
    propietario: m.propietario?._id || m.propietario || ''
  }
  errorMsg.value = ''
  abrirModalForm()
}

// ── Guardar mascota (crear o actualizar según el modo activo) ─────────────────
async function guardarM () {
  errorMsg.value = ''
  guardando.value = true
  try {
    // Convierte edad y peso a número antes de enviar al backend
    const payload = {
      ...form.value,
      edad: Number(form.value.edad),
      peso: Number(form.value.peso)
    }
    if (modoEdicion.value) {
      await perroService.update(mascotaIdEditar.value, payload)
      successMsg.value = 'Mascota actualizada correctamente ✓'
    } else {
      await perroService.create(payload)
      successMsg.value = 'Mascota registrada correctamente ✓'
    }
    cerrarModalForm()
    await cargarDatos()
    setTimeout(() => { successMsg.value = '' }, 3500)
  } catch (err) {
    const data = err.response?.data
    errorMsg.value = data?.mensaje || 'Error al guardar la mascota'
    if (data?.errores) errorMsg.value += ': ' + data.errores.join(', ')
  } finally {
    guardando.value = false
  }
}

// ── Confirmar y ejecutar la eliminación de una mascota ────────────────────────
function confirmarEliminar (m) {
  mascotaAEliminar.value = m
  abrirModalElim()
}

async function eliminarM () {
  guardando.value = true
  try {
    await perroService.delete(mascotaAEliminar.value._id)
    cerrarModalElim()
    await cargarDatos()
    successMsg.value = 'Mascota eliminada correctamente ✓'
    setTimeout(() => { successMsg.value = '' }, 3500)
  } catch {
    errorMsg.value = 'Error al eliminar la mascota'
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
          <i class="bi bi-heart-fill text-danger me-2"></i>Mascotas
        </h1>
        <p class="text-muted mb-0 small">Registro y gestión de mascotas</p>
      </div>
      <button class="btn btn-primary d-flex align-items-center gap-2" @click="nuevaM">
        <i class="bi bi-plus-circle-fill"></i>
        <span class="d-none d-sm-inline">Nueva Mascota</span>
      </button>
    </div>

    <!-- Alerta de operación exitosa -->
    <div v-if="successMsg"
         class="alert alert-success alert-dismissible d-flex align-items-center gap-2 mb-3">
      <i class="bi bi-check-circle-fill"></i>{{ successMsg }}
      <button type="button" class="btn-close ms-auto" @click="successMsg = ''"></button>
    </div>

    <!-- Aviso cuando no hay propietarios: el select del formulario quedaría vacío -->
    <div v-if="!cargando && propietarios.length === 0"
         class="alert alert-warning d-flex align-items-center gap-2 mb-3">
      <i class="bi bi-exclamation-triangle-fill"></i>
      No hay propietarios registrados. Antes de agregar mascotas,
      <router-link to="/propietarios" class="alert-link ms-1">
        registra un propietario
      </router-link>.
    </div>

    <!-- Tabla de mascotas registradas -->
    <div class="card shadow-sm">
      <div class="card-header bg-white py-3">
        <h5 class="mb-0 fw-bold">
          <i class="bi bi-list-ul me-2 text-primary"></i>
          Lista de Mascotas
          <span class="badge bg-primary ms-2">{{ mascotas.length }}</span>
        </h5>
      </div>
      <div class="card-body p-0">

        <!-- Estado: cargando datos -->
        <div v-if="cargando" class="text-center py-5 text-muted">
          <div class="spinner-border text-primary mb-2"></div>
          <div>Cargando mascotas…</div>
        </div>

        <!-- Estado: sin mascotas registradas -->
        <div v-else-if="mascotas.length === 0" class="text-center py-5 text-muted">
          <i class="bi bi-heart display-5 d-block mb-3 opacity-25"></i>
          <p>No hay mascotas registradas.</p>
          <button class="btn btn-primary" @click="nuevaM"
                  :disabled="propietarios.length === 0">
            <i class="bi bi-plus-circle-fill me-1"></i>Registrar primera mascota
          </button>
        </div>

        <!-- Tabla de datos -->
        <div v-else class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th class="px-4">#</th>
                <th>Nombre</th>
                <th>Raza</th>
                <th>Edad</th>
                <th>Peso</th>
                <th>Sexo</th>
                <th>Propietario</th>
                <th class="text-center px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(m, i) in mascotas" :key="m._id">
                <td class="px-4 text-muted small">{{ i + 1 }}</td>
                <td class="fw-semibold">
                  <i class="bi bi-heart text-danger me-1"></i>{{ m.nombre }}
                </td>
                <td>{{ m.raza }}</td>
                <td>{{ m.edad }} año{{ m.edad !== 1 ? 's' : '' }}</td>
                <td>{{ m.peso }} kg</td>
                <td>
                  <span :class="m.sexo === 'Macho' ? 'badge-macho' : 'badge-hembra'">
                    {{ m.sexo }}
                  </span>
                </td>
                <td>
                  <div v-if="m.propietario" class="d-flex align-items-center gap-1">
                    <i class="bi bi-person-circle text-success" style="font-size:.9rem;"></i>
                    <span class="small">{{ m.propietario.nombreCompleto }}</span>
                  </div>
                  <span v-else class="text-muted small">Sin propietario</span>
                </td>
                <td class="text-center px-4">
                  <div class="d-flex gap-1 justify-content-center">
                    <button class="btn btn-outline-info btn-sm"
                            title="Ver detalle e historial clínico"
                            @click="router.push(`/mascotas/${m._id}`)">
                      <i class="bi bi-eye-fill"></i>
                    </button>
                    <button class="btn btn-outline-primary btn-sm"
                            title="Editar mascota"
                            @click="editarM(m)">
                      <i class="bi bi-pencil-fill"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm"
                            title="Eliminar mascota"
                            @click="confirmarEliminar(m)">
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

    <!-- ===== MODAL: FORMULARIO CREAR / EDITAR MASCOTA ===== -->
    <div class="modal fade" id="modalMascota" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-heart-fill me-2 text-danger"></i>
              {{ modoEdicion ? 'Editar Mascota' : 'Nueva Mascota' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <!-- Mensaje de error del servidor -->
            <div v-if="errorMsg"
                 class="alert alert-danger d-flex align-items-center gap-2 mb-3">
              <i class="bi bi-exclamation-triangle-fill"></i>{{ errorMsg }}
            </div>

            <form @submit.prevent="guardarM" id="formMascota">
              <div class="row g-3">
                <!-- Nombre de la mascota -->
                <div class="col-md-6">
                  <label class="form-label fw-semibold">
                    Nombre <span class="text-danger">*</span>
                  </label>
                  <input v-model.trim="form.nombre" type="text" class="form-control"
                         placeholder="Ej: Firulais" required />
                </div>
                <!-- Raza -->
                <div class="col-md-6">
                  <label class="form-label fw-semibold">
                    Raza <span class="text-danger">*</span>
                  </label>
                  <input v-model.trim="form.raza" type="text" class="form-control"
                         placeholder="Ej: Labrador" required />
                </div>
                <!-- Edad en años -->
                <div class="col-md-4">
                  <label class="form-label fw-semibold">
                    Edad (años) <span class="text-danger">*</span>
                  </label>
                  <input v-model="form.edad" type="number" class="form-control"
                         placeholder="0" min="0" step="1" required />
                </div>
                <!-- Peso en kilogramos -->
                <div class="col-md-4">
                  <label class="form-label fw-semibold">
                    Peso (kg) <span class="text-danger">*</span>
                  </label>
                  <input v-model="form.peso" type="number" class="form-control"
                         placeholder="0.0" min="0" step="0.1" required />
                </div>
                <!-- Sexo de la mascota -->
                <div class="col-md-4">
                  <label class="form-label fw-semibold">
                    Sexo <span class="text-danger">*</span>
                  </label>
                  <select v-model="form.sexo" class="form-select" required>
                    <option value="" disabled>Seleccionar…</option>
                    <option value="Macho">Macho</option>
                    <option value="Hembra">Hembra</option>
                  </select>
                </div>
                <!-- Select dinámico de propietarios cargados desde la API -->
                <div class="col-12">
                  <label class="form-label fw-semibold">
                    Propietario <span class="text-danger">*</span>
                  </label>
                  <select v-model="form.propietario" class="form-select" required>
                    <option value="" disabled>Seleccionar propietario…</option>
                    <option v-for="p in propietarios" :key="p._id" :value="p._id">
                      {{ p.nombreCompleto }} — {{ p.dui }}
                    </option>
                  </select>
                  <div class="form-text">
                    ¿No encuentras el propietario?
                    <router-link to="/propietarios" data-bs-dismiss="modal">
                      Registrar propietario
                    </router-link>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-circle me-1"></i>Cancelar
            </button>
            <button type="submit" form="formMascota" class="btn btn-primary"
                    :disabled="guardando">
              <span v-if="guardando" class="spinner-border spinner-border-sm me-1"></span>
              <i v-else class="bi bi-check-circle me-1"></i>
              {{ modoEdicion ? 'Actualizar' : 'Registrar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== MODAL: CONFIRMAR ELIMINACIÓN DE MASCOTA ===== -->
    <div class="modal fade" id="modalEliminarMascota" tabindex="-1" aria-hidden="true">
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
            <i class="bi bi-heart-break-fill text-danger display-4 mb-3 d-block"></i>
            <p class="mb-1">¿Eliminar la mascota:</p>
            <p class="fw-bold fs-5 text-danger">{{ mascotaAEliminar?.nombre }}</p>
            <p class="text-muted small">
              También se eliminará su historial clínico.<br>
              Esta acción no se puede deshacer.
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-circle me-1"></i>Cancelar
            </button>
            <button type="button" class="btn btn-danger"
                    @click="eliminarM" :disabled="guardando">
              <span v-if="guardando" class="spinner-border spinner-border-sm me-1"></span>
              <i v-else class="bi bi-trash-fill me-1"></i>Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

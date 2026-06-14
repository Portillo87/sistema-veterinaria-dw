<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { perroService } from '@/services/perroService.js'
import { propietarioService } from '@/services/propietarioService.js'

const router = useRouter()

const totalMascotas = ref(0)
const totalPropietarios = ref(0)
const mascotas = ref([])
const cargando = ref(true)

onMounted(async () => {
  try {
    const [resMascotas, resPropietarios] = await Promise.all([
      perroService.getAll(),
      propietarioService.getAll()
    ])
    mascotas.value = resMascotas.data.datos || []
    totalMascotas.value = mascotas.value.length
    totalPropietarios.value = (resPropietarios.data.datos || []).length
  } catch {
    /* La API puede estar iniciando */
  } finally {
    cargando.value = false
  }
})
</script>

<template>
  <div>
    <!-- Encabezado -->
    <div class="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h1 class="page-title mb-0">Dashboard</h1>
        <p class="text-muted mb-0 small">Resumen general del sistema veterinario</p>
      </div>
    </div>

    <!-- Tarjetas de estadísticas -->
    <div class="row g-4 mb-5">
      <div class="col-12 col-sm-6 col-xl-4">
        <div class="card stat-card shadow-sm h-100">
          <div class="card-body d-flex align-items-center gap-3 p-4">
            <div class="icon-box" style="background:#dbeafe;">
              <i class="bi bi-heart-fill text-primary"></i>
            </div>
            <div>
              <div class="text-muted small fw-semibold">Total Mascotas</div>
              <div class="fw-bold" style="font-size:2rem;line-height:1.1;color:#1a1a2e;">
                {{ cargando ? '…' : totalMascotas }}
              </div>
            </div>
          </div>
          <div class="card-footer bg-transparent border-0 pb-3 px-4">
            <button class="btn btn-primary btn-sm w-100" @click="router.push('/mascotas')">
              <i class="bi bi-arrow-right-circle me-1"></i>Ver Mascotas
            </button>
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-xl-4">
        <div class="card stat-card shadow-sm h-100">
          <div class="card-body d-flex align-items-center gap-3 p-4">
            <div class="icon-box" style="background:#dcfce7;">
              <i class="bi bi-people-fill text-success"></i>
            </div>
            <div>
              <div class="text-muted small fw-semibold">Propietarios Registrados</div>
              <div class="fw-bold" style="font-size:2rem;line-height:1.1;color:#1a1a2e;">
                {{ cargando ? '…' : totalPropietarios }}
              </div>
            </div>
          </div>
          <div class="card-footer bg-transparent border-0 pb-3 px-4">
            <button class="btn btn-success btn-sm w-100" @click="router.push('/propietarios')">
              <i class="bi bi-arrow-right-circle me-1"></i>Ver Propietarios
            </button>
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-xl-4">
        <div class="card stat-card shadow-sm h-100">
          <div class="card-body d-flex align-items-center gap-3 p-4">
            <div class="icon-box" style="background:#fef9c3;">
              <i class="bi bi-clipboard2-pulse-fill text-warning"></i>
            </div>
            <div>
              <div class="text-muted small fw-semibold">Historial Clínico</div>
              <div class="fw-bold" style="font-size:1rem;line-height:1.5;color:#1a1a2e;">
                Accede desde el<br>detalle de cada mascota
              </div>
            </div>
          </div>
          <div class="card-footer bg-transparent border-0 pb-3 px-4">
            <button class="btn btn-warning btn-sm w-100 text-dark" @click="router.push('/mascotas')">
              <i class="bi bi-arrow-right-circle me-1"></i>Ir a Mascotas
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Últimas mascotas -->
    <div class="card shadow-sm mb-4">
      <div class="card-header bg-white py-3 d-flex align-items-center justify-content-between">
        <h5 class="mb-0 fw-bold">
          <i class="bi bi-heart text-danger me-2"></i>Últimas Mascotas Registradas
        </h5>
        <button class="btn btn-outline-primary btn-sm" @click="router.push('/mascotas')">
          Ver todas <i class="bi bi-arrow-right ms-1"></i>
        </button>
      </div>
      <div class="card-body p-0">
        <div v-if="cargando" class="text-center py-4 text-muted">
          <div class="spinner-border spinner-border-sm me-2"></div>Cargando…
        </div>
        <div v-else-if="mascotas.length === 0" class="text-center py-5 text-muted">
          <i class="bi bi-heart display-6 d-block mb-2 opacity-25"></i>
          No hay mascotas registradas aún.
        </div>
        <div v-else class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th class="px-4">Nombre</th>
                <th>Raza</th>
                <th>Edad</th>
                <th>Sexo</th>
                <th>Propietario</th>
                <th class="px-4">Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in mascotas.slice(0, 5)" :key="m._id">
                <td class="px-4 fw-semibold">{{ m.nombre }}</td>
                <td>{{ m.raza }}</td>
                <td>{{ m.edad }} año{{ m.edad !== 1 ? 's' : '' }}</td>
                <td>
                  <span :class="m.sexo === 'Macho' ? 'badge-macho' : 'badge-hembra'">
                    {{ m.sexo }}
                  </span>
                </td>
                <td>
                  <span v-if="m.propietario">{{ m.propietario.nombreCompleto }}</span>
                  <span v-else class="text-muted small">—</span>
                </td>
                <td class="px-4">
                  <button class="btn btn-outline-primary btn-sm"
                          @click="router.push(`/mascotas/${m._id}`)">
                    <i class="bi bi-eye me-1"></i>Ver
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Accesos rápidos -->
    <h5 class="fw-bold mb-3" style="color:#1a1a2e;">
      <i class="bi bi-lightning-fill text-warning me-2"></i>Accesos Rápidos
    </h5>
    <div class="row g-3">
      <div class="col-6 col-md-3">
        <button class="btn btn-primary w-100 py-3 d-flex flex-column align-items-center gap-1"
                @click="router.push('/propietarios')">
          <i class="bi bi-person-plus-fill fs-4"></i>
          <small>Nuevo Propietario</small>
        </button>
      </div>
      <div class="col-6 col-md-3">
        <button class="btn btn-success w-100 py-3 d-flex flex-column align-items-center gap-1"
                @click="router.push('/mascotas')">
          <i class="bi bi-plus-circle-fill fs-4"></i>
          <small>Nueva Mascota</small>
        </button>
      </div>
      <div class="col-6 col-md-3">
        <button class="btn btn-outline-secondary w-100 py-3 d-flex flex-column align-items-center gap-1"
                @click="router.push('/propietarios')">
          <i class="bi bi-people fs-4"></i>
          <small>Ver Propietarios</small>
        </button>
      </div>
      <div class="col-6 col-md-3">
        <button class="btn btn-outline-secondary w-100 py-3 d-flex flex-column align-items-center gap-1"
                @click="router.push('/mascotas')">
          <i class="bi bi-list-ul fs-4"></i>
          <small>Ver Mascotas</small>
        </button>
      </div>
    </div>
  </div>
</template>

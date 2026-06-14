<script setup>
import { RouterView, RouterLink } from 'vue-router'
import { ref, onMounted } from 'vue'
import api from '@/services/api.js'

const apiOnline = ref(false)

onMounted(async () => {
  try {
    await api.get('/propietarios')
    apiOnline.value = true
  } catch {
    apiOnline.value = false
  }
})
</script>

<template>
  <div class="d-flex" style="min-height: 100vh;">

    <!-- ===== SIDEBAR ===== -->
    <nav id="sidebar">
      <!-- Marca -->
      <div class="sidebar-brand d-flex align-items-center gap-2">
        <div class="d-flex align-items-center justify-content-center rounded-3"
             style="width:40px;height:40px;background:rgba(255,255,255,0.1);">
          <i class="bi bi-heart-pulse-fill text-danger fs-5"></i>
        </div>
        <div>
          <div class="text-white fw-bold" style="font-size:1rem;line-height:1.2">AnimalCare</div>
          <div class="text-white-50" style="font-size:0.72rem;">Pro Dashboard</div>
        </div>
      </div>

      <!-- Navegación -->
      <ul class="nav flex-column px-3 py-3">
        <li class="mb-1">
          <small class="text-white-50 fw-semibold ps-1" style="font-size:0.7rem;letter-spacing:.08em;">
            MENÚ PRINCIPAL
          </small>
        </li>
        <li class="nav-item">
          <RouterLink to="/" class="nav-link d-flex align-items-center gap-2">
            <i class="bi bi-speedometer2 fs-6"></i>
            <span>Dashboard</span>
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/propietarios" class="nav-link d-flex align-items-center gap-2">
            <i class="bi bi-people-fill fs-6"></i>
            <span>Propietarios</span>
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/mascotas" class="nav-link d-flex align-items-center gap-2">
            <i class="bi bi-heart-fill fs-6"></i>
            <span>Mascotas</span>
          </RouterLink>
        </li>

        <li class="mt-4 mb-1">
          <small class="text-white-50 fw-semibold ps-1" style="font-size:0.7rem;letter-spacing:.08em;">
            SISTEMA
          </small>
        </li>
        <li class="nav-item">
          <span class="nav-link d-flex align-items-center gap-2" style="cursor:default;">
            <i class="bi bi-database-fill-check fs-6 text-success"></i>
            <span class="text-success">MongoDB Conectado</span>
          </span>
        </li>
      </ul>
    </nav>

    <!-- ===== CONTENIDO PRINCIPAL ===== -->
    <div class="flex-grow-1 d-flex flex-column" style="min-width:0;">

      <!-- Topbar -->
      <header class="topbar d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-2">
          <i class="bi bi-hospital text-primary fs-5"></i>
          <span class="fw-semibold" style="color:#1a1a2e;font-size:1rem;">
            Sistema de Gestión Veterinaria
          </span>
        </div>
        <div class="d-flex align-items-center gap-3">
          <span class="text-muted small">
            <i class="bi bi-calendar3 me-1"></i>
            {{ new Date().toLocaleDateString('es-SV', { dateStyle: 'long' }) }}
          </span>
          <span :class="apiOnline
            ? 'badge bg-success-subtle text-success border border-success-subtle px-2'
            : 'badge bg-danger-subtle text-danger border border-danger-subtle px-2'">
            <i class="bi bi-circle-fill me-1" style="font-size:.5rem;"></i>
            {{ apiOnline ? 'API Online' : 'API Offline' }}
          </span>
        </div>
      </header>

      <!-- Vista activa -->
      <main class="flex-grow-1 p-4">
        <RouterView />
      </main>
    </div>

  </div>
</template>

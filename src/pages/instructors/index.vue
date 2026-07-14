<template>
  <div class="space-y-6">
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-surface-900 p-5 sm:p-6">
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-400/10 blur-[60px]"></div>
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">Manajemen Instruktur</h1>
          <p class="text-sm text-white/60 mt-1 font-medium">Kelola data instruktur dan pengajar AKMAN Academy</p>
        </div>
        <button @click="showCreateModal = true" class="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-xl border border-white/10 transition-all duration-200 shrink-0">
          <Plus :size="16" />
          Tambah Instruktur
        </button>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="border-b border-surface-200 dark:border-surface-700 -mb-px">
      <nav class="flex gap-6 overflow-x-auto" role="tablist">
        <button
          class="pb-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors border-emerald-500 text-emerald-600 dark:text-emerald-400"
          role="tab"
          aria-selected="true">
          <span class="flex items-center gap-2">
            <Users :size="16" />
            Instruktur
          </span>
        </button>
      </nav>
    </div>

    <!-- ═══════ Instruktur by Role ═══════ -->
    <div>
      <!-- Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Users :size="18" class="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ store.instructorsByRole.length }}</p>
              <p class="text-xs text-surface-500 font-medium">Total Instruktur</p>
            </div>
          </div>
        </div>
        <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <UserCheck :size="18" class="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ activeInstructorsByRole }}</p>
              <p class="text-xs text-surface-500 font-medium">Aktif</p>
            </div>
          </div>
        </div>
        <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <BookOpen :size="18" class="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ totalCompletedClasses }}</p>
              <p class="text-xs text-surface-500 font-medium">Kelas Selesai</p>
            </div>
          </div>
        </div>
        <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <GraduationCap :size="18" class="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ totalStudentsTaught }}</p>
              <p class="text-xs text-surface-500 font-medium">Total Siswa</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Search -->
      <div class="flex flex-col sm:flex-row gap-3 mb-4">
        <div class="relative flex-1">
          <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input v-model="searchRole" type="text" placeholder="Cari nama, email, atau departemen..."
            class="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/80 dark:bg-surface-900/80 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all" />
        </div>
        <button @click="store.fetchInstructorsByRole()" class="px-4 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all text-sm font-medium flex items-center gap-2">
          <RefreshCw :size="16" :class="{ 'animate-spin': store.loading }" />
        </button>
      </div>

      <!-- Instructors by Role List -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in filteredInstructorsByRole" :key="i.user_id"
          class="group relative overflow-hidden rounded-2xl bg-white/90 dark:bg-surface-900/90 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
          <div class="flex items-start gap-4">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-sm">
              {{ initials(i.full_name) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100">{{ i.full_name }}</h3>
                  <p class="text-xs text-surface-400 truncate">{{ i.email }}</p>
                </div>
                <span class="inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0"
                  :class="i.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'">
                  {{ i.is_active ? 'Active' : 'Inactive' }}
                </span>
              </div>

              <div class="flex flex-wrap gap-1.5 mt-2">
                <span v-if="i.department" class="inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                  {{ i.department }}
                </span>
                <span v-if="i.position" class="inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400">
                  {{ i.position }}
                </span>
              </div>

              <!-- Class Stats -->
              <div class="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-surface-100/50 dark:border-surface-700/20">
                <div class="text-center">
                  <p class="text-lg font-bold text-surface-900 dark:text-surface-100">{{ i.total_classes }}</p>
                  <p class="text-[10px] text-surface-400 font-medium">Kelas</p>
                </div>
                <div class="text-center">
                  <p class="text-lg font-bold text-emerald-600 dark:text-emerald-400">{{ i.active_classes }}</p>
                  <p class="text-[10px] text-surface-400 font-medium">Aktif</p>
                </div>
                <div class="text-center">
                  <p class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ i.total_students }}</p>
                  <p class="text-[10px] text-surface-400 font-medium">Siswa</p>
                </div>
              </div>

              <!-- Rating -->
              <div v-if="i.average_score > 0" class="flex items-center gap-1 mt-2">
                <Star :size="12" class="text-amber-400" />
                <span class="text-xs font-medium text-surface-600 dark:text-surface-400">{{ i.average_score.toFixed(1) }} rata-rata skor</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!filteredInstructorsByRole.length && !store.loading"
          class="col-span-full rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-12 text-center">
          <Users :size="40" class="mx-auto text-surface-300 mb-3" />
          <p class="text-sm font-semibold text-surface-500">{{ searchRole ? 'Tidak ada instruktur yang cocok' : 'Belum ada user dengan role instruktur' }}</p>
        </div>

        <!-- Loading -->
        <div v-if="store.loading" class="col-span-full text-center py-12">
          <div class="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p class="text-sm text-surface-400">Memuat instruktur...</p>
        </div>
      </div>
    </div>

    <!-- ═══════ Tab: Manajemen Instruktur ═══════ -->
    <div v-if="activeTab === 'management'">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Users :size="18" class="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ store.stats.total }}</p>
              <p class="text-xs text-surface-500 font-medium">Total Instruktur</p>
            </div>
          </div>
        </div>
        <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <UserCheck :size="18" class="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ store.stats.active }}</p>
              <p class="text-xs text-surface-500 font-medium">Aktif</p>
            </div>
          </div>
        </div>
        <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Award :size="18" class="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ store.stats.bnsp_certified }}</p>
              <p class="text-xs text-surface-500 font-medium">BNSP Certified</p>
            </div>
          </div>
        </div>
        <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Clock :size="18" class="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ store.stats.available }}</p>
              <p class="text-xs text-surface-500 font-medium">Tersedia</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 mb-4">
        <div class="relative flex-1">
          <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input v-model="search" @input="debouncedSearch" type="text" placeholder="Cari nama atau email..."
            class="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/80 dark:bg-surface-900/80 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all" />
        </div>
        <select v-model="statusFilter" @change="refresh"
          class="px-3 py-2.5 rounded-xl bg-white/80 dark:bg-surface-900/80 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-all">
          <option value="">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Nonaktif</option>
          <option value="on_leave">Cuti</option>
        </select>
        <select v-model="availabilityFilter" @change="refresh"
          class="px-3 py-2.5 rounded-xl bg-white/80 dark:bg-surface-900/80 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-all">
          <option value="">Semua Ketersediaan</option>
          <option value="available">Tersedia</option>
          <option value="busy">Sibuk</option>
          <option value="unavailable">Tidak Tersedia</option>
        </select>
        <button @click="refresh" class="px-4 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all text-sm font-medium flex items-center gap-2">
          <RefreshCw :size="16" :class="{ 'animate-spin': store.loading }" />
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in store.instructors" :key="i.id"
          class="group relative overflow-hidden rounded-2xl bg-white/90 dark:bg-surface-900/90 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
          <div class="flex items-start gap-4">
            <div class="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-lg font-bold shrink-0">
              {{ initials(i.full_name) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100">{{ i.full_name }}</h3>
                  <p class="text-xs text-surface-400">{{ i.email }}</p>
                </div>
                <div class="flex gap-1">
                  <span v-if="i.bnsp_certified" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    <Award :size="10" />
                    BNSP
                  </span>
                  <span class="inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                    :class="availabilityBadge(i.availability)">
                    {{ availabilityLabel(i.availability) }}
                  </span>
                </div>
              </div>

              <div class="flex items-center gap-4 mt-3 pt-3 border-t border-surface-100/50 dark:border-surface-700/20 text-xs text-surface-400">
                <span v-if="i.total_classes" class="flex items-center gap-1">
                  <BookOpen :size="12" />
                  {{ i.total_classes }} kelas
                </span>
                <span v-if="i.active_classes" class="flex items-center gap-1">
                  <GraduationCap :size="12" />
                  {{ i.active_classes }} aktif
                </span>
                <span v-if="i.total_students" class="flex items-center gap-1">
                  <Users :size="12" />
                  {{ i.total_students }} siswa
                </span>
              </div>

              <div v-if="i.average_score > 0" class="flex items-center gap-1 mt-2">
                <Star :size="12" class="text-amber-400" />
                <span class="text-xs font-medium text-surface-600 dark:text-surface-400">{{ i.average_score.toFixed(1) }} rata-rata skor</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!filteredInstructorsByRole.length && !store.loading"
          class="col-span-full rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-12 text-center">
          <Users :size="40" class="mx-auto text-surface-300 mb-3" />
          <p class="text-sm font-semibold text-surface-500">{{ searchRole ? 'Tidak ada instruktur yang cocok' : 'Belum ada user dengan role instruktur' }}</p>
        </div>

        <!-- Loading -->
        <div v-if="store.loading" class="col-span-full text-center py-12">
          <div class="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p class="text-sm text-surface-400">Memuat instruktur...</p>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showCreateModal" class="fixed inset-0 z-[90] flex items-center justify-center p-4" @click.self="closeModal">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div class="relative w-full max-w-2xl bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200/50 dark:border-surface-700/50 overflow-hidden max-h-[90vh] flex flex-col">
            <div class="flex items-center justify-between p-5 border-b border-surface-200/50 dark:border-surface-700/30 shrink-0">
              <h2 class="text-base font-bold text-surface-900 dark:text-surface-100">{{ editingId ? 'Edit Instruktur' : 'Tambah Instruktur Baru' }}</h2>
              <button @click="closeModal" class="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800">
                <X :size="18" />
              </button>
            </div>
            <div class="p-5 space-y-4 overflow-y-auto">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Nama Lengkap *</label>
                  <input v-model="form.full_name" type="text" class="input-field" placeholder="Nama lengkap" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Email *</label>
                  <input v-model="form.email" type="email" class="input-field" placeholder="email@example.com" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Telepon</label>
                  <input v-model="form.phone" type="text" class="input-field" placeholder="08xxxxxxxxxx" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Jenis Kelamin</label>
                  <select v-model="form.gender" class="input-field">
                    <option value="">Pilih</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Bio</label>
                <textarea v-model="form.bio" rows="3" class="input-field resize-none" placeholder="Bio singkat instruktur"></textarea>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Pendidikan</label>
                  <select v-model="form.education_level" class="input-field">
                    <option value="">Pilih</option>
                    <option value="SMA">SMA/SMK</option>
                    <option value="D3">D3</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Institusi</label>
                  <input v-model="form.institution" type="text" class="input-field" placeholder="Nama universitas" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Pengalaman (Tahun)</label>
                  <input v-model.number="form.years_experience" type="number" class="input-field" placeholder="0" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tarif per Jam (Rp)</label>
                  <input v-model.number="form.hourly_rate" type="number" class="input-field" placeholder="0" />
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Status</label>
                  <select v-model="form.status" class="input-field">
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                    <option value="on_leave">Cuti</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Ketersediaan</label>
                  <select v-model="form.availability" class="input-field">
                    <option value="available">Tersedia</option>
                    <option value="busy">Sibuk</option>
                    <option value="unavailable">Tidak Tersedia</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tipe Kontrak</label>
                  <select v-model="form.contract_type" class="input-field">
                    <option value="">Pilih</option>
                    <option value="permanent">Tetap</option>
                    <option value="contract">Kontrak</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tanggal Bergabung</label>
                  <input v-model="form.join_date" type="date" class="input-field" />
                </div>
              </div>
              <div class="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                <input v-model="form.bnsp_certified" type="checkbox" id="bnsp_certified" class="rounded" />
                <label for="bnsp_certified" class="text-sm font-medium text-surface-700 dark:text-surface-300">Bersertifikat BNSP</label>
              </div>
              <div v-if="form.bnsp_certified" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">No. Sertifikat BNSP</label>
                  <input v-model="form.bnsp_certificate_no" type="text" class="input-field" placeholder="Nomor sertifikat" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tanggal Kadaluarsa</label>
                  <input v-model="form.bnsp_expiry_date" type="date" class="input-field" />
                </div>
              </div>
            </div>
            <div class="flex items-center justify-end gap-3 p-5 border-t border-surface-200/50 dark:border-surface-700/30 bg-surface-50/50 dark:bg-surface-800/30 shrink-0">
              <button @click="closeModal" class="px-4 py-2 text-sm font-semibold rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors" :disabled="store.creating">Batal</button>
              <button @click="handleSubmit" :disabled="!canSubmit || store.creating" class="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 dark:disabled:bg-surface-700 text-white text-sm font-bold rounded-xl transition-all duration-200 disabled:cursor-not-allowed">
                <Loader2 v-if="store.creating" :size="16" class="animate-spin" />
                <Save v-else :size="16" />
                {{ store.creating ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Instruktur' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDeleteModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4" @click.self="showDeleteModal = false">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div class="relative w-full max-w-sm bg-white dark:bg-surface-900 rounded-2xl shadow-2xl p-6 text-center">
            <div class="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <Trash2 :size="24" class="text-red-600 dark:text-red-400" />
            </div>
            <h3 class="text-base font-bold text-surface-900 dark:text-surface-100 mb-2">Hapus Instruktur?</h3>
            <p class="text-sm text-surface-500 mb-6">Instruktur "<strong>{{ deletingInstructor?.full_name }}</strong>" akan dihapus permanen.</p>
            <div class="flex gap-3">
              <button @click="showDeleteModal = false" class="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors">Batal</button>
              <button @click="handleDelete" class="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors">Hapus</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus, Search, RefreshCw, Users, UserCheck, Award, BookOpen, GraduationCap, Trash2, X, Save, Loader2, Star } from 'lucide-vue-next'
import { useInstructorStore, type Instructor } from '@/stores/instructors'
import { useToast } from '@/composables/useToast'

const store = useInstructorStore()
const toast = useToast()

const activeTab = ref('role')
const searchRole = ref('')
const search = ref('')
const statusFilter = ref('')
const availabilityFilter = ref('')
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const editingId = ref<string | null>(null)
const deletingInstructor = ref<Instructor | null>(null)

const form = reactive({
  full_name: '',
  email: '',
  phone: '',
  gender: '',
  bio: '',
  education_level: '',
  institution: '',
  years_experience: 0,
  hourly_rate: 0,
  status: 'active',
  availability: 'available',
  contract_type: '',
  join_date: '',
  bnsp_certified: false,
  bnsp_certificate_no: '',
  bnsp_expiry_date: '',
})

const canSubmit = computed(() => form.full_name && form.email)

const filteredInstructorsByRole = computed(() => {
  if (!searchRole.value) return store.instructorsByRole
  const s = searchRole.value.toLowerCase()
  return store.instructorsByRole.filter(i =>
    i.full_name.toLowerCase().includes(s) ||
    i.email.toLowerCase().includes(s) ||
    i.department.toLowerCase().includes(s) ||
    i.position.toLowerCase().includes(s)
  )
})

const activeInstructorsByRole = computed(() => store.instructorsByRole.filter(i => i.is_active).length)
const totalCompletedClasses = computed(() => store.instructorsByRole.reduce((sum, i) => sum + (i.total_classes - i.active_classes), 0))
const totalStudentsTaught = computed(() => store.instructorsByRole.reduce((sum, i) => sum + i.total_students, 0))

onMounted(() => {
  store.fetchInstructorsByRole()
})

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function availabilityBadge(availability: string) {
  const badges: Record<string, string> = {
    available: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    busy: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    unavailable: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }
  return badges[availability] || 'bg-surface-100 text-surface-600'
}

function availabilityLabel(availability: string) {
  const labels: Record<string, string> = {
    available: 'Tersedia',
    busy: 'Sibuk',
    unavailable: 'Tidak Tersedia',
  }
  return labels[availability] || availability
}

function refresh() {
  store.fetchInstructors({
    status: statusFilter.value || undefined,
    availability: availabilityFilter.value || undefined,
    search: search.value || undefined,
  })
}

let debounceTimer: ReturnType<typeof setTimeout>
function debouncedSearch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => refresh(), 400)
}

function resetForm() {
  form.full_name = ''
  form.email = ''
  form.phone = ''
  form.gender = ''
  form.bio = ''
  form.education_level = ''
  form.institution = ''
  form.years_experience = 0
  form.hourly_rate = 0
  form.status = 'active'
  form.availability = 'available'
  form.contract_type = ''
  form.join_date = ''
  form.bnsp_certified = false
  form.bnsp_certificate_no = ''
  form.bnsp_expiry_date = ''
}

function closeModal() {
  showCreateModal.value = false
  editingId.value = null
  resetForm()
}

async function handleSubmit() {
  if (!canSubmit.value || store.creating) return

  let result
  if (editingId.value) {
    result = await store.updateInstructor(editingId.value, { ...form })
  } else {
    result = await store.createInstructor({ ...form })
  }

  if (result?.success) {
    toast.success(editingId.value ? 'Instruktur berhasil diupdate' : 'Instruktur berhasil ditambahkan')
    closeModal()
  } else {
    toast.error(result?.message || 'Gagal menyimpan instruktur')
  }
}

async function handleDelete() {
  if (!deletingInstructor.value) return

  const result = await store.deleteInstructor(deletingInstructor.value.id)
  if (result?.success) {
    toast.success('Instruktur berhasil dihapus')
    showDeleteModal.value = false
    deletingInstructor.value = null
  } else {
    toast.error(result?.message || 'Gagal menghapus instruktur')
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: scale(0.95) translateY(10px);
}
</style>

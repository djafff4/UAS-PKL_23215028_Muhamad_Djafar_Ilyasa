<template>
  <div class="space-y-6">
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-surface-900 p-5 sm:p-6">
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-indigo-400/10 blur-[60px]"></div>
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">Program Pelatihan</h1>
          <p class="text-sm text-white/60 mt-1 font-medium">Kelola program pelatihan AKMAN Academy</p>
        </div>
        <button @click="showCreateModal = true" class="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-xl border border-white/10 transition-all duration-200 shrink-0">
          <Plus :size="16" />
          Buat Program
        </button>
      </div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <BookOpen :size="18" class="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ store.stats.total }}</p>
            <p class="text-xs text-surface-500 font-medium">Total Program</p>
          </div>
        </div>
      </div>
      <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <CheckCircle :size="18" class="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ store.stats.published }}</p>
            <p class="text-xs text-surface-500 font-medium">Published</p>
          </div>
        </div>
      </div>
      <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <FileEdit :size="18" class="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ store.stats.draft }}</p>
            <p class="text-xs text-surface-500 font-medium">Draft</p>
          </div>
        </div>
      </div>
      <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
            <Archive :size="18" class="text-surface-600 dark:text-surface-400" />
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ store.stats.archived }}</p>
            <p class="text-xs text-surface-500 font-medium">Archived</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2 border-b border-surface-200/50 dark:border-surface-700/30 pb-2">
      <button v-for="tab in typeTabs" :key="tab.value"
        @click="typeFilter = tab.value; refresh()"
        class="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
        :class="typeFilter === tab.value ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'">
        {{ tab.label }}
      </button>
    </div>

    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input v-model="search" @input="debouncedSearch" type="text" placeholder="Cari program..."
          class="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/80 dark:bg-surface-900/80 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all" />
      </div>
      <select v-model="statusFilter" @change="refresh"
        class="px-3 py-2.5 rounded-xl bg-white/80 dark:bg-surface-900/80 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-all">
        <option value="">Semua Status</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
      </select>
      <select v-model="trainingModeFilter" @change="refresh"
        class="px-3 py-2.5 rounded-xl bg-white/80 dark:bg-surface-900/80 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-all">
        <option value="">Semua Mode</option>
        <option value="online">Online</option>
        <option value="offline">Offline</option>
        <option value="hybrid">Hybrid</option>
      </select>
      <button @click="refresh" class="px-4 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all text-sm font-medium flex items-center gap-2">
        <RefreshCw :size="16" :class="{ 'animate-spin': store.loading }" />
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="p in store.programs" :key="p.id"
        class="group relative overflow-hidden rounded-2xl bg-white/90 dark:bg-surface-900/90 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
        <div class="h-32 bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
          <img v-if="p.thumbnail_url" :src="p.thumbnail_url" :alt="p.title" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div class="absolute top-3 right-3 flex gap-1.5">
            <span class="inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm"
              :class="statusBadge(p.status)">
              {{ p.status }}
            </span>
            <span class="inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm">
              {{ (p.program_type || p.type?.toLowerCase() || 'reguler') }}
            </span>
          </div>
          <div class="absolute bottom-3 left-3 right-3">
            <p class="text-xs text-white/80 font-medium">{{ p.category || 'Umum' }}</p>
          </div>
        </div>

        <div class="p-4">
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 line-clamp-2 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {{ p.title }}
          </h3>
          <span v-if="p.code" class="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-2">{{ p.code }}</span>
          <p class="text-xs text-surface-500 line-clamp-2 mb-4">{{ p.short_description || p.description }}</p>

          <div class="flex items-center gap-3 text-xs text-surface-400 mb-4 flex-wrap">
            <span v-if="p.duration_hours" class="flex items-center gap-1">
              <Clock :size="12" />
              {{ p.duration_hours }} JP
            </span>
            <span v-if="p.price" class="flex items-center gap-1">
              <Wallet :size="12" />
              {{ formatPrice(p.price) }}
            </span>
            <span v-if="p.level" class="flex items-center gap-1">
              <BarChart :size="12" />
              {{ p.level }}
            </span>
            <span v-if="p.max_participants" class="flex items-center gap-1">
              <Users :size="12" />
              {{ p.max_participants }} peserta
            </span>
            <span v-if="p.location" class="flex items-center gap-1">
              <MapPin :size="12" />
              {{ p.location }}
            </span>
            <span v-if="p.training_mode" class="flex items-center gap-1">
              <span class="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                :class="trainingModeBadge(p.training_mode)">
                {{ p.training_mode }}
              </span>
            </span>
            <span v-if="p.personal_tier && p.program_type === 'personal'" class="flex items-center gap-1">
              <span class="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                {{ p.personal_tier }}
              </span>
            </span>
            <span v-if="p.level && p.program_type !== 'personal'" class="flex items-center gap-1">
              <span class="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                {{ p.level }}
              </span>
            </span>
          </div>

          <div class="flex items-center gap-2">
            <button @click="openDetail(p)" class="flex-1 px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/30 transition-colors">
              Detail
            </button>
            <button @click="goToEdit(p)" class="p-2 rounded-xl text-surface-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all">
              <Pencil :size="14" />
            </button>
            <button @click="confirmDelete(p)" class="p-2 rounded-xl text-surface-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all">
              <Trash2 :size="14" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="!store.programs.length && !store.loading"
        class="col-span-full rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-12 text-center">
        <BookOpen :size="40" class="mx-auto text-surface-300 mb-3" />
        <p class="text-sm font-semibold text-surface-500">{{ search || statusFilter || typeFilter ? 'Tidak ada program yang cocok' : 'Belum ada program' }}</p>
      </div>

      <div v-if="store.loading" class="col-span-full text-center py-12">
        <div class="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p class="text-sm text-surface-400">Memuat program...</p>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showCreateModal" class="fixed inset-0 z-[90] flex items-center justify-center p-4" @click.self="closeModal">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div class="relative w-full max-w-2xl bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200/50 dark:border-surface-700/50 overflow-hidden max-h-[90vh] flex flex-col">
            <div class="flex items-center justify-between p-5 border-b border-surface-200/50 dark:border-surface-700/30 shrink-0">
              <h2 class="text-base font-bold text-surface-900 dark:text-surface-100">{{ editingId ? 'Edit Program' : 'Buat Program Baru' }}</h2>
              <button @click="closeModal" class="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800">
                <X :size="18" />
              </button>
            </div>
            <div class="p-5 space-y-4 overflow-y-auto">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="sm:col-span-2">
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Judul Program *</label>
                  <input v-model="form.title" type="text" class="input-field" placeholder="Nama program pelatihan" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Kode Program</label>
                  <input v-model="form.code" type="text" class="input-field" placeholder="e.g., CRG-001" />
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tipe Program *</label>
                  <select v-model="form.program_type" class="input-field">
                    <option value="reguler">Reguler</option>
                    <option value="personal">Personal</option>
                    <option value="mentoring">Mentoring</option>
                    <option value="corporate">Corporate</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Kategori</label>
                  <input v-model="form.category" type="text" class="input-field" placeholder="e.g., Caregiver, IT, Bahasa" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Level</label>
                  <select v-model="form.level" class="input-field">
                    <option value="">Pilih</option>
                    <option value="basic">Basic</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Status</label>
                  <select v-model="form.status" class="input-field">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Deskripsi</label>
                <textarea v-model="form.description" rows="3" class="input-field resize-none" placeholder="Deskripsi program"></textarea>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Deskripsi Singkat</label>
                <textarea v-model="form.short_description" rows="2" class="input-field resize-none" placeholder="Ringkasan singkat program"></textarea>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Durasi (Jam)</label>
                  <input v-model.number="form.duration_hours" type="number" class="input-field" placeholder="0" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Durasi (Minggu)</label>
                  <input v-model.number="form.duration_weeks" type="number" class="input-field" placeholder="0" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Harga</label>
                  <input v-model.number="form.price" type="number" class="input-field" placeholder="0" />
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Mata Uang</label>
                  <select v-model="form.currency" class="input-field">
                    <option value="IDR">IDR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="SAR">SAR</option>
                    <option value="MYR">MYR</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Bahasa</label>
                  <select v-model="form.language" class="input-field">
                    <option value="id">Indonesia</option>
                    <option value="en">English</option>
                    <option value="ar">Arabic</option>
                    <option value="ja">Japanese</option>
                    <option value="ko">Korean</option>
                    <option value="zh">Chinese</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Divisi</label>
                  <input v-model="form.divisi" type="text" class="input-field" placeholder="Nama divisi" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Maks Peserta</label>
                  <input v-model.number="form.max_participants" type="number" class="input-field" placeholder="30" />
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Standar</label>
                  <select v-model="form.standard_type" class="input-field">
                    <option value="">Pilih</option>
                    <option value="SKKNI">SKKNI</option>
                    <option value="SKKI">SKKI</option>
                    <option value="INTERNATIONAL">Internasional</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Issuer</label>
                  <input v-model="form.standard_issuer" type="text" class="input-field" placeholder="e.g., BNSP, City&Guilds" />
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Prasyarat</label>
                <textarea v-model="form.prerequisites" rows="2" class="input-field resize-none" placeholder="Prasyarat mengikuti program"></textarea>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Hasil Pembelajaran <span class="normal-case tracking-normal font-normal text-surface-400">(pisahkan dengan baris baru)</span></label>
                <textarea :value="form.learning_outcomes.join('\n')" @input="form.learning_outcomes = ($event.target as HTMLTextAreaElement).value.split('\n').filter(Boolean)" rows="3" class="input-field resize-none" placeholder="Setiap baris satu hasil pembelajaran"></textarea>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tags <span class="normal-case tracking-normal font-normal text-surface-400">(pisahkan dengan koma)</span></label>
                <input :value="form.tags.join(', ')" @input="form.tags = ($event.target as HTMLInputElement).value.split(',').map(t => t.trim()).filter(Boolean)" type="text" class="input-field" placeholder="caregiver, lansia, kesehatan" />
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Mode Pelatihan</label>
                  <select v-model="form.training_mode" class="input-field">
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Lokasi</label>
                  <input v-model="form.location" type="text" class="input-field" placeholder="Lokasi pelatihan" />
                </div>
                <div v-if="form.program_type === 'personal' || form.program_type === 'mentoring'">
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Personal Tier</label>
                  <select v-model="form.personal_tier" class="input-field">
                    <option value="starter">Starter</option>
                    <option value="growth">Growth</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-end gap-3 p-5 border-t border-surface-200/50 dark:border-surface-700/30 bg-surface-50/50 dark:bg-surface-800/30 shrink-0">
              <button @click="closeModal" class="px-4 py-2 text-sm font-semibold rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors" :disabled="store.creating">Batal</button>
              <button @click="handleSubmit" :disabled="!canSubmit || store.creating" class="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 dark:disabled:bg-surface-700 text-white text-sm font-bold rounded-xl transition-all duration-200 disabled:cursor-not-allowed">
                <Loader2 v-if="store.creating" :size="16" class="animate-spin" />
                <Save v-else :size="16" />
                {{ store.creating ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Buat Program' }}
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
            <h3 class="text-base font-bold text-surface-900 dark:text-surface-100 mb-2">Hapus Program?</h3>
            <p class="text-sm text-surface-500 mb-6">Program "<strong>{{ deletingProgram?.title }}</strong>" akan dihapus permanen.</p>
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
import { Plus, Search, RefreshCw, BookOpen, CheckCircle, FileEdit, Archive, Clock, Wallet, BarChart, Users, MapPin, Pencil, Trash2, X, Save, Loader2 } from 'lucide-vue-next'
import { useProgramStore, type Program } from '@/stores/programs'
import { useToast } from '@/composables/useToast'

const store = useProgramStore()
const toast = useToast()

const search = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const trainingModeFilter = ref('')
const typeTabs = [
  { label: 'Semua', value: '' },
  { label: 'Reguler', value: 'reguler' },
  { label: 'Personal', value: 'personal' },
  { label: 'Mentoring', value: 'mentoring' },
  { label: 'Corporate', value: 'corporate' },
]
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const editingId = ref<string | null>(null)
const deletingProgram = ref<Program | null>(null)

const form = reactive({
  title: '',
  code: '',
  program_type: 'reguler',
  category: '',
  description: '',
  short_description: '',
  language: 'id',
  level: '',
  status: 'draft',
  duration_hours: 0,
  duration_weeks: 0,
  price: 0,
  currency: 'IDR',
  standard_type: '',
  standard_issuer: '',
  prerequisites: '',
  learning_outcomes: [] as string[],
  tags: [] as string[],
  divisi: '',
  max_participants: 30,
  training_mode: 'online',
  personal_tier: 'starter',
  location: '',
})

const canSubmit = computed(() => form.title)

onMounted(() => {
  store.fetchPrograms()
  store.fetchStats()
})

function statusBadge(status: string) {
  const badges: Record<string, string> = {
    published: 'bg-emerald-500/80 text-white',
    draft: 'bg-amber-500/80 text-white',
    archived: 'bg-surface-500/80 text-white',
  }
  return badges[status] || 'bg-surface-500/80 text-white'
}

function trainingModeBadge(mode: string) {
  const badges: Record<string, string> = {
    online: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300',
    offline: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    hybrid: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  }
  return badges[mode] || 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400'
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
}

function refresh() {
  store.fetchPrograms({
    status: statusFilter.value || undefined,
    type: typeFilter.value || undefined,
    training_mode: trainingModeFilter.value || undefined,
    search: search.value || undefined,
  })
}

let debounceTimer: ReturnType<typeof setTimeout>
function debouncedSearch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => refresh(), 400)
}

function resetForm() {
  form.title = ''
  form.code = ''
  form.program_type = 'reguler'
  form.category = ''
  form.description = ''
  form.short_description = ''
  form.language = 'id'
  form.level = ''
  form.status = 'draft'
  form.duration_hours = 0
  form.duration_weeks = 0
  form.price = 0
  form.currency = 'IDR'
  form.standard_type = ''
  form.standard_issuer = ''
  form.prerequisites = ''
  form.learning_outcomes = []
  form.tags = []
  form.divisi = ''
  form.max_participants = 30
  form.training_mode = 'online'
  form.personal_tier = 'starter'
  form.location = ''
}

function closeModal() {
  showCreateModal.value = false
  editingId.value = null
  resetForm()
}

function goToEdit(p: Program) {
  window.open(`/programs/${p.id}/edit`, '_blank')
}

function openDetail(p: Program) {
  window.open(`/programs/${p.id}`, '_blank')
}

function confirmDelete(p: Program) {
  deletingProgram.value = p
  showDeleteModal.value = true
}

const typeMap: Record<string, string> = {
  reguler: 'REGULER',
  personal: 'PERSONAL',
  mentoring: 'MENTORING',
  corporate: 'CORPORATE',
}

function buildPayload() {
  const type = typeMap[form.program_type] || 'REGULER'
  const isOnline = form.training_mode === 'online' || form.training_mode === 'hybrid'
  const isOffline = form.training_mode === 'offline' || form.training_mode === 'hybrid'
  return {
    ...form,
    type,
    is_online: isOnline,
    is_offline: isOffline,
  }
}

async function handleSubmit() {
  if (!canSubmit.value || store.creating) return

  const payload = buildPayload()
  let result
  if (editingId.value) {
    result = await store.updateProgram(editingId.value, payload)
  } else {
    result = await store.createProgram(payload)
  }

  if (result?.success) {
    toast.success(editingId.value ? 'Program berhasil diupdate' : 'Program berhasil dibuat')
    closeModal()
  } else {
    toast.error(result?.message || 'Gagal menyimpan program')
  }
}

async function handleDelete() {
  if (!deletingProgram.value) return

  const result = await store.deleteProgram(deletingProgram.value.id)
  if (result?.success) {
    toast.success('Program berhasil dihapus')
    showDeleteModal.value = false
    deletingProgram.value = null
  } else {
    toast.error(result?.message || 'Gagal menghapus program')
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

<template>
  <div class="space-y-6">
    <!-- Loading skeleton -->
    <div v-if="lettersLoading" class="space-y-4">
      <div class="h-32 rounded-2xl bg-surface-100 dark:bg-surface-800 animate-pulse"></div>
      <div class="h-32 rounded-2xl bg-surface-100 dark:bg-surface-800 animate-pulse"></div>
    </div>

    <template v-else>
      <!-- ── Contracts Section ── -->
      <div
        class="rounded-2xl bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border border-surface-200/50 dark:border-surface-800/30 p-5 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
            <span class="w-1 h-4 rounded-full bg-indigo-500"></span>
            Kontrak Kerja
          </h3>
          <button v-if="auth.canManageStaff" @click="openContractForm(null)"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 flex items-center gap-1.5">
            <Plus :size="16" />
            Tambah Kontrak
          </button>
        </div>

        <div v-if="!contracts.length" class="text-center py-8">
          <FileText :size="32" class="mx-auto text-surface-300 dark:text-surface-600 mb-2" />
          <p class="text-sm text-surface-400">Belum ada kontrak kerja</p>
        </div>

        <div v-else class="space-y-3">
          <div v-for="c in contracts" :key="c.id"
            class="flex items-center gap-4 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200/50 dark:border-surface-700/50 hover:border-surface-300 dark:hover:border-surface-600 transition-colors">
            <div
              class="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
              <FileText :size="18" class="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <span class="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate">{{ c.contract_number }}</span>
                <span class="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0"
                  :class="contractStatusClass(c.status)">
                  {{ c.status }}
                </span>
              </div>
              <p class="text-xs text-surface-500">{{ c.contract_type }} &bull; {{ c.position || '-' }} &bull; {{ c.department || '-' }}</p>
              <p class="text-xs text-surface-400 mt-0.5">
                {{ formatDate(c.start_date) }} — {{ c.end_date ? formatDate(c.end_date) : 'Berkala' }}
              </p>
            </div>
            <div v-if="auth.canManageStaff" class="flex items-center gap-1 shrink-0">
              <button @click="viewContract(c)"
                class="p-1.5 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-400 hover:text-primary-500 transition-colors"
                title="Lihat Surat">
                <Eye :size="14" />
              </button>
              <button @click="openContractForm(c)"
                class="p-1.5 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
                title="Edit">
                <Pencil :size="14" />
              </button>
              <button @click="handleDeleteContract(c.id)"
                class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-surface-400 hover:text-red-500 transition-colors"
                title="Hapus">
                <Trash2 :size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Appointment Letters Section ── -->
      <div
        class="rounded-2xl bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border border-surface-200/50 dark:border-surface-800/30 p-5 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
            <span class="w-1 h-4 rounded-full bg-amber-500"></span>
            Surat Penunjukan
          </h3>
          <button v-if="auth.canManageStaff" @click="openAppointmentForm(null)"
            class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 flex items-center gap-1.5">
            <Plus :size="16" />
            Tambah Surat Penunjukan
          </button>
        </div>

        <div v-if="!appointmentLetters.length" class="text-center py-8">
          <FileText :size="32" class="mx-auto text-surface-300 dark:text-surface-600 mb-2" />
          <p class="text-sm text-surface-400">Belum ada surat penunjukan</p>
        </div>

        <div v-else class="space-y-3">
          <div v-for="a in appointmentLetters" :key="a.id"
            class="flex items-center gap-4 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200/50 dark:border-surface-700/50 hover:border-surface-300 dark:hover:border-surface-600 transition-colors">
            <div
              class="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
              <FileText :size="18" class="text-amber-600 dark:text-amber-400" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <span class="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate">{{ a.letter_number }}</span>
                <span class="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0"
                  :class="appointmentStatusClass(a.status)">
                  {{ a.status }}
                </span>
              </div>
              <p class="text-xs text-surface-500">{{ a.appointment_type }} &bull; {{ a.position || '-' }} &bull; {{ a.department || '-' }}</p>
              <p class="text-xs text-surface-400 mt-0.5">
                {{ formatDate(a.effective_date) }} — {{ a.end_date ? formatDate(a.end_date) : 'Berlaku Terus' }}
              </p>
            </div>
            <div v-if="auth.canManageStaff" class="flex items-center gap-1 shrink-0">
              <button @click="viewAppointment(a)"
                class="p-1.5 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-400 hover:text-primary-500 transition-colors"
                title="Lihat Surat">
                <Eye :size="14" />
              </button>
              <button @click="openAppointmentForm(a)"
                class="p-1.5 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
                title="Edit">
                <Pencil :size="14" />
              </button>
              <button @click="handleDeleteAppointment(a.id)"
                class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-surface-400 hover:text-red-500 transition-colors"
                title="Hapus">
                <Trash2 :size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Work Certificate Section ── -->
      <div
        class="rounded-2xl bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border border-surface-200/50 dark:border-surface-800/30 p-5 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
            <span class="w-1 h-4 rounded-full bg-emerald-500"></span>
            Surat Keterangan Kerja Aktif
          </h3>
          <button v-if="auth.canManageStaff" @click="openWorkCertForm(null)"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 flex items-center gap-1.5">
            <Plus :size="16" />
            Tambah Surat Keterangan
          </button>
        </div>

        <div v-if="!workCertificates.length" class="text-center py-8">
          <FileText :size="32" class="mx-auto text-surface-300 dark:text-surface-600 mb-2" />
          <p class="text-sm text-surface-400">Belum ada surat keterangan kerja aktif</p>
        </div>

        <div v-else class="space-y-3">
          <div v-for="wc in workCertificates" :key="wc.id"
            class="flex items-center gap-4 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200/50 dark:border-surface-700/50 hover:border-surface-300 dark:hover:border-surface-600 transition-colors">
            <div
              class="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
              <FileText :size="18" class="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <span class="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate">{{ wc.letter_number }}</span>
                <span class="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0"
                  :class="workCertStatusClass(wc.status)">
                  {{ wc.status }}
                </span>
              </div>
              <p class="text-xs text-surface-500">{{ wc.purpose || 'Keperluan umum' }} &bull; {{ wc.position || '-' }} &bull; {{ wc.department || '-' }}</p>
              <p class="text-xs text-surface-400 mt-0.5">
                Mulai bekerja: {{ formatDate(wc.start_date) }}
              </p>
            </div>
            <div v-if="auth.canManageStaff" class="flex items-center gap-1 shrink-0">
              <button @click="viewWorkCertificate(wc)"
                class="p-1.5 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-400 hover:text-primary-500 transition-colors"
                title="Lihat Surat">
                <Eye :size="14" />
              </button>
              <button @click="openWorkCertForm(wc)"
                class="p-1.5 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
                title="Edit">
                <Pencil :size="14" />
              </button>
              <button @click="handleDeleteWorkCertificate(wc.id)"
                class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-surface-400 hover:text-red-500 transition-colors"
                title="Hapus">
                <Trash2 :size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Termination Letter Section (Paklaring) ── -->
      <div
        class="rounded-2xl bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border border-surface-200/50 dark:border-surface-800/30 p-5 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
            <span class="w-1 h-4 rounded-full bg-red-500"></span>
            Surat Keterangan Kerja Non-Aktif (Paklaring)
          </h3>
          <button v-if="auth.canManageStaff" @click="openTerminationForm(null)"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 flex items-center gap-1.5">
            <Plus :size="16" />
            Tambah Paklaring
          </button>
        </div>

        <div v-if="!terminationLettersData.length" class="text-center py-8">
          <FileText :size="32" class="mx-auto text-surface-300 dark:text-surface-600 mb-2" />
          <p class="text-sm text-surface-400">Belum ada surat keterangan kerja non-aktif</p>
        </div>

        <div v-else class="space-y-3">
          <div v-for="tl in terminationLettersData" :key="tl.id"
            class="flex items-center gap-4 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200/50 dark:border-surface-700/50 hover:border-surface-300 dark:hover:border-surface-600 transition-colors">
            <div class="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
              <FileText :size="18" class="text-red-600 dark:text-red-400" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <span class="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate">{{ tl.letter_number }}</span>
                <span class="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0"
                  :class="terminationStatusClass(tl.status)">
                  {{ tl.status }}
                </span>
              </div>
              <p class="text-xs text-surface-500">{{ tl.termination_type }} &bull; {{ tl.position || '-' }} &bull; {{ tl.department || '-' }}</p>
              <p class="text-xs text-surface-400 mt-0.5">
                {{ formatDate(tl.start_date) }} — {{ formatDate(tl.end_date) }}
              </p>
            </div>
            <div v-if="auth.canManageStaff" class="flex items-center gap-1 shrink-0">
              <button @click="viewTerminationLetter(tl)"
                class="p-1.5 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-400 hover:text-primary-500 transition-colors"
                title="Lihat Surat">
                <Eye :size="14" />
              </button>
              <button @click="openTerminationForm(tl)"
                class="p-1.5 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
                title="Edit">
                <Pencil :size="14" />
              </button>
              <button @click="handleDeleteTermination(tl.id)"
                class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-surface-400 hover:text-red-500 transition-colors"
                title="Hapus">
                <Trash2 :size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ═══════════════════ Contract Form Modal ═══════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showContractModal" class="fixed inset-0 z-[90] flex items-center justify-center p-4"
          @click.self="showContractModal = false">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            class="relative w-full max-w-lg bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200/50 dark:border-surface-700/50 overflow-visible">
            <div class="flex items-center justify-between p-5 border-b border-surface-200/50 dark:border-surface-700/30">
              <h2 class="text-base font-bold text-surface-900 dark:text-surface-100">
                {{ editingContract ? 'Edit Kontrak Kerja' : 'Tambah Kontrak Kerja' }}
              </h2>
              <button @click="showContractModal = false" class="btn-ghost p-1.5 rounded-lg">
                <X :size="18" />
              </button>
            </div>

            <div class="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Nomor Kontrak <span class="text-red-500">*</span></label>
                  <input v-model="contractForm.contract_number" type="text" placeholder="PKWT-2026-001" required
                    class="input-field" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Jenis Kontrak <span class="text-red-500">*</span></label>
                  <select v-model="contractTypeSelect" @change="onContractTypeChange" class="input-field">
                    <option value="PKWT_3">PKWT 3 Bulan</option>
                    <option value="PKWT_6">PKWT 6 Bulan</option>
                    <option value="PKWT_12">PKWT 12 Bulan</option>
                    <option value="PKWT_24">PKWT 24 Bulan</option>
                    <option value="PKWT_CUSTOM">PKWT Custom</option>
                    <option value="PKWTT">PKWTT (Tetap)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Jabatan</label>
                  <input v-model="contractForm.position" type="text" placeholder="Jabatan" class="input-field" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Departemen</label>
                  <input v-model="contractForm.department" type="text" placeholder="Departemen" class="input-field" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tanggal Mulai <span class="text-red-500">*</span></label>
                  <input v-model="contractForm.start_date" type="date" required class="input-field" />
                </div>
                <div v-if="contractTypeSelect !== 'PKWTT'">
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">
                    Tanggal Berakhir
                    <span v-if="contractTypeSelect !== 'PKWT_CUSTOM'" class="text-xs font-normal text-surface-400">(Otomatis)</span>
                  </label>
                  <input v-model="contractForm.end_date" type="date" :disabled="contractTypeSelect !== 'PKWT_CUSTOM'"
                    class="input-field" :class="{ 'opacity-60 cursor-not-allowed': contractTypeSelect !== 'PKWT_CUSTOM' }" />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Rincian Upah (Rp)</label>
                  <div class="grid grid-cols-3 gap-3">
                    <div>
                      <label class="block text-[10px] font-medium text-surface-400 mb-1">Gaji Pokok</label>
                      <input v-model.number="contractForm.base_salary" type="number" placeholder="0" min="0"
                        class="input-field" />
                    </div>
                    <div>
                      <label class="block text-[10px] font-medium text-surface-400 mb-1">Tunjangan Tetap</label>
                      <input v-model.number="contractForm.fixed_allowance" type="number" placeholder="0" min="0"
                        class="input-field" />
                    </div>
                    <div>
                      <label class="block text-[10px] font-medium text-surface-400 mb-1">Tunjangan Tidak Tetap</label>
                      <input v-model.number="contractForm.variable_allowance" type="number" placeholder="0" min="0"
                        class="input-field" />
                    </div>
                  </div>
                  <p class="text-[10px] text-surface-400 mt-1">Total: Rp {{ formatSalaryTotal }}</p>
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Status</label>
                  <select v-model="contractForm.status" class="input-field">
                    <option value="DRAFT">Draft</option>
                    <option value="ACTIVE">Active</option>
                    <option value="EXPIRED">Expired</option>
                    <option value="TERMINATED">Terminated</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Jenis Tanda Tangan</label>
                  <select v-model="contractForm.signature_type" class="input-field">
                    <option value="traditional">Tradisional (Tanda Tangan Basah)</option>
                    <option value="qrcode">QR Code Verifikasi</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Catatan</label>
                <textarea v-model="contractForm.notes" rows="3" placeholder="Catatan tambahan..."
                  class="input-field resize-none"></textarea>
              </div>
            </div>

            <div
              class="flex items-center justify-end gap-3 p-5 border-t border-surface-200/50 dark:border-surface-700/30 bg-surface-50/50 dark:bg-surface-800/30">
              <button @click="showContractModal = false" class="btn-ghost px-4 py-2 text-sm font-semibold" :disabled="saving">
                Batal
              </button>
              <button @click="saveContract"
                :disabled="saving || !contractForm.contract_number || !contractForm.start_date"
                class="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-surface-300 dark:disabled:bg-surface-700 text-white text-sm font-bold rounded-xl transition-all duration-200 disabled:cursor-not-allowed">
                <div v-if="saving"
                  class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                {{ saving ? 'Menyimpan...' : (editingContract ? 'Perbarui' : 'Simpan') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ═══════════════════ Appointment Form Modal ═══════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showAppointmentModal" class="fixed inset-0 z-[90] flex items-center justify-center p-4"
          @click.self="showAppointmentModal = false">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            class="relative w-full max-w-lg bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200/50 dark:border-surface-700/50 overflow-visible">
            <div class="flex items-center justify-between p-5 border-b border-surface-200/50 dark:border-surface-700/30">
              <h2 class="text-base font-bold text-surface-900 dark:text-surface-100">
                {{ editingAppointment ? 'Edit Surat Penunjukan' : 'Tambah Surat Penunjukan' }}
              </h2>
              <button @click="showAppointmentModal = false" class="btn-ghost p-1.5 rounded-lg">
                <X :size="18" />
              </button>
            </div>

            <div class="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Nomor Surat <span class="text-red-500">*</span></label>
                  <input v-model="appointmentForm.letter_number" type="text" placeholder="SP-2026-001" required
                    class="input-field" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Jenis Surat <span class="text-red-500">*</span></label>
                  <select v-model="appointmentForm.appointment_type" class="input-field">
                    <option value="PENUNJUKAN">Penunjukan</option>
                    <option value="PERPINDAHAN">Perpindahan</option>
                    <option value="PENUGASAN">Penugasan</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Jabatan</label>
                  <input v-model="appointmentForm.position" type="text" placeholder="Jabatan" class="input-field" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Departemen</label>
                  <input v-model="appointmentForm.department" type="text" placeholder="Departemen" class="input-field" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tanggal Efektif <span class="text-red-500">*</span></label>
                  <input v-model="appointmentForm.effective_date" type="date" required class="input-field" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tanggal Berakhir</label>
                  <input v-model="appointmentForm.end_date" type="date" class="input-field" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Melapor Ke</label>
                  <input v-model="appointmentForm.reports_to" type="text" placeholder="Nama atasan" class="input-field" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Status</label>
                  <select v-model="appointmentForm.status" class="input-field">
                    <option value="DRAFT">Draft</option>
                    <option value="ACTIVE">Active</option>
                    <option value="REVOKED">Revoked</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Jenis Tanda Tangan</label>
                  <select v-model="appointmentForm.signature_type" class="input-field">
                    <option value="traditional">Tradisional (Tanda Tangan Basah)</option>
                    <option value="qrcode">QR Code Verifikasi</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Catatan</label>
                <textarea v-model="appointmentForm.notes" rows="3" placeholder="Catatan tambahan..."
                  class="input-field resize-none"></textarea>
              </div>
            </div>

            <div
              class="flex items-center justify-end gap-3 p-5 border-t border-surface-200/50 dark:border-surface-700/30 bg-surface-50/50 dark:bg-surface-800/30">
              <button @click="showAppointmentModal = false" class="btn-ghost px-4 py-2 text-sm font-semibold"
                :disabled="saving">
                Batal
              </button>
              <button @click="saveAppointment"
                :disabled="saving || !appointmentForm.letter_number || !appointmentForm.effective_date"
                class="inline-flex items-center gap-2 px-5 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-surface-300 dark:disabled:bg-surface-700 text-white text-sm font-bold rounded-xl transition-all duration-200 disabled:cursor-not-allowed">
                <div v-if="saving"
                  class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                {{ saving ? 'Menyimpan...' : (editingAppointment ? 'Perbarui' : 'Simpan') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ═══════════════════ Work Certificate Form Modal ═══════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showWorkCertModal" class="fixed inset-0 z-[90] flex items-center justify-center p-4"
          @click.self="showWorkCertModal = false">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            class="relative w-full max-w-lg bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200/50 dark:border-surface-700/50 overflow-visible">
            <div class="flex items-center justify-between p-5 border-b border-surface-200/50 dark:border-surface-700/30">
              <h2 class="text-base font-bold text-surface-900 dark:text-surface-100">
                {{ editingWorkCert ? 'Edit Surat Keterangan Kerja Aktif' : 'Tambah Surat Keterangan Kerja Aktif' }}
              </h2>
              <button @click="showWorkCertModal = false" class="btn-ghost p-1.5 rounded-lg">
                <X :size="18" />
              </button>
            </div>

            <div class="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Nomor Surat <span class="text-red-500">*</span></label>
                  <input v-model="workCertForm.letter_number" type="text" placeholder="SKK-2026-001" required
                    class="input-field" />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Keperluan Surat <span class="text-red-500">*</span></label>
                  <input v-model="workCertForm.purpose" type="text" placeholder="Syarat pengajuan finansial/visa/etc"
                    class="input-field" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Jabatan</label>
                  <input v-model="workCertForm.position" type="text" placeholder="Jabatan" class="input-field" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Departemen</label>
                  <input v-model="workCertForm.department" type="text" placeholder="Departemen" class="input-field" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tanggal Mulai Bekerja <span class="text-red-500">*</span></label>
                  <input v-model="workCertForm.start_date" type="date" required class="input-field" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Status</label>
                  <select v-model="workCertForm.status" class="input-field">
                    <option value="DRAFT">Draft</option>
                    <option value="ACTIVE">Active</option>
                    <option value="REVOKED">Revoked</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Jenis Tanda Tangan</label>
                  <select v-model="workCertForm.signature_type" class="input-field">
                    <option value="traditional">Tradisional (Tanda Tangan Basah)</option>
                    <option value="qrcode">QR Code Verifikasi</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Catatan</label>
                <textarea v-model="workCertForm.notes" rows="3" placeholder="Catatan tambahan..."
                  class="input-field resize-none"></textarea>
              </div>
            </div>

            <div
              class="flex items-center justify-end gap-3 p-5 border-t border-surface-200/50 dark:border-surface-700/30 bg-surface-50/50 dark:bg-surface-800/30">
              <button @click="showWorkCertModal = false" class="btn-ghost px-4 py-2 text-sm font-semibold"
                :disabled="saving">
                Batal
              </button>
              <button @click="saveWorkCertificate"
                :disabled="saving || !workCertForm.letter_number || !workCertForm.purpose || !workCertForm.start_date"
                class="inline-flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-surface-300 dark:disabled:bg-surface-700 text-white text-sm font-bold rounded-xl transition-all duration-200 disabled:cursor-not-allowed">
                <div v-if="saving"
                  class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                {{ saving ? 'Menyimpan...' : (editingWorkCert ? 'Perbarui' : 'Simpan') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ═══════════════════ Termination Letter Form Modal ═══════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showTerminationModal" class="fixed inset-0 z-[90] flex items-center justify-center p-4"
          @click.self="showTerminationModal = false">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            class="relative w-full max-w-lg bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200/50 dark:border-surface-700/50 overflow-visible">
            <div class="flex items-center justify-between p-5 border-b border-surface-200/50 dark:border-surface-700/30">
              <h2 class="text-base font-bold text-surface-900 dark:text-surface-100">
                {{ editingTermination ? 'Edit Paklaring' : 'Tambah Paklaring' }}
              </h2>
              <button @click="showTerminationModal = false" class="btn-ghost p-1.5 rounded-lg">
                <X :size="18" />
              </button>
            </div>

            <div class="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Nomor Surat <span class="text-red-500">*</span></label>
                  <input v-model="terminationForm.letter_number" type="text" placeholder="PKL-2026-001" required
                    class="input-field" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Alasan Berakhir <span class="text-red-500">*</span></label>
                  <select v-model="terminationForm.termination_type" class="input-field">
                    <option value="KONTRAK_BERAKHIR">Berakhirnya masa kontrak (PKWT)</option>
                    <option value="PENGUNDURAN_DIRI">Pengunduran diri secara baik-baik</option>
                    <option value="PHK">Pemutusan Hubungan Kerja</option>
                    <option value="LAINNYA">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Jabatan Terakhir</label>
                  <input v-model="terminationForm.position" type="text" placeholder="Jabatan" class="input-field" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Departemen</label>
                  <input v-model="terminationForm.department" type="text" placeholder="Departemen" class="input-field" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tanggal Mulai Bekerja <span class="text-red-500">*</span></label>
                  <input v-model="terminationForm.start_date" type="date" required class="input-field" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tanggal Berakhir Bekerja <span class="text-red-500">*</span></label>
                  <input v-model="terminationForm.end_date" type="date" required class="input-field" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Status</label>
                  <select v-model="terminationForm.status" class="input-field">
                    <option value="DRAFT">Draft</option>
                    <option value="ACTIVE">Active</option>
                    <option value="REVOKED">Revoked</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Jenis Tanda Tangan</label>
                  <select v-model="terminationForm.signature_type" class="input-field">
                    <option value="traditional">Tradisional (Tanda Tangan Basah)</option>
                    <option value="qrcode">QR Code Verifikasi</option>
                  </select>
                </div>
              </div>
              <div v-if="terminationForm.termination_type === 'LAINNYA'">
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Alasan Lainnya</label>
                <input v-model="terminationForm.reason" type="text" placeholder="Sebutkan alasan..." class="input-field" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Catatan</label>
                <textarea v-model="terminationForm.notes" rows="3" placeholder="Catatan tambahan..."
                  class="input-field resize-none"></textarea>
              </div>
            </div>

            <div
              class="flex items-center justify-end gap-3 p-5 border-t border-surface-200/50 dark:border-surface-700/30 bg-surface-50/50 dark:bg-surface-800/30">
              <button @click="showTerminationModal = false" class="btn-ghost px-4 py-2 text-sm font-semibold"
                :disabled="saving">
                Batal
              </button>
              <button @click="saveTerminationLetter"
                :disabled="saving || !terminationForm.letter_number || !terminationForm.start_date || !terminationForm.end_date"
                class="inline-flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 disabled:bg-surface-300 dark:disabled:bg-surface-700 text-white text-sm font-bold rounded-xl transition-all duration-200 disabled:cursor-not-allowed">
                <div v-if="saving"
                  class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                {{ saving ? 'Menyimpan...' : (editingTermination ? 'Perbarui' : 'Simpan') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ═══════════════════ Letter Viewer Modal ═══════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showLetterViewer" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click.self="showLetterViewer = false" />
          <div
            class="relative w-full max-w-[900px] max-h-[95vh] bg-white dark:bg-surface-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <!-- Header -->
            <div class="flex items-center justify-between px-5 py-3 border-b border-surface-200 dark:border-surface-700 shrink-0">
              <h2 class="text-sm font-bold text-surface-900 dark:text-surface-100">
                {{ viewingLetterType === 'contract' ? 'Surat Perjanjian Kerja' : viewingLetterType === 'work_certificate' ? 'Surat Keterangan Kerja Aktif' : viewingLetterType === 'termination' ? 'Surat Keterangan Kerja Non-Aktif' : 'Surat Penunjukan' }}
                <template v-if="contractLetterData"> — {{ contractLetterData.contract_number }}</template>
                <template v-else-if="appointmentLetterData"> — {{ appointmentLetterData.letter_number }}</template>
                <template v-else-if="workCertificateData"> — {{ workCertificateData.letter_number }}</template>
                <template v-else-if="terminationLetterData"> — {{ terminationLetterData.letter_number }}</template>
              </h2>
              <div class="flex items-center gap-2">
                <button @click="exportLetterPdf" :disabled="letterExporting"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 dark:disabled:bg-surface-700 text-white text-xs font-bold rounded-lg transition-all disabled:cursor-not-allowed">
                  <FileText v-if="!letterExporting" :size="13" />
                  <Loader2 v-else :size="13" class="animate-spin" />
                  Download PDF
                </button>
                <button @click="showLetterViewer = false"
                  class="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                  <X :size="18" />
                </button>
              </div>
            </div>
            <!-- Body -->
            <div class="flex-1 overflow-auto p-5 bg-surface-50 dark:bg-surface-800/50">
              <div class="flex justify-center">
                <div ref="letterViewerRef" class="letter-viewer-content">
                  <ContractLetterTemplate v-if="contractLetterData" :data="contractLetterData" />
                  <AppointmentLetterTemplate v-if="appointmentLetterData" :data="appointmentLetterData" />
                  <WorkCertificateTemplate v-if="workCertificateData" :data="workCertificateData" />
                  <TerminationLetterTemplate v-if="terminationLetterData" :data="terminationLetterData" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, type Ref } from 'vue'
import { X, Plus, FileText, Pencil, Trash2, Eye, Loader2 } from 'lucide-vue-next'
import { useStaffLettersStore } from '@/stores/staffLetters'
import { useStaffManagementStore } from '@/stores/staffManagement'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import ContractLetterTemplate from '@/components/letters/ContractLetterTemplate.vue'
import AppointmentLetterTemplate from '@/components/letters/AppointmentLetterTemplate.vue'
import WorkCertificateTemplate from '@/components/letters/WorkCertificateTemplate.vue'
import TerminationLetterTemplate from '@/components/letters/TerminationLetterTemplate.vue'
import type { StaffContract, StaffAppointmentLetter, StaffWorkCertificate, StaffTerminationLetter } from '@/types'
import { useLetterExport } from '@/composables/useLetterExport'

const props = defineProps<{
  staffId: string
}>()

const auth = useAuthStore()
const lettersStore = useStaffLettersStore()
const store = useStaffManagementStore()
const toast = useToast()

const detail = computed(() => store.staffDetail)
const saving = ref(false)

// ── Letters computed ──
const lettersLoading = computed(() => lettersStore.loading)
const contracts = computed(() => lettersStore.contracts)
const appointmentLetters = computed(() => lettersStore.appointments)
const workCertificates = computed(() => lettersStore.workCertificates)
const terminationLettersData = computed(() => lettersStore.terminationLetters)

// ── Contract Form ──
const showContractModal = ref(false)
const editingContract = ref<any>(null)
const contractForm = ref({
  contract_number: '',
  contract_type: 'PKWT',
  position: '',
  department: '',
  start_date: '',
  end_date: '',
  salary: null as number | null,
  base_salary: null as number | null,
  fixed_allowance: null as number | null,
  variable_allowance: null as number | null,
  signature_type: 'traditional',
  notes: '',
  status: 'DRAFT',
})

const formatSalaryTotal = computed(() => {
  const base = contractForm.value.base_salary || 0
  const fixed = contractForm.value.fixed_allowance || 0
  const variable = contractForm.value.variable_allowance || 0
  const total = base + fixed + variable
  return total ? new Intl.NumberFormat('id-ID').format(total) : '0'
})

const contractTypeSelect = ref('PKWT_3')

function onContractTypeChange() {
  if (contractTypeSelect.value === 'PKWTT') {
    contractForm.value.contract_type = 'PKWTT'
    contractForm.value.end_date = ''
  } else if (contractTypeSelect.value === 'PKWT_CUSTOM') {
    contractForm.value.contract_type = 'PKWT'
  } else {
    contractForm.value.contract_type = 'PKWT'
    const months = parseInt(contractTypeSelect.value.split('_')[1])
    if (contractForm.value.start_date && months) {
      const start = new Date(contractForm.value.start_date)
      start.setMonth(start.getMonth() + months)
      contractForm.value.end_date = start.toISOString().split('T')[0]
    }
  }
}

watch(() => contractForm.value.start_date, () => {
  if (contractTypeSelect.value !== 'PKWT_CUSTOM' && contractTypeSelect.value !== 'PKWTT') {
    onContractTypeChange()
  }
})

// ── Appointment Form ──
const showAppointmentModal = ref(false)
const editingAppointment = ref<any>(null)
const appointmentForm = ref({
  letter_number: '',
  appointment_type: 'PENUNJUKAN',
  position: '',
  department: '',
  effective_date: '',
  end_date: '',
  reports_to: '',
  signature_type: 'traditional',
  notes: '',
  status: 'DRAFT',
})

// ── Work Certificate Form ──
const showWorkCertModal = ref(false)
const editingWorkCert = ref<any>(null)
const workCertForm = ref({
  letter_number: '',
  certificate_type: 'AKTIF',
  purpose: '',
  position: '',
  department: '',
  start_date: '',
  signature_type: 'traditional',
  notes: '',
  status: 'DRAFT',
})

// ── Termination Letter Form ──
const showTerminationModal = ref(false)
const editingTermination = ref<any>(null)
const terminationForm = ref({
  letter_number: '',
  termination_type: 'KONTRAK_BERAKHIR',
  position: '',
  department: '',
  start_date: '',
  end_date: '',
  reason: '',
  signature_type: 'traditional',
  notes: '',
  status: 'DRAFT',
})

// ── Letter Viewer ──
const showLetterViewer = ref(false)
const viewingLetterType = ref<'contract' | 'appointment' | 'work_certificate' | 'termination'>('contract')
const viewingLetterData = ref<StaffContract | StaffAppointmentLetter | StaffWorkCertificate | StaffTerminationLetter | null>(null)
const letterViewerRef = ref<HTMLElement | null>(null)
const letterExporting = ref(false)

const contractLetterData = computed(() =>
  viewingLetterType.value === 'contract' ? viewingLetterData.value as StaffContract : null
)
const appointmentLetterData = computed(() =>
  viewingLetterType.value === 'appointment' ? viewingLetterData.value as StaffAppointmentLetter : null
)
const workCertificateData = computed(() =>
  viewingLetterType.value === 'work_certificate' ? viewingLetterData.value as StaffWorkCertificate : null
)
const terminationLetterData = computed(() =>
  viewingLetterType.value === 'termination' ? viewingLetterData.value as StaffTerminationLetter : null
)

const { exportLetterPdf } = useLetterExport({
  letterViewerRef,
  letterExporting,
  viewingLetterType,
  contractLetterData,
  appointmentLetterData,
  workCertificateData,
  terminationLetterData,
  authToken: computed(() => auth.token ?? '') as Ref<string>,
})

function viewContract(contract: StaffContract) {
  viewingLetterType.value = 'contract'
  viewingLetterData.value = { ...contract, staff_name: detail.value?.full_name || '' }
  showLetterViewer.value = true
}

function viewAppointment(appointment: StaffAppointmentLetter) {
  viewingLetterType.value = 'appointment'
  viewingLetterData.value = { ...appointment, staff_name: detail.value?.full_name || '' }
  showLetterViewer.value = true
}

function viewWorkCertificate(cert: StaffWorkCertificate) {
  viewingLetterType.value = 'work_certificate'
  viewingLetterData.value = { ...cert, staff_name: detail.value?.full_name || '' }
  showLetterViewer.value = true
}

function viewTerminationLetter(term: StaffTerminationLetter) {
  viewingLetterType.value = 'termination'
  viewingLetterData.value = { ...term, staff_name: detail.value?.full_name || '' }
  showLetterViewer.value = true
}

// ── Status classes ──
function contractStatusClass(status: string) {
  switch (status) {
    case 'ACTIVE': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    case 'EXPIRED': return 'bg-surface-200 text-surface-600 dark:bg-surface-700 dark:text-surface-400'
    case 'TERMINATED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    case 'CANCELLED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    default: return 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
  }
}

function appointmentStatusClass(status: string) {
  switch (status) {
    case 'ACTIVE': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    case 'REVOKED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    case 'CANCELLED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    default: return 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
  }
}

function workCertStatusClass(status: string) {
  switch (status) {
    case 'ACTIVE': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    case 'REVOKED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    case 'CANCELLED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    default: return 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
  }
}

function terminationStatusClass(status: string) {
  switch (status) {
    case 'ACTIVE': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    case 'REVOKED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    case 'CANCELLED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    default: return 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
}

// ── Form openers ──
function openContractForm(contract: any) {
  if (contract) {
    editingContract.value = contract
    contractForm.value = {
      contract_number: contract.contract_number,
      contract_type: contract.contract_type,
      position: contract.position || '',
      department: contract.department || '',
      start_date: contract.start_date ? contract.start_date.split('T')[0] : '',
      end_date: contract.end_date ? contract.end_date.split('T')[0] : '',
      salary: contract.salary,
      base_salary: contract.base_salary || null,
      fixed_allowance: contract.fixed_allowance || null,
      variable_allowance: contract.variable_allowance || null,
      signature_type: contract.signature_type || 'traditional',
      notes: contract.notes || '',
      status: contract.status,
    }
    if (contract.contract_type === 'PKWTT') {
      contractTypeSelect.value = 'PKWTT'
    } else if (contract.end_date && contract.start_date) {
      const start = new Date(contract.start_date)
      const end = new Date(contract.end_date)
      const months = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30))
      if ([3, 6, 12, 24].includes(months)) {
        contractTypeSelect.value = `PKWT_${months}`
      } else {
        contractTypeSelect.value = 'PKWT_CUSTOM'
      }
    } else {
      contractTypeSelect.value = 'PKWT_CUSTOM'
    }
  } else {
    editingContract.value = null
    contractTypeSelect.value = 'PKWT_3'
    contractForm.value = {
      contract_number: `PKWT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      contract_type: 'PKWT',
      position: detail.value?.position || '',
      department: detail.value?.department || '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      salary: null,
      base_salary: null,
      fixed_allowance: null,
      variable_allowance: null,
      signature_type: 'traditional',
      notes: '',
      status: 'DRAFT',
    }
    onContractTypeChange()
  }
  showContractModal.value = true
}

function openAppointmentForm(appointment: any) {
  if (appointment) {
    editingAppointment.value = appointment
    appointmentForm.value = {
      letter_number: appointment.letter_number,
      appointment_type: appointment.appointment_type,
      position: appointment.position || '',
      department: appointment.department || '',
      effective_date: appointment.effective_date ? appointment.effective_date.split('T')[0] : '',
      end_date: appointment.end_date ? appointment.end_date.split('T')[0] : '',
      reports_to: appointment.reports_to || '',
      signature_type: appointment.signature_type || 'traditional',
      notes: appointment.notes || '',
      status: appointment.status,
    }
  } else {
    editingAppointment.value = null
    appointmentForm.value = {
      letter_number: `SP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      appointment_type: 'PENUNJUKAN',
      position: detail.value?.position || '',
      department: detail.value?.department || '',
      effective_date: new Date().toISOString().split('T')[0],
      end_date: '',
      reports_to: '',
      signature_type: 'traditional',
      notes: '',
      status: 'DRAFT',
    }
  }
  showAppointmentModal.value = true
}

function openWorkCertForm(cert: any) {
  if (cert) {
    editingWorkCert.value = cert
    workCertForm.value = {
      letter_number: cert.letter_number,
      certificate_type: cert.certificate_type,
      purpose: cert.purpose || '',
      position: cert.position || '',
      department: cert.department || '',
      start_date: cert.start_date ? cert.start_date.split('T')[0] : '',
      signature_type: cert.signature_type || 'traditional',
      notes: cert.notes || '',
      status: cert.status,
    }
  } else {
    editingWorkCert.value = null
    workCertForm.value = {
      letter_number: `SKK-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      certificate_type: 'AKTIF',
      purpose: '',
      position: detail.value?.position || '',
      department: detail.value?.department || '',
      start_date: new Date().toISOString().split('T')[0],
      signature_type: 'traditional',
      notes: '',
      status: 'DRAFT',
    }
  }
  showWorkCertModal.value = true
}

function openTerminationForm(term: any) {
  if (term) {
    editingTermination.value = term
    terminationForm.value = {
      letter_number: term.letter_number,
      termination_type: term.termination_type,
      position: term.position || '',
      department: term.department || '',
      start_date: term.start_date ? term.start_date.split('T')[0] : '',
      end_date: term.end_date ? term.end_date.split('T')[0] : '',
      reason: term.reason || '',
      signature_type: term.signature_type || 'traditional',
      notes: term.notes || '',
      status: term.status,
    }
  } else {
    editingTermination.value = null
    terminationForm.value = {
      letter_number: `PKL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      termination_type: 'KONTRAK_BERAKHIR',
      position: detail.value?.position || '',
      department: detail.value?.department || '',
      start_date: '',
      end_date: new Date().toISOString().split('T')[0],
      reason: '',
      signature_type: 'traditional',
      notes: '',
      status: 'DRAFT',
    }
  }
  showTerminationModal.value = true
}

// ── Delete handlers ──
async function handleDeleteContract(contractId: string) {
  if (!confirm('Hapus kontrak ini?')) return
  try {
    await lettersStore.deleteContract(props.staffId, contractId)
  } catch { /* silent */ }
}

async function handleDeleteAppointment(appointmentId: string) {
  if (!confirm('Hapus surat penunjukan ini?')) return
  try {
    await lettersStore.deleteAppointment(props.staffId, appointmentId)
  } catch { /* silent */ }
}

async function handleDeleteWorkCertificate(certId: string) {
  if (!confirm('Hapus surat keterangan kerja ini?')) return
  try {
    await lettersStore.deleteWorkCertificate(props.staffId, certId)
  } catch { /* silent */ }
}

async function handleDeleteTermination(termId: string) {
  if (!confirm('Hapus paklaring ini?')) return
  try {
    await lettersStore.deleteTerminationLetter(props.staffId, termId)
  } catch { /* silent */ }
}

// ── Save handlers ──
async function saveContract() {
  saving.value = true
  try {
    if (editingContract.value) {
      await lettersStore.updateContract(props.staffId, editingContract.value.id, contractForm.value)
    } else {
      await lettersStore.createContract(props.staffId, contractForm.value)
    }
    showContractModal.value = false
    toast.success('Berhasil', editingContract.value ? 'Kontrak diperbarui' : 'Kontrak ditambahkan')
  } catch (err: any) {
    toast.error('Gagal', err.message || 'Terjadi kesalahan')
  } finally {
    saving.value = false
  }
}

async function saveAppointment() {
  saving.value = true
  try {
    if (editingAppointment.value) {
      await lettersStore.updateAppointment(props.staffId, editingAppointment.value.id, appointmentForm.value)
    } else {
      await lettersStore.createAppointment(props.staffId, appointmentForm.value)
    }
    showAppointmentModal.value = false
    toast.success('Berhasil', editingAppointment.value ? 'Surat diperbarui' : 'Surat ditambahkan')
  } catch (err: any) {
    toast.error('Gagal', err.message || 'Terjadi kesalahan')
  } finally {
    saving.value = false
  }
}

async function saveWorkCertificate() {
  saving.value = true
  try {
    if (editingWorkCert.value) {
      await lettersStore.updateWorkCertificate(props.staffId, editingWorkCert.value.id, workCertForm.value)
    } else {
      await lettersStore.createWorkCertificate(props.staffId, workCertForm.value)
    }
    showWorkCertModal.value = false
    toast.success('Berhasil', editingWorkCert.value ? 'Surat diperbarui' : 'Surat ditambahkan')
  } catch (err: any) {
    toast.error('Gagal', err.message || 'Terjadi kesalahan')
  } finally {
    saving.value = false
  }
}

async function saveTerminationLetter() {
  saving.value = true
  try {
    if (editingTermination.value) {
      await lettersStore.updateTerminationLetter(props.staffId, editingTermination.value.id, terminationForm.value)
    } else {
      await lettersStore.createTerminationLetter(props.staffId, terminationForm.value)
    }
    showTerminationModal.value = false
    toast.success('Berhasil', editingTermination.value ? 'Surat diperbarui' : 'Surat ditambahkan')
  } catch (err: any) {
    toast.error('Gagal', err.message || 'Terjadi kesalahan')
  } finally {
    saving.value = false
  }
}

// ── Lazy fetch letters on mount ──
onMounted(async () => {
  await Promise.all([
    lettersStore.fetchContracts(props.staffId),
    lettersStore.fetchAppointments(props.staffId),
    lettersStore.fetchWorkCertificates(props.staffId),
    lettersStore.fetchTerminationLetters(props.staffId),
  ])
})
</script>

<style scoped>
.letter-viewer-content {
  display: inline-flex;
  flex-direction: column;
}

.letter-viewer-content :deep(.a4-page) {
  box-shadow: none;
  border-radius: 0;
}
</style>

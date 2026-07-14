<template>
  <div class="space-y-6">
    <!-- Basic Info -->
    <div class="card p-5 sm:p-6">
      <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 mb-4 flex items-center gap-2">
        <User :size="16" class="text-primary-500" />
        Informasi Dasar
      </h3>

      <!-- Photo Selector -->
      <div class="flex items-center gap-5 mb-6 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/40 border border-surface-100 dark:border-surface-700/50">
        <div class="relative w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl font-bold ring-2 ring-white dark:ring-surface-900 shadow-lg group/avatar shrink-0">
          <img v-if="photoPreview || cv.avatar_url" :src="photoPreview || cv.avatar_url" class="w-full h-full object-cover" />
          <span v-else class="select-none">{{ getPhotoInitials() }}</span>
          <div @click="fileInput?.click()" class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
            <Camera :size="20" class="text-white" />
          </div>
        </div>
        <input ref="fileInput" type="file" class="hidden" accept="image/jpeg,image/png,image/jpg,image/webp" @change="onPhotoSelect" />

        <div class="flex-1 min-w-0">
          <p class="text-xs font-bold text-surface-700 dark:text-surface-300 mb-2">Foto Profil CV</p>
          <div class="flex flex-wrap gap-2">
            <button v-if="profileAvatar" @click="useProfilePhoto"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-all"
              :class="cv.avatar_url === profileAvatar && !photoPreview
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 ring-1 ring-primary-300 dark:ring-primary-700'
                : 'bg-white dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-600 border border-surface-200 dark:border-surface-600'">
              <UserCircle :size="12" />
              Foto Profil
            </button>
            <button @click="fileInput?.click()"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-white dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-600 border border-surface-200 dark:border-surface-600 transition-all">
              <Upload :size="12" />
              Upload Baru
            </button>
            <button v-if="cv.avatar_url || photoPreview" @click="clearPhoto"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all">
              <X :size="12" />
              Hapus
            </button>
          </div>
        </div>
      </div>

      <div v-if="showFocalCropper && (photoPreview || cv.avatar_url)" class="mb-6">
        <FocalPointCropper
          :image-url="photoPreview || cv.avatar_url!"
          :output-size="400"
          @update:cropped-blob="onCroppedBlob"
        />
        <div v-if="croppedBlob" class="flex items-center gap-2 mt-3">
          <button @click="uploadPhoto" :disabled="uploadingPhoto" class="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 text-white text-xs font-bold rounded-xl transition-all">
            <Loader2 v-if="uploadingPhoto" :size="14" class="animate-spin" />
            <Check v-else :size="14" />
            {{ uploadingPhoto ? 'Mengupload...' : 'Simpan Foto' }}
          </button>
          <button @click="cancelCrop" class="px-4 py-2 bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 text-xs font-semibold rounded-xl hover:bg-surface-200 dark:hover:bg-surface-600 transition-all">
            Batal
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Nama Lengkap</label>
          <input v-model="cv.full_name" type="text" placeholder="Nama lengkap" class="w-full px-3.5 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Email</label>
          <input v-model="cv.email" type="email" placeholder="email@akman.com" class="w-full px-3.5 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Phone</label>
          <input v-model="cv.phone" type="text" placeholder="Nomor telepon" class="w-full px-3.5 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Posisi / Jabatan <span class="normal-case font-normal text-surface-400">(Opsional)</span></label>
          <input v-model="cv.position" type="text" placeholder="Manager, Staff, dll — opsional" class="w-full px-3.5 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tanggal Lahir <span class="normal-case font-normal text-surface-400">(Opsional)</span></label>
          <input v-model="cv.date_of_birth" type="date" placeholder="Tanggal lahir" class="w-full px-3.5 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tempat Lahir <span class="normal-case font-normal text-surface-400">(Opsional)</span></label>
          <input v-model="cv.birth_place" type="text" placeholder="Kota kelahiran" class="w-full px-3.5 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Ringkasan Profesional</label>
          <textarea v-model="cv.summary" rows="3" placeholder="Tulis ringkasan singkat tentang diri Anda..." class="w-full px-3.5 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all resize-none"></textarea>
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Departemen <span class="normal-case font-normal text-surface-400">(Opsional)</span></label>
          <input v-model="cv.department" type="text" placeholder="Departemen" class="w-full px-3.5 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
        </div>
        <div class="sm:col-span-2">
          <p class="text-xs text-surface-400 flex items-center gap-1.5 bg-surface-50 dark:bg-surface-800/40 px-3 py-2 rounded-xl border border-surface-100 dark:border-surface-700/50">
            <Info :size="12" class="shrink-0 text-primary-400" />
            Data di atas diambil otomatis dari profil Anda. Anda bisa mengubahnya khusus untuk CV ini tanpa mempengaruhi profil utama.
          </p>
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Template CV</label>
          <select v-model="cv.template" class="w-full px-3.5 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all">
            <option value="modern">Modern Clean</option>
            <option value="akman-academy">Akman Academy</option>
            <option value="executive">Executive</option>
            <option value="minimalist">Minimalist</option>
            <option value="creative">Creative</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Summary / Ringkasan -->

    <!-- Education -->
    <CvFormSection title="Pendidikan" :icon="GraduationCap" :items="cv.education" @add="cvStore.addEducation(cv)" @remove="cvStore.removeEducation(cv, $event)">
      <template #fields="{ item }">
        <div>
          <label class="block text-xs font-semibold text-surface-500 mb-1">Institusi</label>
          <input v-model="item.institution" type="text" placeholder="Nama universitas/sekolah" class="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-surface-500 mb-1">Gelar</label>
          <input v-model="item.degree" type="text" placeholder="S1, D3, SMA" class="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-surface-500 mb-1">Jurusan</label>
          <input v-model="item.field_of_study" type="text" placeholder="Teknik Informatika" class="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-semibold text-surface-500 mb-1">Tahun Mulai</label>
            <input v-model="item.start_year" type="text" placeholder="2018" class="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-surface-500 mb-1">Tahun Selesai</label>
            <input v-model="item.end_year" type="text" placeholder="2022" class="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
          </div>
        </div>
      </template>
    </CvFormSection>

    <!-- Experience -->
    <CvFormSection title="Pengalaman Kerja" :icon="Briefcase" :items="cv.experience" @add="cvStore.addExperience(cv)" @remove="cvStore.removeExperience(cv, $event)">
      <template #fields="{ item }">
        <div>
          <label class="block text-xs font-semibold text-surface-500 mb-1">Perusahaan</label>
          <input v-model="item.company" type="text" placeholder="Nama perusahaan" class="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-surface-500 mb-1">Posisi</label>
          <input v-model="item.position" type="text" placeholder="Jabatan" class="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-xs font-semibold text-surface-500 mb-1">Deskripsi</label>
          <textarea v-model="item.description" rows="2" placeholder="Tanggung jawab dan pencapaian..." class="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all resize-none"></textarea>
        </div>
        <div>
          <label class="block text-xs font-semibold text-surface-500 mb-1">Tanggal Mulai</label>
          <input v-model="item.start_date" type="text" placeholder="2020-01" class="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
        </div>
        <div class="flex items-end gap-2">
          <div class="flex-1">
            <label class="block text-xs font-semibold text-surface-500 mb-1">Tanggal Selesai</label>
            <input v-model="item.end_date" type="text" placeholder="2023-12" :disabled="item.current" class="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed" />
          </div>
          <label class="flex items-center gap-1.5 pb-2 cursor-pointer">
            <input type="checkbox" v-model="item.current" class="rounded border-surface-300 text-primary-500 focus:ring-primary-500/30" />
            <span class="text-xs text-surface-500">Saat ini</span>
          </label>
        </div>
      </template>
    </CvFormSection>

    <!-- Skills -->
    <div class="card p-5 sm:p-6">
      <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 mb-4 flex items-center gap-2">
        <Zap :size="16" class="text-primary-500" />
        Keahlian
      </h3>

      <div v-if="cv.skill_details.length > 0" class="space-y-3 mb-4">
        <div v-for="(skill, idx) in cv.skill_details" :key="idx" class="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700/50">
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm font-semibold text-surface-800 dark:text-surface-200">{{ skill.name }}</span>
              <span class="text-xs font-bold text-primary-600 dark:text-primary-400 min-w-[2.5rem] text-right">{{ skill.percentage }}%</span>
            </div>
            <input type="range" min="0" max="100" v-model.number="skill.percentage" class="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-surface-200 dark:bg-surface-600 accent-primary-600" />
          </div>
          <button @click="removeSkill(idx)" class="shrink-0 p-1.5 rounded-lg text-surface-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all">
            <X :size="14" />
          </button>
        </div>
      </div>
      <p v-else class="text-sm text-surface-400 text-center py-3">Belum ada keahlian</p>

      <div class="flex gap-2">
        <input v-model="newSkillName" type="text" placeholder="Tambah keahlian (enter)" @keydown.enter.prevent="addSkill" class="flex-1 px-3.5 py-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
        <button @click="addSkill" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all">Tambah</button>
      </div>
    </div>

    <!-- Certifications -->
    <div class="card p-5 sm:p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
          <Award :size="16" class="text-primary-500" />
          Sertifikasi
        </h3>
        <button @click="addCertification" class="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors">
          <Plus :size="14" />
          Tambah
        </button>
      </div>

      <div v-if="cv.certifications.length === 0" class="text-center py-6">
        <p class="text-sm text-surface-400">Belum ada sertifikasi</p>
      </div>

      <div v-for="(cert, idx) in cv.certifications" :key="cert.id" class="group relative">
        <div v-if="idx > 0" class="h-px bg-surface-100 dark:bg-surface-800 my-4"></div>
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-surface-500 mb-1">Nama Sertifikasi</label>
              <input v-model="cert.name" type="text" placeholder="Nama sertifikat" class="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-surface-500 mb-1">Penerbit</label>
              <input v-model="cert.issuer" type="text" placeholder="Lembaga/instansi" class="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-surface-500 mb-1">Tanggal</label>
              <input v-model="cert.date" type="text" placeholder="2024" class="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
            </div>
          </div>
          <button @click="removeCertification(cert.id)" class="shrink-0 p-1.5 rounded-lg text-surface-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 opacity-0 group-hover:opacity-100 transition-all">
            <Trash2 :size="16" />
          </button>
        </div>
      </div>
    </div>

    <!-- Languages -->
    <div class="card p-5 sm:p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
          <Globe :size="16" class="text-primary-500" />
          Bahasa
        </h3>
        <button @click="addLanguage" class="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors">
          <Plus :size="14" />
          Tambah
        </button>
      </div>

      <div v-if="cv.languages.length === 0" class="text-center py-6">
        <p class="text-sm text-surface-400">Belum ada bahasa</p>
      </div>

      <div v-for="(lang, idx) in cv.languages" :key="lang.id" class="group relative">
        <div v-if="idx > 0" class="h-px bg-surface-100 dark:bg-surface-800 my-4"></div>
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-surface-500 mb-1">Bahasa</label>
              <input v-model="lang.name" type="text" placeholder="Indonesia, English, dll" class="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-surface-500 mb-1">Tingkat Penguasaan</label>
              <select v-model="lang.level" class="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all">
                <option value="dasar">Dasar (Beginner)</option>
                <option value="menengah">Menengah (Intermediate)</option>
                <option value="lancar">Lancar (Fluent)</option>
              </select>
            </div>
          </div>
          <button @click="removeLanguage(lang.id)" class="shrink-0 p-1.5 rounded-lg text-surface-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 opacity-0 group-hover:opacity-100 transition-all">
            <Trash2 :size="16" />
          </button>
        </div>
      </div>
    </div>

    <!-- Social Media -->
    <div class="card p-5 sm:p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
          <Link :size="16" class="text-primary-500" />
          Media Sosial <span class="normal-case font-normal text-surface-400">(Opsional)</span>
        </h3>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-surface-500 mb-1">Facebook</label>
          <input v-model="socialMedia.facebook" type="url" placeholder="https://facebook.com/..." class="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-surface-500 mb-1">Instagram</label>
          <input v-model="socialMedia.instagram" type="url" placeholder="https://instagram.com/..." class="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-surface-500 mb-1">TikTok</label>
          <input v-model="socialMedia.tiktok" type="url" placeholder="https://tiktok.com/..." class="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-surface-500 mb-1">YouTube</label>
          <input v-model="socialMedia.youtube" type="url" placeholder="https://youtube.com/..." class="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-surface-500 mb-1">WhatsApp</label>
          <input v-model="socialMedia.whatsapp" type="text" placeholder="6281234567890" class="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-surface-500 mb-1">LinkedIn</label>
          <input v-model="socialMedia.linkedin" type="url" placeholder="https://linkedin.com/in/..." class="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-surface-500 mb-1">Twitter / X</label>
          <input v-model="socialMedia.twitter" type="url" placeholder="https://x.com/..." class="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-surface-500 mb-1">GitHub</label>
          <input v-model="socialMedia.github" type="url" placeholder="https://github.com/..." class="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRef, computed } from 'vue'
import { User, GraduationCap, Briefcase, Zap, Award, Globe, Plus, Trash2, X, Info, Camera, Upload, UserCircle, Link, Check, Loader2 } from 'lucide-vue-next'
import { useCvStore } from '@/stores/cv'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { useApi } from '@/composables/useApi'
import CvFormSection from './CvFormSection.vue'
import FocalPointCropper from '@/components/profile/FocalPointCropper.vue'
import type { CV, Certification, CVSkillDetail } from '@/types'

const cvStore = useCvStore()
const auth = useAuthStore()
const toast = useToast()

const props = defineProps<{
  cv: CV
}>()

const cv = toRef(props, 'cv')

const socialMedia = computed({
  get: () => cv.value.social_media || {},
  set: (val) => { cv.value.social_media = val }
})

const newSkillName = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const photoPreview = ref<string | null>(null)
const showFocalCropper = ref(false)
const croppedBlob = ref<Blob | null>(null)
const uploadingPhoto = ref(false)

const profileAvatar = computed(() => auth.user?.profile?.avatar_url || '')

function getPhotoInitials() {
  const name = cv.value.full_name || ''
  const parts = name.replace(/[^a-zA-Z\s]/g, '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'CV'
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

function useProfilePhoto() {
  if (photoPreview.value) {
    URL.revokeObjectURL(photoPreview.value)
    photoPreview.value = null
  }
  cv.value.avatar_url = profileAvatar.value
}

function onPhotoSelect(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    const file = target.files[0]
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Gagal', 'Ukuran foto maksimal 5 MB')
      return
    }
    if (photoPreview.value) URL.revokeObjectURL(photoPreview.value)
    photoPreview.value = URL.createObjectURL(file)
    showFocalCropper.value = true
    croppedBlob.value = null
  }
}

function onCroppedBlob(blob: Blob | null) {
  croppedBlob.value = blob
}

function clearPhoto() {
  if (photoPreview.value) {
    URL.revokeObjectURL(photoPreview.value)
    photoPreview.value = null
  }
  cv.value.avatar_url = ''
  showFocalCropper.value = false
  croppedBlob.value = null
}

function cancelCrop() {
  showFocalCropper.value = false
  croppedBlob.value = null
}

async function uploadPhoto() {
  if (!croppedBlob.value) return
  uploadingPhoto.value = true
  try {
    const formData = new FormData()
    const file = new File([croppedBlob.value], 'cv-photo.jpg', { type: 'image/jpeg' })
    formData.append('file', file)

    const res: any = await useApi('/staff/cv/upload-photo', {
      method: 'POST',
      body: formData,
    })

    if (res.success && res.data?.url) {
      cv.value.avatar_url = res.data.url
      showFocalCropper.value = false
      croppedBlob.value = null
      if (photoPreview.value) {
        URL.revokeObjectURL(photoPreview.value)
        photoPreview.value = null
      }
      toast.success('Berhasil', 'Foto CV berhasil diupload')
    } else {
      throw new Error(res.message || 'Gagal upload foto')
    }
  } catch (err: any) {
    toast.error('Gagal', err.message || 'Gagal upload foto ke server')
  } finally {
    uploadingPhoto.value = false
  }
}

function addSkill() {
  const s = newSkillName.value.trim()
  if (s && !cv.value.skill_details.find((d: CVSkillDetail) => d.name.toLowerCase() === s.toLowerCase())) {
    cv.value.skill_details.push({ name: s, percentage: 75 })
    newSkillName.value = ''
  }
}

function removeSkill(idx: number) {
  cv.value.skill_details.splice(idx, 1)
}

function addCertification() {
  const cert: Certification = {
    id: `cert_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: '',
    issuer: '',
    date: '',
  }
  cv.value.certifications.push(cert)
}

function removeCertification(id: string) {
  cv.value.certifications = cv.value.certifications.filter(c => c.id !== id)
}

function addLanguage() {
  cvStore.addLanguage(cv.value)
}

function removeLanguage(id: string) {
  cvStore.removeLanguage(cv.value, id)
}
</script>

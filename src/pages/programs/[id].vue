<template>
  <div class="space-y-6">
    <!-- Back Button -->
    <button @click="router.push('/programs')"
      class="inline-flex items-center gap-2 text-sm font-semibold text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 transition-colors">
      <ArrowLeft :size="16" />
      Kembali ke Program
    </button>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <div class="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-3"></div>
      <p class="text-sm text-surface-400 font-medium">Memuat detail program...</p>
    </div>

    <!-- Not Found -->
    <div v-else-if="!program" class="card p-12 text-center">
      <BookOpen :size="40" class="mx-auto text-surface-300 mb-3" />
      <p class="text-sm font-semibold text-surface-500">Program tidak ditemukan</p>
      <p class="text-xs text-surface-400 mt-1">Program mungkin sudah dihapus atau URL tidak valid.</p>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-surface-900 p-5 sm:p-6">
        <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
        <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-indigo-400/10 blur-[60px]"></div>
        <div class="relative z-10">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight truncate">{{ program.title }}</h1>
              <div class="flex flex-wrap items-center gap-2 mt-2">
                <span class="inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                  :class="statusBadge(program.status)">{{ program.status }}</span>
                <span class="inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/80 backdrop-blur-sm">
                  {{ program.program_type || program.type?.toLowerCase() || 'reguler' }}
                </span>
                <span v-if="isMentoringOrReguler && program.training_mode"
                  class="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider"
                  :class="trainingModeBadge(program.training_mode)">
                  {{ program.training_mode }}
                </span>
                <span v-if="isPersonal && program.personal_tier"
                  class="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-200">
                  {{ program.personal_tier }}
                </span>
              </div>
              <p v-if="program.code" class="text-sm text-white/60 mt-2 font-mono">{{ program.code }}</p>
            </div>
            <button @click="router.push(`/programs/${route.params.id}/edit`)"
              class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-xl border border-white/10 transition-all duration-200 shrink-0">
              <Pencil :size="14" />
              Edit
            </button>
          </div>
        </div>
      </div>

      <!-- Key Info Grid -->
      <div class="card p-5 sm:p-6">
        <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 mb-4">
          <span class="w-1 h-4 rounded-full bg-indigo-500"></span>
          Informasi Program
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
            <Hash :size="18" class="text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Kode</p>
              <p class="text-sm font-medium text-surface-900 dark:text-surface-100 mt-0.5">{{ program.code || '-' }}</p>
            </div>
          </div>
          <div class="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
            <Tag :size="18" class="text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Kategori</p>
              <p class="text-sm font-medium text-surface-900 dark:text-surface-100 mt-0.5">{{ program.category || '-' }}</p>
            </div>
          </div>
          <div class="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
            <Banknote :size="18" class="text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Harga</p>
              <p class="text-sm font-medium text-surface-900 dark:text-surface-100 mt-0.5">{{ formatPrice(program.price) }}</p>
            </div>
          </div>
          <div class="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
            <Clock :size="18" class="text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Durasi</p>
              <p class="text-sm font-medium text-surface-900 dark:text-surface-100 mt-0.5">
                <span v-if="durationPreview">{{ durationPreview }}</span>
                <span v-else>-</span>
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
            <Signal :size="18" class="text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p class="text-xs font-semibold text-surface-500 uppercase tracking-wider">{{ isPersonal ? 'Tier' : 'Level' }}</p>
              <p v-if="isPersonal && program.personal_tier" class="text-sm font-medium text-surface-900 dark:text-surface-100 mt-0.5 capitalize">{{ program.personal_tier }}</p>
              <p v-else-if="program.level" class="text-sm font-medium text-surface-900 dark:text-surface-100 mt-0.5 capitalize">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                  {{ program.level }}
                </span>
              </p>
              <p v-else class="text-sm text-surface-400">-</p>
            </div>
          </div>
          <div class="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
            <Languages :size="18" class="text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Bahasa</p>
              <p class="text-sm font-medium text-surface-900 dark:text-surface-100 mt-0.5">{{ program.language || '-' }}</p>
            </div>
          </div>
          <div class="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
            <Award :size="18" class="text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Standar</p>
              <p class="text-sm font-medium text-surface-900 dark:text-surface-100 mt-0.5">{{ program.standard_type || '-' }}</p>
              <p v-if="program.standard_issuer" class="text-[11px] text-surface-400 mt-0.5">{{ program.standard_issuer }}</p>
            </div>
          </div>
          <div class="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
            <MapPin :size="18" class="text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Lokasi</p>
              <p class="text-sm font-medium text-surface-900 dark:text-surface-100 mt-0.5">{{ program.location || '-' }}</p>
            </div>
          </div>
          <div class="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
            <Users :size="18" class="text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Max Peserta</p>
              <p class="text-sm font-medium text-surface-900 dark:text-surface-100 mt-0.5">{{ program.max_participants || '-' }}</p>
            </div>
          </div>
          <div v-if="isMentoringOrReguler || programType === 'corporate'" class="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
            <Globe :size="18" class="text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Mode Pelatihan</p>
              <div class="flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span v-if="program.training_mode" class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold" :class="trainingModeBadge(program.training_mode)">{{ program.training_mode?.toUpperCase() }}</span>
                <span v-else-if="program.is_online || program.is_offline">
                  <span v-if="program.is_online && program.is_offline" class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">HYBRID</span>
                  <span v-else-if="program.is_online" class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">ONLINE</span>
                  <span v-else-if="program.is_offline" class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">OFFLINE</span>
                </span>
                <span v-else class="text-sm text-surface-400">-</span>
              </div>
            </div>
          </div>
          <div v-if="program.total_jp" class="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
            <BookOpen :size="18" class="text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Total JP</p>
              <p class="text-sm font-medium text-surface-900 dark:text-surface-100 mt-0.5">{{ program.total_jp }}</p>
            </div>
          </div>
          <div v-if="program.divisi" class="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
            <Building2 :size="18" class="text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Divisi</p>
              <p class="text-sm font-medium text-surface-900 dark:text-surface-100 mt-0.5">{{ program.divisi }}</p>
            </div>
          </div>
          <div v-if="program.certificate_type" class="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
            <Award :size="18" class="text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Sertifikat</p>
              <p class="text-sm font-medium text-surface-900 dark:text-surface-100 mt-0.5">{{ program.certificate_type }}</p>
            </div>
          </div>
          <div v-if="program.competency_standard" class="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
            <GraduationCap :size="18" class="text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Standar Kompetensi</p>
              <p class="text-sm font-medium text-surface-900 dark:text-surface-100 mt-0.5">{{ program.competency_standard }}</p>
            </div>
          </div>
          <div v-if="program.created_at" class="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
            <CalendarDays :size="18" class="text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Dibuat</p>
              <p class="text-sm font-medium text-surface-900 dark:text-surface-100 mt-0.5">{{ formatDate(program.created_at) }}</p>
            </div>
          </div>
          <div v-if="program.updated_at" class="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
            <Clock :size="18" class="text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Diupdate</p>
              <p class="text-sm font-medium text-surface-900 dark:text-surface-100 mt-0.5">{{ formatDate(program.updated_at) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Description Sections -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <!-- Description -->
        <div class="card p-5 sm:p-6">
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 mb-4">
            <span class="w-1 h-4 rounded-full bg-indigo-500"></span>
            Deskripsi
          </h3>
          <div v-if="program.description" class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100/50 dark:border-surface-700/20">
            <p class="text-sm text-surface-700 dark:text-surface-300 leading-relaxed whitespace-pre-wrap">{{ program.description }}</p>
          </div>
          <div v-else class="p-6 text-center">
            <FileText :size="28" class="mx-auto text-surface-300 mb-2" />
            <p class="text-sm text-surface-400">Tidak ada deskripsi</p>
          </div>
        </div>

        <!-- Short Description + Prerequisites -->
        <div class="space-y-4">
          <div class="card p-5 sm:p-6">
            <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 mb-4">
              <span class="w-1 h-4 rounded-full bg-indigo-500"></span>
              Deskripsi Singkat
            </h3>
            <div v-if="program.short_description" class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100/50 dark:border-surface-700/20">
              <p class="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">{{ program.short_description }}</p>
            </div>
            <div v-else class="p-6 text-center">
              <FileText :size="28" class="mx-auto text-surface-300 mb-2" />
              <p class="text-sm text-surface-400">Tidak ada deskripsi singkat</p>
            </div>
          </div>
          <div class="card p-5 sm:p-6">
            <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 mb-4">
              <span class="w-1 h-4 rounded-full bg-indigo-500"></span>
              Prasyarat
            </h3>
            <div v-if="program.prerequisites" class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100/50 dark:border-surface-700/20">
              <p class="text-sm text-surface-700 dark:text-surface-300 leading-relaxed whitespace-pre-wrap">{{ program.prerequisites }}</p>
            </div>
            <div v-else class="p-6 text-center">
              <ShieldCheck :size="28" class="mx-auto text-surface-300 mb-2" />
              <p class="text-sm text-surface-400">Tidak ada prasyarat</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Learning Outcomes & Tags -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <!-- Learning Outcomes -->
        <div class="card p-5 sm:p-6">
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 mb-4">
            <span class="w-1 h-4 rounded-full bg-indigo-500"></span>
            Learning Outcomes
          </h3>
          <ul v-if="program.learning_outcomes?.length" class="space-y-2">
            <li v-for="(outcome, i) in program.learning_outcomes" :key="i"
              class="flex items-start gap-2.5 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
              <CheckCircle2 :size="16" class="text-indigo-500 shrink-0 mt-0.5" />
              <span class="text-sm text-surface-700 dark:text-surface-300">{{ outcome }}</span>
            </li>
          </ul>
          <div v-else class="p-6 text-center">
            <Target :size="28" class="mx-auto text-surface-300 mb-2" />
            <p class="text-sm text-surface-400">Belum ada learning outcomes</p>
          </div>
        </div>

        <!-- Tags -->
        <div class="card p-5 sm:p-6">
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 mb-4">
            <span class="w-1 h-4 rounded-full bg-indigo-500"></span>
            Tags
          </h3>
          <div v-if="program.tags?.length" class="flex flex-wrap gap-2">
            <span v-for="tag in program.tags" :key="tag"
              class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
              {{ tag }}
            </span>
          </div>
          <div v-else class="p-6 text-center">
            <Tag :size="28" class="mx-auto text-surface-300 mb-2" />
            <p class="text-sm text-surface-400">Belum ada tags</p>
          </div>
        </div>
      </div>

      <!-- Products Section -->
      <div v-if="products.length" class="card overflow-hidden">
        <div class="flex items-center justify-between p-4 sm:p-5 border-b border-surface-200/50 dark:border-surface-700/30">
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
            <span class="w-1 h-4 rounded-full bg-indigo-500"></span>
            <Package :size="16" />
            Produk
            <span class="text-[10px] font-medium text-surface-400 ml-1">({{ products.length }})</span>
          </h3>
        </div>
        <div class="p-4 sm:p-5 space-y-4">
          <div v-for="product in products" :key="product.id"
            class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100/50 dark:border-surface-700/20">
            <div class="flex items-start justify-between gap-3 mb-3">
              <div>
                <h4 class="text-sm font-bold text-surface-900 dark:text-surface-100">{{ product.title }}</h4>
                <div class="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                    :class="productTypeBadge(product.product_type)">{{ product.product_type }}</span>
                  <span v-if="['REGULAR','MENTORING','CORPORATE'].includes(product.product_type) && product.training_mode"
                    class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                    :class="trainingModeBadge(product.training_mode)">{{ product.training_mode }}</span>
                  <span v-if="product.product_type === 'PERSONAL' && product.personal_tier"
                    class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    {{ product.personal_tier }}
                  </span>
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                    :class="statusBadge(product.status)">{{ product.status }}</span>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div class="flex items-center gap-1.5">
                <Banknote :size="12" class="text-surface-400" />
                <span class="text-surface-500">Harga:</span>
                <span class="font-medium text-surface-900 dark:text-surface-100">{{ formatPrice(product.investment_price) }}</span>
              </div>
              <div v-if="product.discount_price" class="flex items-center gap-1.5">
                <Tag :size="12" class="text-surface-400" />
                <span class="text-surface-500">Diskon:</span>
                <span class="font-medium text-emerald-600 dark:text-emerald-400">{{ formatPrice(product.discount_price) }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <Users :size="12" class="text-surface-400" />
                <span class="text-surface-500">Kuota:</span>
                <span class="font-medium text-surface-900 dark:text-surface-100">{{ product.quota }}</span>
              </div>
            </div>

            <!-- Classes under this product -->
            <div v-if="product.classes?.length" class="mt-4 pt-3 border-t border-surface-100/50 dark:border-surface-700/20">
              <p class="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Kelas</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div v-for="cls in product.classes" :key="cls.id"
                  class="p-3 rounded-lg bg-white dark:bg-surface-900/50 border border-surface-100/30 dark:border-surface-700/20">
                  <div class="flex items-center justify-between mb-1">
                    <p class="text-xs font-bold text-surface-900 dark:text-surface-100">{{ cls.name }}</p>
                    <span class="text-[10px] font-mono text-surface-400">{{ cls.class_code }}</span>
                  </div>
                  <div class="text-[11px] text-surface-500 space-y-0.5">
                    <p v-if="cls.start_date">{{ formatDate(cls.start_date) }} - {{ formatDate(cls.end_date) }}</p>
                    <p v-if="cls.room">{{ cls.room }}</p>
                    <p v-if="cls.instructor?.full_name">Instruktur: {{ cls.instructor.full_name }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="mt-3 pt-3 border-t border-surface-100/50 dark:border-surface-700/20">
              <p class="text-xs text-surface-400 italic">Belum ada kelas</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Competencies Table -->
      <div class="card overflow-hidden">
        <div class="flex items-center justify-between p-4 sm:p-5 border-b border-surface-200/50 dark:border-surface-700/30">
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
            <span class="w-1 h-4 rounded-full bg-indigo-500"></span>
            <GraduationCap :size="16" />
            Unit Kompetensi
            <span class="text-[10px] font-medium text-surface-400 ml-1">({{ competencies.length }})</span>
          </h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-surface-50 dark:bg-surface-800/50">
                <th class="text-left px-4 py-2.5 text-[10px] font-semibold text-surface-500 uppercase tracking-wider">Kode Unit</th>
                <th class="text-left px-4 py-2.5 text-[10px] font-semibold text-surface-500 uppercase tracking-wider">Nama Unit</th>
                <th class="text-left px-4 py-2.5 text-[10px] font-semibold text-surface-500 uppercase tracking-wider hidden sm:table-cell">Tipe Standar</th>
                <th class="text-right px-4 py-2.5 text-[10px] font-semibold text-surface-500 uppercase tracking-wider">Jam</th>
                <th class="text-right px-4 py-2.5 text-[10px] font-semibold text-surface-500 uppercase tracking-wider hidden md:table-cell">SKS</th>
                <th class="text-center px-4 py-2.5 text-[10px] font-semibold text-surface-500 uppercase tracking-wider">Urutan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-surface-100 dark:divide-surface-800/30">
              <tr v-for="c in competencies" :key="c.id" class="hover:bg-surface-50 dark:hover:bg-surface-800/30">
                <td class="px-4 py-2.5 text-sm font-mono font-medium text-indigo-600 dark:text-indigo-400">{{ c.unit_code || '-' }}</td>
                <td class="px-4 py-2.5 text-sm text-surface-900 dark:text-surface-100">{{ c.unit_name || '-' }}</td>
                <td class="px-4 py-2.5 text-sm text-surface-600 dark:text-surface-400 hidden sm:table-cell">{{ c.standard_type || '-' }}</td>
                <td class="px-4 py-2.5 text-sm text-surface-600 dark:text-surface-400 text-right">{{ c.hours ?? '-' }}</td>
                <td class="px-4 py-2.5 text-sm text-surface-600 dark:text-surface-400 text-right hidden md:table-cell">{{ c.credit_points ?? '-' }}</td>
                <td class="px-4 py-2.5 text-sm text-surface-600 dark:text-surface-400 text-center">{{ c.sort_order ?? '-' }}</td>
              </tr>
              <tr v-if="!competencies.length">
                <td colspan="6" class="px-4 py-8 text-center text-sm text-surface-400">Belum ada unit kompetensi</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft, BookOpen, Hash, Tag, Banknote, Clock, Signal, Languages, Award,
  MapPin, Users, Globe, Building2, FileText, ShieldCheck, CheckCircle2, Target,
  CalendarDays, GraduationCap, Package, Pencil
} from 'lucide-vue-next'
import { useStaffApi } from '@/composables/useStaffApi'
import { useToast } from '@/composables/useToast'
import type { Program } from '@/stores/programs'

interface ProgramProduct {
  id: string
  title: string
  product_type: string
  training_mode: string
  personal_tier: string
  investment_price: number
  discount_price: number
  currency: string
  quota: number
  status: string
  classes?: ProgramClass[]
}

interface ProgramClass {
  id: string
  name: string
  class_code: string
  type: string
  start_date: string
  end_date: string
  room: string
  meeting_day: string
  start_time: string
  end_time: string
  quota: number
  status: string
  instructor?: { full_name: string }
}

interface ProgramUnitCompetency {
  id: string
  unit_code: string
  unit_name: string
  standard_type: string
  hours: number
  credit_points: number
  sort_order: number
}

const route = useRoute()
const router = useRouter()
const toast = useToast()

const loading = ref(true)
const program = ref<Program | null>(null)
const products = ref<ProgramProduct[]>([])
const competencies = ref<ProgramUnitCompetency[]>([])

const programType = computed(() => program.value?.program_type || program.value?.type?.toLowerCase() || '')
const isMentoringOrReguler = computed(() => programType.value === 'reguler' || programType.value === 'mentoring')
const isPersonal = computed(() => programType.value === 'personal')

const durationPreview = computed(() => {
  if (isPersonal.value) return 'Flexible'
  const parts: string[] = []
  if (program.value?.duration_hours) parts.push(`${program.value.duration_hours} JP`)
  if (program.value?.duration_weeks) parts.push(`${program.value.duration_weeks} Minggu`)
  if (program.value?.total_sessions) parts.push(`${program.value.total_sessions}x Pertemuan`)
  return parts.length ? parts.join(' • ') : ''
})

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
})

function formatPrice(price: number): string {
  if (!price) return 'Gratis'
  return currencyFormatter.format(price)
}

function formatDate(date: string): string {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
}

function statusBadge(status: string): string {
  const badges: Record<string, string> = {
    published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    draft: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    archived: 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400',
  }
  return badges[status] || 'bg-surface-100 text-surface-600'
}

function trainingModeBadge(mode: string): string {
  const badges: Record<string, string> = {
    online: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
    offline: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    hybrid: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  }
  return badges[mode] || 'bg-surface-100 text-surface-600'
}

function productTypeBadge(type: string): string {
  const badges: Record<string, string> = {
    REGULAR: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    MENTORING: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    PERSONAL: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    CORPORATE: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    PARTNERSHIP: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  }
  return badges[type] || 'bg-surface-100 text-surface-600'
}

onMounted(async () => {
  const id = route.params.id as string
  if (!id) {
    loading.value = false
    return
  }

  try {
    const res: any = await useStaffApi(`/staff/programs/${id}`)
    const data = res?.data

    if (data?.program) {
      program.value = data.program
      products.value = data.products || []
      competencies.value = data.competencies || []
    } else {
      toast.error('Gagal', 'Program tidak ditemukan')
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memuat program'
    console.error('[Program Detail Error]', err)
    toast.error('Gagal', message)
  } finally {
    loading.value = false
  }
})
</script>

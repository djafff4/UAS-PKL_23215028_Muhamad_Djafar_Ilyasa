<template>
  <div class="mobile-optimized" :class="{ 'is-native': isNative, 'is-android': isAndroid, 'is-ios': isIOS }">
    <slot />
    
    <div v-if="isNative" class="safe-area-bottom" />
  </div>
</template>

<script setup lang="ts">
import { useCapacitor } from '@/composables/useCapacitor'

const { isNative, isAndroid, isIOS } = useCapacitor()
</script>

<style scoped>
.mobile-optimized {
  min-height: 100dvh;
}

.is-native {
  padding-top: env(safe-area-inset-top);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

.safe-area-bottom {
  height: env(safe-area-inset-bottom);
  min-height: 16px;
}

.is-native :deep(.card) {
  border-radius: 16px;
}

.is-native :deep(button) {
  min-height: 44px;
  min-width: 44px;
}

.is-native :deep(input),
.is-native :deep(select),
.is-native :deep(textarea) {
  font-size: 16px;
}

@supports (padding: max(0px)) {
  .is-native {
    padding-bottom: max(16px, env(safe-area-inset-bottom));
  }
}
</style>

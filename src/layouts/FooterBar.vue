<template>
  <q-footer class="custom-footer q-px-sm text-center" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-9'">
    <div class="q-pa-xs">
      <q-avatar square size="xs" class="q-mb-sm">
        <img src="~assets/images/iszion_logo.png" />
      </q-avatar>
      <span class="q-ml-xs text-caption text-bold"> {{ $t('login_company_name') }}</span>
      <span class="q-ml-lg text-caption text-bold"> Ver1.0.0 </span>
      <span class="q-ml-sm text-caption text-bold"> Copyright © 2024 </span>
      <span class="q-ml-sm text-caption text-bold gt-sm">
        <q-icon name="phone" /> 031-901-3674 <q-icon name="phone_iphone" class="q-ml-sm" /> 010-7353-2224
        <q-icon name="email" class="q-ml-sm" /> feelkbt@gmail.com <q-icon name="home" class="q-ml-sm" />
        <a href="http://www.iszion.com" target="_blank" class="q-ml-sm text-white homelink">www.iszion.com</a>
      </span>
    </div>
  </q-footer>
</template>

<script setup></script>

<style scoped lang="sass">
.homelink
  text-decoration: none
</style>

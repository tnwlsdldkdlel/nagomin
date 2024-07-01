<template>
  <q-layout view="lHh Lpr lFf">
    <q-toolbar class="bg-primary text-white q-my-md shadow-2">
      <q-btn flat round dense icon="menu" class="q-mr-sm" />
      <q-space />
      <q-btn stretch flat label="logout" v-if="isLogin" />
      <q-btn
        stretch
        flat
        label="login"
        v-if="!isLogin"
        @click="clickMove('login')"
      />
      <q-btn stretch flat round icon="chat" />
      <!-- <q-btn stretch flat round icon="mark_unread_chat_alt" /> -->
    </q-toolbar>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import COMMON from "../common/common";
import { route } from "quasar/wrappers";

export default defineComponent({
  name: "TopMenuLayout",

  setup() {
    const isLogin = ref(COMMON.isLogin());

    return {
      isLogin,
    };
  },

  methods: {
    clickMove(path) {
      console.log(path);
      this.$router.push({ name: path });
    },
  },
});
</script>

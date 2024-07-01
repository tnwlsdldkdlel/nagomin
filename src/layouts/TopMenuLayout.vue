<template>
  <q-layout view="lHh Lpr lFf">
    <q-toolbar class="bg-primary text-white q-my-md shadow-2">
      <q-btn flat round dense icon="menu" class="q-mr-sm" />
      <q-space />
      <q-btn stretch flat label="logout" v-if="isLogin"  @click="clickLogout()" />
      <q-btn
        stretch
        flat
        label="login"
        v-if="!isLogin"
        @click="clickLogin()"
      />
      <q-btn stretch flat round icon="chat" />
      <!-- <q-btn stretch flat round icon="mark_unread_chat_alt" /> -->
    </q-toolbar>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import COMMON from "../common/common";
import axiosInstance from "src/common/axiosInstance";

export default defineComponent({
  name: "TopMenuLayout",

  setup() {
    const isLogin = ref(COMMON.isLogin());

    return {
      isLogin,
    };
  },

  methods: {
    clickLogin() {
      this.$router.push({ name: "login" });
    },
    async clickLogout() {
      const url = "/user/logout";

      await axiosInstance
          .post(url, this.join, {
            withCredentials: true,
          })
          .then((res) => {
            if (res.data.code == 200) {
              COMMON.removeJWT();
              location.reload();
            }
          })
          .catch((res) => {
            console.log(res);
          });
    }
  },
});
</script>

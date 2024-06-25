<template>
  <q-layout view="lHh Lpr lFf">
    <div style="padding-top: 30%; display: ruby-text">
      <img src="images/logo/logo.png" />
    </div>
    <div style="padding: 10%">
      <q-input v-model="text" label="아이디" />
      <q-input v-model="text" label="비밀번호" />
    </div>
    <div style="padding: 10%; display: ruby-text">
      <q-btn
        color="positive"
        icon-right="login"
        label="로그인"
        style="width: -webkit-fill-available"
      />
      <q-btn
        color="green-9"
        icon-right="person_add"
        label="회원가입"
        style="width: -webkit-fill-available; margin-top: 2%"
        @click="clickMove('join')"
      />
      <q-btn
        flat
        color="dark"
        label="아이디/비밀번호 찾기"
        style="margin-top: 3%"
      />
    </div>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";

export default {
  setup() {
    return {};
  },
  methods: {
    clickMove(path) {
      location.href = "/" + path;
    },
  },
};
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <div
      style="
        padding-top: 10%;
        padding-left: 5%;
        padding-right: 5%;
        width: 100%;
        display: flex;
      "
    >
      <q-icon
        name="arrow_back"
        @click="clickMove('login')"
        style="width: 1%; font-size: x-large"
      ></q-icon>
      <div
        style="
          width: 99%;
          text-align: center;
          font-size: large;
          font-weight: 600;
        "
      >
        비밀번호 변경
      </div>
    </div>
    <div style="padding: 10%">
      <q-input
        v-model="chagePassword.password1"
        placeholder="비밀번호"
        :error="error.password1"
        ><template v-slot:prepend>
          <q-icon name="person" />
        </template>
        <template v-slot:error>
          {{ errorMessage.password1 }}
        </template></q-input
      >
      <q-input
        v-model="chagePassword.password2"
        placeholder="비밀번호 확인"
        :error="error.password2"
        ><template v-slot:prepend>
          <q-icon name="person" />
        </template>
        <template v-slot:error>
          {{ errorMessage.password2 }}
        </template></q-input
      >
      <div style="padding: 10%; display: ruby-text">
        <q-btn
          color="positive"
          label="비밀번호 변경"
          style="width: -webkit-fill-available"
          @click="clickChagePassword()"
        />
      </div>
    </div>
  </q-layout>
</template>

<script>
import { reactive, ref } from "vue";
import COMMON from "../../common/common";
import axios from "axios";
import { useQuasar } from "quasar";

export default {
  setup() {
    const $q = useQuasar();
    const chagePassword = reactive({
      password1: "",
      password2: "",
      seq: parseInt(history.state.seq),
    });

    const error = ref({
      password1: false,
      password2: false,
    });

    const errorMessage = ref({
      password1: "",
      password2: "",
    });

    return {
      $q,
      chagePassword,
      error,
      errorMessage,
    };
  },
  methods: {
    clickMove(path) {
      this.$router.push({ name: path });
    },
    async clickChagePassword() {
      if (this.CheckPasswordVaildation(this.chagePassword)) {
        const url = "/v1/user/info/password";

        await axios
          .post(url, this.chagePassword)
          .then((res) => {
            if (res.data.code == 200) {
              this.$q
                .dialog({
                  dark: true,
                  title: "비밀번호 변경",
                  message: "비밀번호가 변경되었습니다. 다시 로그인 해주세요.",
                })
                .onOk(() => {
                  this.$router.push({ name: "login" });
                });
            }
          })
          .catch((res) => {
            console.log(res);
          });
      }
    },
    CheckPasswordVaildation(data) {
      const keys = Object.keys(data);
      const resultConfig = [];
      const passwordReg =
        /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/;

      for (var index in keys) {
        var result = false;
        var message = "";
        var target = null;
        var key = keys[index];

        switch (key) {
          case "password1":
            if (COMMON.isEmpty(data[key])) {
              message = "비밀번호를 입력해주세요.";
              target = "password1";
            } else {
              if (!passwordReg.test(data[key])) {
                message =
                  "8~16자의 영문 소문자, 숫자, 특수문자를 사용해 주세요";
                target = "password1";
              } else {
                result = true;
              }
            }
            break;

          case "password2":
            if (COMMON.isEmpty(data[key])) {
              message = "비밀번호 확인을 입력해주세요.";
              target = "password2";
            } else {
              if (!passwordReg.test(data[key])) {
                message =
                  "8~16자의 영문 소문자, 숫자, 특수문자를 사용해 주세요";
                target = "password2";
              } else {
                if (data[key] !== data["password1"]) {
                  message = "비밀번호가 일치하지 않습니다.";
                  target = "password2";
                } else {
                  result = true;
                }
              }
            }
            break;

          case "seq":
            result = true;
            break;
        }

        if (!result) {
          var config = {
            message: message,
            target: target,
          };

          resultConfig.push(config);
        }
      }

      // error 메시지 초기화.
      COMMON.resetError(this.error);
      var flag = true;
      for (var index in resultConfig) {
        this.error[resultConfig[index].target] = true;
        flag = false;
      }

      return flag;
    },
  },
};
</script>

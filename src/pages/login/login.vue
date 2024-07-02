<template>
  <q-layout view="lHh Lpr lFf">
    <div style="padding-top: 30%; display: ruby-text">
      <img src="images/logo/logo.png" />
    </div>
    <div style="padding: 10%">
      <q-input v-model="login.id" :error="error.id" placeholder="아이디">
        <template v-slot:error>
          {{ errorMessage.id }}
        </template>
      </q-input>
      <q-input
        type="password"
        v-model="login.password"
        :error="error.password"
        placeholder="비밀번호"
      >
        <template v-slot:error>
          {{ errorMessage.password }}
        </template>
      </q-input>
    </div>
    <div style="padding: 10%; padding-top: 1%; display: ruby-text">
      <q-btn
        color="positive"
        icon-right="login"
        label="로그인"
        style="width: -webkit-fill-available"
        @click="clickLogin()"
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
        label="아이디 찾기"
        style="margin-top: 3%"
        @click="clickMove('findId')"
      />
      <q-btn
        flat
        color="dark"
        label="비밀번호 찾기"
        style="margin-top: 3%"
        @click="clickMove('findPassword')"
      />
    </div>
  </q-layout>
</template>

<script>
import { ref, reactive } from "vue";
import axios from "axios";
import COMMON from "../../common/common";

export default {
  setup() {
    const login = reactive({
      id: "",
      password: "",
    });

    const error = ref({
      id: false,
      password: false,
    });

    const errorMessage = ref({
      id: "",
      password: "",
    });

    return {
      login,
      error,
      errorMessage,
    };
  },
  methods: {
    clickMove(path) {
      this.$router.push({ name: path });
    },

    CheckLoginVaildation(data) {
      const keys = Object.keys(data);
      const resultConfig = [];
      const passwordReg =
        /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,16}$/g;

      for (var index in keys) {
        var result = false;
        var message = "";
        var target = null;
        var key = keys[index];

        switch (key) {
          case "id":
            if (COMMON.isEmpty(data[key])) {
              message = "아이디를 입력해주세요.";
              target = "id";
            } else {
              result = true;
            }
            break;

          case "password":
            if (COMMON.isEmpty(data[key])) {
              message = "비밀번호를 입력해주세요.";
              target = "password";
            } else {
              if (!passwordReg.test(data[key])) {
                message =
                  "8~16자의 영문 소문자, 숫자, 특수문자를 사용해 주세요";
                target = "password";
              } else {
                result = true;
              }
            }
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
      COMMON.resetError(this.error, this.errorMessage);
      var flag = true;
      for (var index in resultConfig) {
        this.error[resultConfig[index].target] = true;
        this.errorMessage[resultConfig[index].target] =
          resultConfig[index].message;
        flag = false;
      }

      return flag;
    },

    async clickLogin() {
      if (this.CheckLoginVaildation(this.login)) {
        const url = "/v1/user/login";

        await axios
          .post(url, this.login)
          .then((res) => {
            if (res.data.code == 200) {
              COMMON.setJWT(res.data.data.jwt, 1);
              this.$router.push({ name: "index" });
            } else if (res.data.code == 400) {
              this.error["id"] = true;
              this.errorMessage["id"] = "로그인 정보를 다시 확인해주세요.";

              this.error["password"] = true;
              this.errorMessage["password"] =
                "로그인 정보를 다시 확인해주세요.";
            }
          })
          .catch((res) => {
            console.log(res);
          });
      }
    },
  },
};
</script>

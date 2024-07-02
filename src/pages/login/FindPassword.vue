<style>
#q-app
  > div
  > div:nth-child(2)
  > div:nth-child(4)
  > label:nth-child(1)
  > div
  > div.q-field__control.relative-position.row.no-wrap.text-negative
  > div.q-field__append.q-field__marginal.row.no-wrap.items-center.q-anchor--skip
  > i,
#q-app
  > div
  > div:nth-child(2)
  > div:nth-child(4)
  > label:nth-child(2)
  > div
  > div.q-field__control.relative-position.row.no-wrap.text-negative
  > div.q-field__append.q-field__marginal.row.no-wrap.items-center.q-anchor--skip
  > i,
#q-app
  > div
  > div:nth-child(2)
  > div:nth-child(4)
  > label:nth-child(3)
  > div
  > div.q-field__control.relative-position.row.no-wrap.text-negative
  > div.q-field__append.q-field__marginal.row.no-wrap.items-center.q-anchor--skip
  > i,
#q-app
  > div
  > div:nth-child(2)
  > div:nth-child(4)
  > label:nth-child(4)
  > div
  > div.q-field__control.relative-position.row.no-wrap.text-negative
  > div.q-field__append.q-field__marginal.row.no-wrap.items-center.q-anchor--skip
  > i {
  display: none;
}
</style>
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
        비밀번호 찾기
      </div>
    </div>
    <div style="padding: 10%" v-if="this.isVerified.email == ''">
      <span>회원정보에 등록한 <b>아이디</b>를 입력해주세요.</span>
      <q-input v-model="findPassword.id" placeholder="아이디" :error="error.id"
        ><template v-slot:prepend>
          <q-icon name="person" />
        </template>
        <template v-slot:error>
          {{ errorMessage.id }}
        </template></q-input
      >
      <div style="padding: 10%; display: ruby-text">
        <q-btn
          color="positive"
          label="본인인증 코드 전송"
          style="width: -webkit-fill-available"
          @click="clickSendEmail()"
        />
      </div>
    </div>
    <div style="padding: 10%" v-if="this.isVerified.email != ''">
      <span>등록된 이메일로 확인 코드를 보냈습니다.</span><br />
      <span><b style="color: red">5분이내</b>에 입력 해주세요.</span>
      <div style="display: flex">
        <q-input
          filled
          mask="#"
          unmasked-value
          v-model="isVerified.code1"
          style="padding: 1%"
          :error="error.code1"
        />
        <q-input
          filled
          mask="#"
          unmasked-value
          v-model="isVerified.code2"
          style="padding: 1%"
          :error="error.code2"
        />
        <q-input
          filled
          mask="#"
          unmasked-value
          v-model="isVerified.code3"
          style="padding: 1%"
          :error="error.code3"
        />
        <q-input
          filled
          mask="#"
          unmasked-value
          v-model="isVerified.code4"
          style="padding: 1%"
          ref="RefCode4"
          :error="error.code4"
        />
      </div>
      <div v-if="errorCode" style="font-weight: bolder; color: red">
        확인 코드가 만료되었거나, 잘못된 코드입니다. 다시 확인해주세요.
      </div>

      <div style="padding-top: 10%; text-align: center">
        <span style="font-style: italic">이메일이 오지 않았나요?</span
        >&nbsp;&nbsp;
        <span style="font-weight: bolder"
          ><a @click="clickSendEmail()">다시보내기</a></span
        >
      </div>

      <div style="padding-top: 20%">
        <q-btn
          color="positive"
          label="확인"
          style="width: -webkit-fill-available"
          @click="clickVerified()"
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
    const findPassword = reactive({
      id: "",
    });
    const isVerified = reactive({
      code1: null,
      code2: null,
      code3: null,
      code4: null,
      email: "",
    });
    const error = ref({
      code1: false,
      code2: false,
      code3: false,
      code4: false,
      id: false,
    });
    const errorCode = ref(false);
    const errorMessage = ref({
      id: "",
    });

    return {
      $q,
      findPassword,
      isVerified,
      error,
      errorMessage,
      errorCode,
    };
  },
  methods: {
    clickMove(path) {
      this.$router.push({ name: path });
    },
    async clickSendEmail() {
      if (!COMMON.isEmpty(this.findPassword.id)) {
        const url = "/v1/user/info/validate/email/" + this.findPassword.id;

        await axios
          .get(url)
          .then((res) => {
            if (res.data.code == 200) {
              this.isVerified.email = res.data.data.email;
            }
          })
          .catch((res) => {
            console.log(res);
          });
      } else {
        this.error.id = true;
        this.errorMessage.id = "아이디를 입력해주세요.";
      }
    },
    CheckCodeVaildation(data) {
      const keys = Object.keys(data);
      const resultConfig = [];

      for (var index in keys) {
        var result = false;
        var message = "";
        var target = null;
        var key = keys[index];

        switch (key) {
          case "code1":
            if (COMMON.isEmpty(data[key])) {
              target = "code1";
            } else {
              result = true;
            }
            break;

          case "code2":
            if (COMMON.isEmpty(data[key])) {
              target = "code2";
            } else {
              result = true;
            }
            break;

          case "code3":
            if (COMMON.isEmpty(data[key])) {
              target = "code3";
            } else {
              result = true;
            }
            break;

          case "code4":
            if (COMMON.isEmpty(data[key])) {
              target = "code4";
            } else {
              result = true;
            }
            break;
          case "email":
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
    async clickVerified() {
      if (this.CheckCodeVaildation(this.isVerified)) {
        const url = "/v1/user/info/validate/email";

        await axios
          .post(url, this.isVerified)
          .then((res) => {
            if (res.data.code == 200) {
              this.$router.push({
                name: "newPassword",
                state: {
                  seq: res.data.data.seq,
                },
              });
            } else if (res.data.code == 400 || res.data.code == 401) {
              this.error.code1 = true;
              this.error.code2 = true;
              this.error.code3 = true;
              this.error.code4 = true;
              this.errorCode = true;
            }
          })
          .catch((res) => {
            console.log(res);
          });
      } else {
        this.errorCode = true;
      }
    },
  },
};
</script>

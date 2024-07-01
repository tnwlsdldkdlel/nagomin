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
        style="width: 5%; font-size: x-large"
      ></q-icon>
      <div
        style="
          width: 95%;
          text-align: center;
          font-size: large;
          font-weight: 600;
        "
      >
        본인인증 이메일 수정
      </div>
    </div>
    <div style="padding: 10%">
      <span>수정할 이메일을 입력해주세요.</span>
      <div>
        <q-input v-model="updateEmail.updateEmail" :error="error.updateEmail">
          <template v-slot:error>
            {{ errorMessage.updateEmail }}
          </template></q-input
        >
      </div>
      <div style="padding-top: 20%">
        <q-btn
          color="positive"
          label="확인"
          style="width: -webkit-fill-available"
          @click="clickUpdateEmail()"
        />
      </div>
    </div>
  </q-layout>
</template>

<script>
import { reactive, ref } from "vue";
import COMMON from "../../common/common";
import axiosInstance from "../../common/axiosInstance";
import { useQuasar } from "quasar";

export default {
  setup() {
    const $q = useQuasar();
    const updateEmail = reactive({
      updateEmail: "",
      preEmail: COMMON.getJWT()["email"],
    });
    const error = ref({
      updateEmail: false,
    });
    const errorMessage = ref({
      updateEmail: "",
    });

    return {
      $q,
      updateEmail,
      error,
      errorMessage,
    };
  },
  methods: {
    CheckEmailVaildation(data) {
      const keys = Object.keys(data);
      const resultConfig = [];
      const emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;

      for (var index in keys) {
        var result = false;
        var message = "";
        var target = null;
        var key = keys[index];

        switch (key) {
          case "updateEmail":
            if (COMMON.isEmpty(data[key])) {
              message = "이메일을 입력해주세요.";
              target = "updateEmail";
            } else {
              if (!emailReg.test(data[key])) {
                message = "올바른 이메일이 아닙니다. 다시 확인해주세요.";
                target = "updateEmail";
              } else {
                result = true;
              }
            }
            break;

          case "preEmail":
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
        this.errorMessage[resultConfig[index].target] =
          resultConfig[index].message;
        flag = false;
      }

      return flag;
    },
    async clickUpdateEmail() {
      if (this.CheckEmailVaildation(this.updateEmail)) {
        const url = "/user/validate/email";

        await axiosInstance
          .put(url, this.updateEmail)
          .then((res) => {
            if (res.data.code == 200) {
              COMMON.setJWT(res.data.data.jwt, 1);

              this.$router.push({
                name: "isVerified",
                state: {
                  email: this.updateEmail.updateEmail,
                },
              });
            } else if (res.data.code == 409) {
              this.error["updateEmail"] = true;
              this.errorMessage["updateEmail"] = "이미 존재하는 이메일 입니다.";
            } else if (res.data.code == 400) {
              this.$q
                .dialog({
                  dark: true,
                  title: "비정상적인 접근",
                  message: "비정상적인 접근입니다.",
                })
                .onOk(() => {
                  this.$router.push({
                    name: "index",
                    state: {
                      email: this.updateEmail.updateEmail,
                    },
                  });
                });
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

<template>
  <q-layout view="lHh Lpr lFf">
    <div style="padding-top: 10%; padding-left: 10%; font-size: x-large">
      <q-icon name="arrow_back" @click="clickMove('login')"></q-icon>
    </div>
    <div style="padding: 10%">
      <q-input v-model="join.id" placeholder="아이디" :error="error.id"
        ><template v-slot:prepend>
          <q-icon name="person" />
        </template>
        <template v-slot:error>
          {{ errorMessage.id }}
        </template></q-input
      >
      <q-input
        v-model="join.password"
        placeholder="비밀번호"
        :error="error.password"
      >
        <template v-slot:prepend>
          <q-icon name="lock" />
        </template>
        <template v-slot:error>
          {{ errorMessage.password }}
        </template>
      </q-input>
      <div style="font-size: smaller; font-weight: bolder">
        * 8~16자의 영문 소문자, 숫자, 특수문자로 입력해주세요.
      </div>
      <q-input
        v-model="join.email"
        type="email"
        placeholder="이메일"
        :error="error.email"
        ><template v-slot:prepend>
          <q-icon name="email" />
        </template>
        <template v-slot:error>
          {{ errorMessage.email }}
        </template></q-input
      >
      <q-select
        multiple
        v-model="interest"
        :options="interests"
        stack-label
        label="관심사"
        color="positive"
        :error="error.interest"
      >
        <template v-slot:selected-item="scope">
          <q-chip
            removable
            dense
            @remove="scope.removeAtIndex(scope.index)"
            :tabindex="scope.tabindex"
            color="white"
            text-color="positive"
            class="q-ma-none"
          >
            <q-avatar
              color="positive"
              text-color="white"
              :icon="scope.opt.icon"
            />
            {{ scope.opt.label }}
          </q-chip>
        </template>
        <template v-slot:error>
          {{ errorMessage.interest }}
        </template>
      </q-select>
      <div style="display: flex">
        <div
          style="
            margin: auto;
            margin-left: unset;
            color: #21ba45;
            font-weight: bolder;
          "
        >
          나의 성향
        </div>
        <div style="margin: auto">
          <q-radio v-model="join.mbti" val="T" label="T (사고)" />
          <q-radio v-model="join.mbti" val="F" label="F (감정)" />
        </div>
      </div>
    </div>
    <div style="padding: 10%; display: ruby-text">
      <q-btn
        color="positive"
        label="회원가입"
        style="width: -webkit-fill-available"
        @click="clickJoin()"
      />
    </div>
  </q-layout>
</template>

<script>
import { reactive, ref } from "vue";
import COMMON from "../../common/common";
import axios from "axios";

export default {
  setup() {
    const join = reactive({
      id: "",
      password: "",
      email: "",
      interests: [],
      mbti: "T",
    });

    var error = ref({
      id: false,
      password: false,
      email: false,
      interest: false,
    });
    var errorMessage = ref({
      id: "",
      password: "",
      email: "",
      birth: "",
      interest: "",
    });

    var interests = ref([]);
    var interest = ref([]);
    const fetchData = async () => {
      try {
        const url = "/v1/user/interest";
        const response = await axios.get(url);

        if (response.data.code === 200) {
          interests.value = response.data.data;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return {
      join,
      interest,
      interests,
      error,
      errorMessage,
    };
  },
  methods: {
    clickMove(path) {
      location.href = "/" + path;
    },
    CheckJoinVaildation(data) {
      const keys = Object.keys(data);
      const resultConfig = [];
      const emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
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

          case "email":
            if (COMMON.isEmpty(data[key])) {
              message = "이메일을 입력해주세요.";
              target = "email";
            } else {
              if (!emailReg.test(data[key])) {
                message = "올바른 이메일이 아닙니다. 다시 확인해주세요.";
                target = "email";
              } else {
                result = true;
              }
            }
            break;

          case "interests":
            if (COMMON.isEmpty(data[key])) {
              message = "관심사를 1개이상 선택해주세요.";
              target = "interest";
            } else {
              result = true;
            }
            break;

          case "mbti":
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
    async clickJoin() {
      this.join.interests = [];
      for (var index in this.interest) {
        this.join.interests.push(this.interest[index].value);
      }

      if (this.CheckJoinVaildation(this.join)) {
        const url = "/v1/user/join";

        await axios
          .post(url, this.join)
          .then((res) => {
            if (res.data.code == 200) {
              location.href = "/isVerified";
            } else if (res.data.result == "exist") {
              this.error["id"] = true;
              this.errorMessage["id"] = "이미 존재하는 회원 아이디입니다.";
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

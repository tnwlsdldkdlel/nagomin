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
        아이디 찾기
      </div>
    </div>
    <div style="padding: 10%">
      <span>회원정보에 등록한 <b>이메일</b>를 입력해주세요.</span>
      <q-input
        v-model="findId.email"
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
      <div v-if="findId.findId">
        해당 이메일로 가입한 아이디는
        <b style="color: red">{{ findId.findId }}</b> 입니다.
      </div>
      <div style="padding: 10%; display: ruby-text">
        <q-btn
          color="positive"
          label="아이디 찾기"
          style="width: -webkit-fill-available"
          @click="clickFindId()"
        />
      </div>
    </div>
  </q-layout>
</template>

<script>
import { reactive, ref } from "vue";
import COMMON from "../../common/common";
import axios from "axios";

export default {
  setup() {
    const findId = reactive({
      email: "",
      findId: "",
    });

    const error = ref({
      email: false,
    });

    const errorMessage = ref({
      email: "",
    });

    return {
      findId,
      error,
      errorMessage,
    };
  },
  methods: {
    clickMove(path) {
      this.$router.push({name : path})
    },
    async clickFindId() {
      if (!COMMON.isEmpty(this.findId.email)) {
        const url = "/v1/user/info/id";

        await axios
          .post(url, this.findId)
          .then((res) => {
            if (res.data.code == 200) {
              this.findId.findId = res.data.data.id;

              this.error.email = false;
              this.errorMessage.email = "";
            } else if (res.data.code == 404) {
              this.error.email = true;
              this.errorMessage.email = "존재하지 않은 이메일 입니다.";
            }
          })
          .catch((res) => {
            console.log(res);
          });
      } else {
        this.error.email = true;
        this.errorMessage.email = "이메일을 입력해주세요.";
      }
    },
  },
};
</script>

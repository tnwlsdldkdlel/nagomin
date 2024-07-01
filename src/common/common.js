import Cookies from 'js-cookie';
import VueJwtDecode from "vue-jwt-decode";

export default {
  isEmpty(value) {
    if (value === "" || value === null || value === undefined || (typeof value === "string" && value.trim().length === 0)
      || (typeof value == "object" && Object.keys(value).length === 0)
    ) {
      return true;
    }

    return false;
  },

  getToday() {
    var today = new Date();
    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);
    var dateString = year + '/' + month + '/' + day;

    return dateString;
  },

  getTime() {
    var today = new Date();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    var dateString = hours + ':' + minutes + ':' + seconds;

    return dateString;
  },

  resetError(error, errorMessage) {
    for (var index in error) {
      error[index] = false;
    }

    for (var index in errorMessage) {
      errorMessage[index] = "";
    }
  },

  getJWT() {
    const jwt = Cookies.get('jwt');
    return VueJwtDecode.decode(jwt)["info"];
  },

  setJWT(jwt, day) {
    if(Cookies.get('jwt')) {
      Cookies.remove('jwt');
    }

    Cookies.set('jwt', jwt, { expires: day });
  }
}

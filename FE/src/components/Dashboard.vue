<template>
  <nav class="navbar navbar-expand-sm bg-light" v-if="store.state.user && store.state.user.name">
    <div class="container-fluid">
      <ul class="navbar-nav">
        <li class="nav-item fw-bolder">
          <router-link
            class="nav-link"
            :class="{ 'text-primary': routerActive === '/dashboard/event' }"
            to="/dashboard/event"
            >Event</router-link
          >
        </li>
        <li class="nav-item fw-bolder">
          <router-link
            class="nav-link"
            :class="{ 'text-primary': routerActive === '/dashboard/initiateEvent' }"
            to="/dashboard/initiateEvent"
            >Initiate an Event</router-link
          >
        </li>
        <li class="nav-item fw-bolder">
          <router-link
            class="nav-link"
            :class="{
              'text-primary':
                routerActive === '/dashboard/profilePage/information' ||
                routerActive === '/dashboard/profilePage/activity',
            }"
            to="/dashboard/profilepage"
            >Profile</router-link
          >
        </li>
      </ul>
    </div>
    <div class="d-flex justify-content-end pe-5 username">
      Hi,<span class="text-primary fw-bold">{{ user.name }}</span>
    </div>
    <div
      class="d-flex justify-content-end me-3 align-items-center btn btn-outline-secondary"
      @click="logout"
    >
      <font-awesome-icon icon="sign-out-alt" title="log out" />
      <span class="ms-1">Logout</span>
    </div>
  </nav>
  <nav class="navbar navbar-expand-sm bg-light d-flex justify-content-end px-3" v-else>
    <div class="sinup-login-btn">
      <div class="btn btn-outline-secondary" @click="showDialog('signUp')">Sign up</div>
      <div class="btn btn-outline-secondary" @click="showDialog('logIn')">Log in</div>
    </div>
    <CustomizeDialog
      :is-visible="isDialogVisible"
      @close="closeDialog"
      @ok="handleSignup"
      :customizeOk="`Sign Up`"
      :signupRef="signupRef"
      :showButton="!showLogin"
    >
      <template #content>
        <SignupForm
          v-if="!showLogin"
          :signupRef="signupRef"
          @showLogin="showLogin = true"
        ></SignupForm>
        <Login v-if="showLogin"></Login>
      </template>
    </CustomizeDialog>
  </nav>
  <router-view> </router-view>
</template>

<script>
import { onMounted, computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { callApi } from "../plugins/apiService.js";
import CustomizeDialog from "/src/components/unit/CustomizeDialog.vue";
import SignupForm from "/src/components/SignUP.vue";
import Login from "/src/components/Login.vue";
export default {
  name: "DashboardPage",
  components: {
    CustomizeDialog,
    SignupForm,
    Login,
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.user);
    const router = useRouter();
    const showLogin = ref(false);
    const routerActive = computed(() => {
      return router.currentRoute.value.path;
    });
    const isDialogVisible = ref(false);
    const signupRef = ref(false);

    onMounted(async () => {
      try {
        const userData = await callApi("/account");
        store.dispatch("addUser", userData);
      } catch (error) {
        router.push("/dashboard/event");
      }
    });

    const logout = async () => {
      const res = await callApi("/logout");
      if (res) {
        router.push("/dashboard/event");
        store.dispatch('addUser',{})
      }
    };

    const showDialog = (flag) => {
      showLogin.value = flag === 'logIn' ? true : false;
      isDialogVisible.value = true;
    };

    const handleSignup = () => {
      signupRef.value = true;
    };

    const closeDialog = () => {
      isDialogVisible.value = false;
    };

    return {
      user,
      logout,
      routerActive,
      store,
      showDialog,
      isDialogVisible,
      handleSignup,
      signupRef,
      closeDialog,
      showLogin,
    };
  },
};
</script>

<style scoped>
.username {
  width: 20%;
}
.logout-btn {
  background-color: white;
  padding: 5px 10px;
  border-radius: 4px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.sinup-login-btn{
  width:200px;
  display:flex;
  justify-content: space-around;
}
</style>

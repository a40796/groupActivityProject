<template>
  <div class="d-flex w-100">
    <div class="container profile w-100 d-flex justify-content-center text-secondary">
      <form class="ms-3">
        <InputField
          label="Name"
          type="text"
          v-model="user.name"
          fieldId="name"
          :value="user.name"
          :editable="!editable"
          @updateValue="handleUpdateValue"
        />
        <InputField
          label="Email"
          type="text"
          v-model="user.email"
          fieldId="email"
          :value="user.email"
          :editable="!editable"
          @updateValue="handleUpdateValue"
        />
        <InputField
          label="Password"
          type="text"
          v-model="user.password"
          fieldId="password"
          :value="user.password"
          :editable="!editable"
          @updateValue="handleUpdateValue"
        />
        <InputField
          label="Phone"
          type="text"
          v-model="user.phone"
          fieldId="phone"
          :value="user.phone"
          :editable="!editable"
          @updateValue="handleUpdateValue"
        />
        <InputField
          label="Address"
          type="text"
          v-model="user.address"
          fieldId="address"
          :value="user.address"
          :editable="!editable"
          @updateValue="handleUpdateValue"
        />
        <div class="mb-3">
          <div class="d-flex">Gender</div>
          <div class="d-flex pb-3 align-items-center">
            <input
              type="radio"
              id="male"
              name="gender"
              value="male"
              class="radioInput me-1"
              v-model="user.gender"
              :disabled="editable"
              @mouseover="showBan.gender = true"
              @mouseout="showBan.gender = false"
            />
            <label for="male">Male</label>
            <input
              type="radio"
              id="female"
              name="gender"
              value="female"
              class="radioInput ms-3 me-1"
              v-model="user.gender"
              :disabled="editable"
              @mouseover="showBan.gender = true"
              @mouseout="showBan.gender = false"
            />
            <label for="female" class="me-5">Female</label>
            <font-awesome-icon
              class="text-danger"
              icon="ban"
              v-if="showBan.gender && editable"
            />
          </div>
        </div>
        <div class="d-flex justify-content-start btnPosition">
          <button type="button" class="btn btn-primary" @click="editProfile">
            {{ editable ? "Edit" : "Save Changes" }}
          </button>
          <button
            type="button"
            class="btn btn-primary ms-3"
            @click="updateUser"
            :disabled="isdisabled"
          >
            update
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import InputField from "./unit/InputField";
import { useStore } from "vuex";
import { computed, ref, reactive } from "vue";
import { callApi } from "../plugins/apiService.js";
import {showToastMessage} from '/src/common.js'
export default {
  name: "ProfilePage",
  components: {
    InputField,
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.user);
    const editable = ref(true);
    const isdisabled = ref(true);
    const showBan = reactive({
      gender: false,
    });
    const userShortName = computed(() => {
      if (user.value.name) {
        const [abb] = user.value.name.split("");
        return abb.toUpperCase();
      }
      return "";
    });

    const msg = ref("");
    const handleUpdateValue = (e, id) => {
      user.value[id] = e.target.value;
    };

    const editProfile = () => {
      editable.value = !editable.value;
      if (editable.value) {
        isdisabled.value = !editable.value
        store.dispatch("addUser", user.value);
      }
    };

    const updateUser = async () => {
      const updateUserObj = {
        user: {
          name: user.value.name,
          email: user.value.email,
          password: user.value.password,
          phone: user.value.phone,
          address: user.value.address,
          gender: user.value.gender,
        },
      };
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateUserObj),
      };
      try {
        const data = await callApi("/account", "POST", requestOptions);
        const message = data.msg;
        msg.value = message;
        showToastMessage(msg.value,'success', store)
      } catch (error) {
        console.log("error", error);
      }
    };

    return {
      user,
      editable,
      editProfile,
      updateUser,
      showBan,
      msg,
      userShortName,
      isdisabled,
      handleUpdateValue,
    };
  },
};
</script>

<style scoped>
.circle {
  width: 100px;
  height: 100px;
  background-color: #00bcd4;
  border-radius: 50%;
  text-align: center;
  line-height: 100px;
  color: #ffffff;
  margin-top: 5rem;
}
.profile {
  width: 400px;
  margin-top: 10rem;
}
.profile > form {
  width: 30rem;
}
.form-control:disabled {
  background-color: white;
}
</style>

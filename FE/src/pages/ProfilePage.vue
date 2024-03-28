<template>
  <div class="d-flex profile-page">
    <SideBar :routerLinkData="routerLinkData">
      <template v-slot:userContent>
        <div class="p-3 me-3 d-flex flex-column align-items-center text-secondary">
          <div v-if="showUserShortName" class="circle">{{ userShortName }}</div>
          <img :src="userUrl" class="circle" />
          <span class="mt-3 fs-6">{{ user.name }}</span>
        </div>
      </template>
      <template v-slot:uploadField>
        <UploadField />
      </template>
    </SideBar>
    <router-view></router-view>
  </div>
</template>

<script>
import SideBar from "../components/unit/SideBar.vue";
import UploadField from "../components/unit/UploadField.vue";
import { useStore } from "vuex";
import { computed } from "vue";
export default {
  name: "ProfilePage",
  components: { SideBar, UploadField },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.user);
    const userUrl = computed(() => store.state.user.photo);
    const showUserShortName = computed(() => {
      return !userUrl.value || userUrl.value.length === 0;
    });
    const routerLinkData = [
      {
        path: "/dashboard/profilePage/information",
        title: "Personal Information",
      },
      {
        path: "/dashboard/profilePage/activity",
        title: "Personal Activity",
      },
    ];
    return {
      routerLinkData,
      user,
      userUrl,
      showUserShortName,
    };
  },
};
</script>

<style scoped>
.profile-page {
  height: 100%;
}
.circle {
  width: 150px;
  border-radius: 50%;
  text-align: center;
  line-height: 100px;
  color: #ffffff;
  margin-top: 5rem;
}
</style>

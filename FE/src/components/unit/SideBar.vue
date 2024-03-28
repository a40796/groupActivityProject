<template>
  <!-- Sidebar -->
  <div class="profile-side-bar">
    <slot name="userContent"></slot>
    <slot name="uploadField"></slot>
    <nav id="sidebar" class="col-md-3 col-lg-2 d-md-block sidebar">
      <div :class="sidebarContainerClass">
        <ul class="nav flex-column">
          <li
            class="nav-item sidebar-button mt-1"
            v-for="(router, idx) in routerLinkData"
            :key="idx"
          >
            <router-link
              :class="{
                'text-primary': routerActive === router.path,
                'text-secondary': routerActive !== router.path,
              }"
              class="nav-link"
              :to="router.path"
            >
              {{ router.title }}
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
import { computed, watchEffect } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "SideBar",
  props: {
    routerLinkData: Array,
  },
  setup(_, { slots }) {
    const router = useRouter();
    const routerActive = computed(() => router.currentRoute.value.path);

    watchEffect(() => {
      if (routerActive.value === "/dashboard/profilepage") {
        router.push("/dashboard/profilePage/information");
      }
    });

    // Computed property for the div class
    const sidebarContainerClass = computed(() => ({
      "d-flex": true,
      "justify-content-center": true,
      "mt-3": !!slots.userContent,
      "mt-60": !!slots.userContent === false,
    }));

    return { routerActive, sidebarContainerClass };
  },
};
</script>

<style scoped>
.profile-side-bar {
  background-color: #f0f0f84a;
  padding: 5px 20px;
  border-radius: 4px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.sidebar {
  width: 100%;
}

.sidebar-button {
  width: 230px;
  background-color: white;
  padding: 5px 10px;
  border-radius: 4px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.photo-img {
  width: 150px;
}
</style>

<template>
  <div class="d-flex w-100 intiateEvent">
    <SideBar :routerLinkData="routerLinkData" />
    <div
      class="container profile w-100 d-flex justify-content-center align-items-center text-secondary flex-column"
    >
      <EditEvent />
    </div>
  </div>
</template>

<script>
import EditEvent from "../components/EditEvent";
import SideBar from "../components/unit/SideBar";
export default {
  name: "IntiateEventPage",
  components: {
    EditEvent,
    SideBar,
  },
  setup() {
    const routerLinkData = [
      {
        path: "/dashboard/initiateEvent",
        title: "Initiate Event",
      },
      {
        path: "/dashboard/initiatedEvent",
        title: "Initiated Event",
      },
    ];
    return { routerLinkData };
  },
};
</script>

<style scoped>
.intiateEvent {
  height: 100%;
}
</style>

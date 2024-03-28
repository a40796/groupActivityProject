<template>
  <div class="d-flex initiatedEvent">
    <SideBar :routerLinkData="routerLinkData" />
    <div
      class="initiated-events-container"
      :class="{'d-flex align-items-center' : initiatedEvents.length === 0}"
    >
      <div class="initiated-events-area">
        <div
          class="initiated-events-form"
          v-if="initiatedEvents && initiatedEvents.length > 0"
        >
          <div
            class="initiated-event white-bg"
            v-for="(item, idx) in showPageEvents"
            :key="idx"
          >
            <div class="initiated-event-container" >
              <div class="ellipsis event-name">{{ item.eventName }}</div>
              <div class="text-gray">
                {{
                  `${formattedDateTime(item.meetingTime)} - ${formattedDateTime(
                    item.endTime
                  )}`
                }}
              </div>
              <div class="mt-3 d-flex justify-content-start">
                <button
                  class="btn btn-primary"
                  type="button"
                  data-bs-toggle="modal"
                  :data-bs-target="'#editEventModal' + item.uuid"
                  @click="getCurrentOpenEvent(item)"
                >
                  Edit
                </button>
                <button
                  class="btn btn-primary ms-1"
                  type="button"
                  @click="handleDeleteEvent(item.uuid)"
                >
                  Delete
                </button>
              </div>
              <div
                class="modal fade"
                :id="'editEventModal' + item.uuid"
                tabindex="-1"
                aria-labelledby="editEventModalLabel"
                aria-hidden="true"
              >
                <div
                  class="modal-dialog d-flex align-items-center justify-content-center"
                >
                  <EditEvent
                    :editEvent="item"
                    :currentOpenEvent="currentOpenEvent"
                    @event-updated="handleEventUpdated"
                  ></EditEvent>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="d-flex align-items-center">
          No ongoing events at the moment
        </div>
      </div>
      <div class="pagination-area" v-if="initiatedEvents.length > 5">
        <nav aria-label="Page navigation example">
          <ul class="pagination">
            <li
              class="page-item"
              @click="handlePagination('Previous')"
              v-if="pagination.pre"
            >
              <a class="page-link" href="#">Previous</a>
            </li>
            <li
              class="page-item"
              @click="handlePagination('Next')"
              v-if="pagination.next"
            >
              <a class="page-link" href="#">Next</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from "../components/unit/SideBar";
import { onMounted, ref } from "vue";
import { callApi } from "../plugins/apiService.js";
import EditEvent from "../components/EditEvent";
import { showToastMessage } from "/src/common.js";
import { useStore } from "vuex";
export default {
  name: "IntiatedEventPage",
  components: {
    SideBar,
    EditEvent,
  },
  setup() {
    const store = useStore();
    const initiatedEvents = ref([]);
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

    const formattedDateTime = (date) => {
      const month = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const originalDate = new Date(date);
      return `${
        month[originalDate.getMonth()]
      } ${originalDate.getDate()}, ${originalDate.getFullYear()} ${originalDate
        .getHours()
        .toString()
        .padStart(2, "0")}:${originalDate.getMinutes().toString().padStart(2, "0")}`;
    };
    const showPageEvents = ref({});
    const pagination = ref({
      pre: false,
      next: false,
    });

    const togglePaginationButton = () => {
      pagination.value.pre = !pagination.value.pre;
      pagination.value.next = !pagination.value.next;
    };

    const handlePagination = (page) => {
      togglePaginationButton();
      const pageSize = 5;
      const startIndex = page === "Previous" ? 0 : pageSize;
      showPageEvents.value = initiatedEvents.value.slice(
        startIndex,
        startIndex + pageSize
      );
    };

    const currentOpenEvent = ref({})

    const getEventData = async () => {
      try {
        const initiatedEventsData = await callApi("/events");
        if (initiatedEventsData) {
          initiatedEvents.value = initiatedEventsData
          if (initiatedEvents.value.length > 5) {
            showPageEvents.value = initiatedEvents.value.slice(0, 5);
            pagination.value.pre = false;
            pagination.value.next = true;
          } else {
            showPageEvents.value = initiatedEvents.value;
          }
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    const handleEventUpdated = (updatedEvent) => {
      const index = initiatedEvents.value.findIndex(
        (item) => item.uuid === updatedEvent.uuid
      );
      if (index !== -1) {
        initiatedEvents.value[index] = updatedEvent;
      }
      getEventData()
    };

    const handleDeleteEvent = async (id) => {
      try {
        const res = await callApi("/events/" + id, "DELETE");
        if (res) {
          showToastMessage(res.msg, "success", store);
          getEventData();
        }
      } catch (error) {
        console.error("delete event error");
      }
    };

    const getCurrentOpenEvent = (item) =>{
      currentOpenEvent.value = item
    }

    onMounted(() => {
      getEventData();
    });

    return {
      routerLinkData,
      initiatedEvents,
      formattedDateTime,
      handleEventUpdated,
      showPageEvents,
      pagination,
      handlePagination,
      handleDeleteEvent,
      getCurrentOpenEvent,
      currentOpenEvent
    };
  },
};
</script>

<style scoped>
.initiatedEvent {
  width: 100%;
  height: 100%;
}
.initiated-events-container {
  width: 100%;
}
.initiated-events-area {
  width: 100%;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.initiated-events-area .initiated-events-form {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.initiated-event {
  width: 80%;
  height: 130px;
  margin: 10px 0;
  padding: 0;
}

.initiated-event-container {
  padding: 10px;
  font-size: 16px;
}

.modal-content {
  width: 1220px !important;
  height: 850px;
  padding: 35px 35px 0 35px !important;
}

.modal-dialog {
  height: 94%;
}

.pagination-area {
  position: fixed;
  top: 90%;
  right: 10%;
}

.event-name {
  font-weight: bold;
}
</style>

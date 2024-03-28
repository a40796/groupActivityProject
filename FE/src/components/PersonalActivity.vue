<template>
  <div class="person-activity-area">
    <h5 class="attended-events-title text-primary">Attend Events</h5>
    <div class="attended-events-table">
      <DataTable :columns="columns" :rows="rows" @open-detail="handleOpenDetail">
      </DataTable>
    </div>
    <div class="person-activity-pagination-area">
      <vue-awesome-paginate
        :total-items="attendedEvents.length"
        :items-per-page="6"
        :max-pages-shown="3"
        v-model="currentPage"
        :on-click="getAttendedEvents"
      />
    </div>
  </div>
  <PopupWindow v-if="isPopupVisible" @hidePopupWindow="isPopupVisible = false">
    <template v-slot:detail>
      <div class="detail-popup">
        <div class="orange-color fw-bold mb-3 event-title d-flex justify-content-between">
          <div>{{ detailEvent.eventName }}</div>
          <button
            type="button"
            class="btn-close"
            style="font-size: 12px"
            @click="isPopupVisible = false"
          ></button>
        </div>
        <div class="detail-popup-container">
          <div class="event-annoucement">{{ detailEvent.announcements }}</div>
          <div>
            <div class="text-primary fw-bold">Event time</div>
            <div>
              {{ parseEventTimePeriod(detailEvent.meetingTime, detailEvent.endTime) }}
            </div>
          </div>
          <div>
            <div class="text-primary fw-bold">Event location</div>
            <div>{{ detailEvent.location }}</div>
          </div>
          <div>
            <div class="text-primary fw-bold">Number of Events</div>
            <div>{{ detailEvent.selectNum }}</div>
          </div>
          <div>
            <div class="text-primary fw-bold">Event Number</div>
            <div>{{ detailEvent.uuid }}</div>
          </div>
          <div class="text-primary fw-bold">Event photo</div>
          <div class="detail-table mt-1">
            <DataTable :columns="detailColumns" :rows="detailRows"></DataTable>
          </div>
        </div>
      </div>
    </template>
  </PopupWindow>
</template>

<script>
import { onMounted, ref, reactive, computed } from "vue";
import { callApi } from "../plugins/apiService.js";
import DataTable from "/src/components/unit/CustomizeDatatable.vue";
import { parseEventTimePeriod } from "/src/common.js";
import PopupWindow from "/src/components/unit/PopupWindow.vue";
export default {
  name: "PersonalActivity",
  components: { DataTable, PopupWindow },
  setup() {
    const currentPage = ref("1");
    const attendedEvents = ref([]);
    const perpageAttendedEvents = ref([]);
    const columns = ref([
      {
        label: "EventName",
        field: "eventName",
        width: "10%",
        isKey: true,
      },
      {
        label: "Announcements",
        field: "announcements",
        width: "10%",
      },
      {
        label: "Location",
        field: "location",
        width: "10%",
      },
      {
        label: "Time",
        field: "time",
        width: "10%",
      },
      {
        label: "Detail",
        field: "detail",
        width: "6%",
        display: function (row) {
          return (
            '<button type="button" data-id="' +
            row.uuid +
            '" class="is-rows-el btn btn-primary detail-btn">Detail</button>'
          );
        },
      },
    ]);
    const detailColumns = ref([
      {
        label: "Image",
        field: "image",
        width: "10%",
        isKey: true,
        display: function (row) {
          return `<image style="width:100px;height:100px" src="${row.image}" loading="lazy">`;
        },
      },
      {
        label: "Description",
        field: "description",
        width: "10%",
        isKey: true,
      },
    ]);
    const detailRows = computed(() => {
      if (!detailEvent.images) {
        return {};
      }
      return detailEvent.images.map((item) => {
        return {
          image: item.url,
          description: item.desc,
        };
      });
    });
    const rows = ref([]);
    const isPopupVisible = ref(false);

    const detailEvent = reactive({});

    const getAllEvents = async () => {
      try {
        const userData = await callApi(`/account`, "GET");
        const allEventData = await callApi(`/allEvents`, "GET");

        const eventsKey = userData.events.map((event) => Object.keys(event)[0]);

        attendedEvents.value = allEventData.allEvents.filter((event) =>
          eventsKey.includes(event.uuid)
        );
        getAttendedEvents(1);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    const handleOpenDetail = async (id) => {
      const { event } = await callApi(`/allEvents?id=${id}`, "GET");
      const {
        announcements,
        endTime,
        eventName,
        joinUserId,
        location,
        selectNum,
        meetingTime,
        userName,
        images,
        uuid,
      } = event;
      detailEvent.announcements = announcements;
      detailEvent.endTime = endTime;
      detailEvent.eventName = eventName;
      detailEvent.joinUserId = joinUserId;
      detailEvent.location = location;
      detailEvent.meetingTime = meetingTime;
      detailEvent.userName = userName;
      detailEvent.selectNum = selectNum;
      detailEvent.images = images;
      detailEvent.uuid = uuid;
      console.log("event", event);
      showPopup();
    };

    const getAttendedEvents = (page) => {
      const perpageItems = 6;
      perpageAttendedEvents.value = attendedEvents.value.slice(
        (page - 1) * perpageItems,
        page * perpageItems
      );

      if (rows.value.length > 0) {
        rows.value = [];
      }

      perpageAttendedEvents.value.forEach(
        ({ announcements, eventName, location, meetingTime, endTime, uuid }) => {
          rows.value.push({
            eventName,
            announcements,
            location,
            time: parseEventTimePeriod(meetingTime, endTime),
            uuid,
          });
        }
      );
    };

    const showPopup = () => {
      isPopupVisible.value = true;
    };

    onMounted(() => {
      getAllEvents();
    });
    return {
      columns,
      rows,
      handleOpenDetail,
      currentPage,
      getAttendedEvents,
      attendedEvents,
      perpageAttendedEvents,
      showPopup,
      isPopupVisible,
      detailEvent,
      detailColumns,
      detailRows,
      parseEventTimePeriod,
    };
  },
};
</script>

<style scoped>
.person-activity-area {
  width: 100%;
  padding: 0 100px 0 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.attended-events-title {
  margin-bottom: 20px;
}

.attended-events-table {
  max-height: 750px;
  overflow: auto;
}

.person-activity-pagination-area {
  position: fixed;
  top: 94%;
  right: 6%;
  width: 100%;
  display: flex;
  justify-content: end;
}

.person-activity-pagination-area >>> .pagination-container {
  display: flex;
  column-gap: 2px;
}

.person-activity-pagination-area >>> .paginate-buttons {
  height: 40px;
  width: 40px;
  cursor: pointer;
  border: none;
  background-color: white;
  color: black;
}

.person-activity-pagination-area >>> .paginate-buttons:hover {
  background-color: #d8d8d8;
}

.person-activity-pagination-area >>> .active-page {
  background-color: #3498db;
  border: 1px solid #3498db;
  color: black;
}

.person-activity-pagination-area >>> .active-page:hover {
  background-color: #2988c8;
}

.detail-popup {
  height: 450px;
}

.detail-popup-container {
  height: 420px;
  font-size: 16px;
  color: gray;
}

.detail-table {
  max-height: 450px;
  overflow: auto;
}

.event-title {
  border-bottom: 1px solid #8080803b
}

.event-annoucement {
  margin: 8px 0;
}
</style>

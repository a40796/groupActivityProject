<template>
  <form class="ms-3 p-3 white-bg eidt-area w-100 modal-content">
    <div class="d-flex justify-content-end" v-if="editEvent">
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close"
      ></button>
    </div>
    <div class="d-flex box-container">
      <div>
        <h5 class="text-primary">Event setting</h5>
        <InputField
          label="Event Name"
          type="text"
          :editable="editable"
          :value="eventInfo.eventName"
          @updateValue="updateFieldValue('eventName', $event)"
        />
        <InputField
          label="Location"
          type="text"
          :editable="editable"
          :value="eventInfo.location"
          @updateValue="updateFieldValue('location', $event)"
        />
        <InputField
          label="Assembling Place"
          type="text"
          :editable="editable"
          :value="eventInfo.assemblingPlace"
          @updateValue="updateFieldValue('assemblingPlace', $event)"
        />
        <div>Meeting Time:</div>
        <VueDatePicker
          class="meetingTimePicker white-bg"
          v-model="eventInfo.meetingTime"
          :disabled="!editable"
          :minDate="getMinDate()"
        />
        <div class="container p-0 mt-3">
          <div class="form-group">
            <div>Number of Participants:</div>
            <input
              type="range"
              class="form-range"
              min="1"
              max="10"
              step="1"
              id="numberSelect"
              v-model="eventInfo.selectNum"
            />
            <input
              class="form-control white-bg numberSelect"
              v-model="eventInfo.selectNum"
              :disabled="!editable"
            />
          </div>
          <div class="text-danger setting-hint participants fs-6">
            * The maximum number is limited to 10 participants by default.
          </div>
        </div>
        <div class="mt-3">
          <label for="exampleSelect" class="form-label">Event Time:</label>
          <div class="d-flex justify-content-left align-items-center mt-1">
            <div class="startTitle">Start:</div>
            <div class="startTime white-bg">
              {{ parseDateTimePicker(eventInfo.meetingTime) }}
            </div>
          </div>
          <div
            style="margin-top: 13px"
            class="d-flex justify-content-left align-items-center"
          >
            <div class="endTitle">End:</div>
            <VueDatePicker
              class="datePicker white-bg"
              v-model="eventInfo.endTime"
              :disabled="!editable"
              :minDate="getMinDate()"
            />
          </div>
        </div>
      </div>
      <div class="picture-annoucements-area ps-3">
        <h5 class="text-primary">Event Picture and Announcements</h5>
        <div class="mt-1">
          <label for="inputFile" class="custom-file-upload bg-secondary">
            <span>Upload Event Image</span>
            <input
              type="file"
              id="inputFile"
              ref="fileInput"
              multiple
              @input="handleImageUpload"
              :disabled="!editable"
            />
          </label>
          <div class="upload-image-area white-bg">
            <thead class="mb-3 white-bg">
              <tr class="w-100">
                <th>Images</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(image, index) in eventInfo.images"
                :key="index"
                class="d-flex mb-1"
              >
                <img :src="image.url" alt="Uploaded Image" class="upload-image me-1" />
                <textarea
                  class="textArea white-bg imgTextArea ms-3"
                  v-model="eventInfo.images[index].desc"
                  @keyup.enter="handlePhotoDesc(index, $event)"
                  placeholder="Enter event photo description."
                  v-if="image.uploadToCloud"
                  :disabled="!image.isEditing"
                ></textarea>
                <textarea
                  v-else
                  v-model="eventInfo.images[index].desc"
                  @keyup.enter="handlePhotoDesc(index, $event)"
                  class="textArea white-bg imgTextArea ms-3"
                  :disabled="!image.isEditing"
                ></textarea>
                <div class="upload-btn-area">
                  <font-awesome-icon
                    class="ms-3 cursor-pointer"
                    icon="edit"
                    @click="eventInfo.images[index].isEditing = true"
                    :class="{
                      'disabled-icon': !editable,
                    }"
                    v-if="!image.isEditing"
                  />
                  <font-awesome-icon
                    class="ms-3 cursor-pointer"
                    icon="check-circle"
                    v-if="image.isEditing"
                    @click="handlePhotoDescDone(index)"
                  />
                  <font-awesome-icon
                    class="ms-3 cursor-pointer"
                    icon="trash"
                    :class="{
                      'disabled-icon': !editable,
                    }"
                    @click="deletePhoto(index)"
                  />
                </div>
              </tr>
            </tbody>
          </div>
          <div class="fs-6 text-danger setting-hint">
            * The maximum number is limited to 4 pictures by default.
          </div>
          <div class="d-flex flex-column">
            <div class="mb-3 setting-hint">Event Guidelines and Announcements</div>
            <textarea
              class="white-bg annocement-text"
              id="story"
              name="story"
              rows="5"
              cols="30"
              v-model="eventInfo.announcements"
              :disabled="!editable"
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-center p-3 line">
      <button
        type="button"
        class="btn btn-primary me-3"
        @click="editable = !editable"
        v-if="editable"
      >
        Save
      </button>
      <button
        type="button"
        class="btn btn-primary me-3"
        @click="editable = !editable"
        v-if="!editable"
      >
        Edit
      </button>
      <button
        type="button"
        class="btn btn-primary me-3"
        @click="applyEventInfo"
        v-if="!editable && !editEvent"
      >
        Apply
      </button>
      <button
        type="button"
        class="btn btn-primary me-3"
        @click="updateEventInfo"
        v-if="!editable && editEvent"
      >
        Update
      </button>
    </div>
  </form>
</template>

<script>
import InputField from "../components/unit/InputField";
import { callApi } from "../plugins/apiService.js";
import { ref, reactive, onMounted, watch, toRefs } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useStore } from "vuex";
import { Toast } from "bootstrap";
import { useRouter } from "vue-router";
import { v4 as uuidv4 } from "uuid";
import _debounce from "lodash/debounce";
import { showToastMessage } from "/src/common.js";

export default {
  name: "EditEvent",
  components: {
    InputField,
    VueDatePicker,
  },
  props: {
    editEvent: Object,
    currentOpenEvent: Object,
  },
  setup(props, { emit }) {
    const { editEvent, currentOpenEvent } = toRefs(props);
    const store = useStore();
    const router = useRouter();
    const editable = ref(true);
    let eventInfo = reactive({
      eventName: "",
      location: "",
      announcements: "",
      selectNum: "1",
      startTime: "",
      endTime: "",
      images: [],
    });
    const uploadFile = ref([]);
    const inputFile = ref(null);
    const images = reactive([]);
    const photoDesc = ref("");

    watch(currentOpenEvent, (editEvent) => {
      eventInfo.eventName = editEvent.eventName;
      eventInfo.location = editEvent.location;
      eventInfo.assemblingPlace = editEvent.assemblingPlace;
      eventInfo.announcements = editEvent.announcements;
      eventInfo.selectNum = editEvent.selectNum;
      eventInfo.endTime = editEvent.endTime;
      eventInfo.meetingTime = editEvent.meetingTime;
      if (editEvent.images && editEvent.images.length > 0) {
        eventInfo.images = editEvent.images;
      }
    });

    const getMinDate = () => {
      const today = new Date();
      today.setDate(today.getDate());
      return today.toISOString().split("T")[0];
    };

    const handlePhotoDesc = _debounce((index, e) => {
      photoDesc.value = e.target.value;
      eventInfo.images[index].desc = e.target.value;
      eventInfo.images[index].isEditing = false;
    }, 500);

    const handlePhotoDescDone = (index) => {
      eventInfo.images[index].isEditing = false;
    };

    const handleImageUpload = async (e) => {
      uploadFile.value.push(e.target.files[0]);
      const files = inputFile.value.files;
      if (eventInfo.images && eventInfo.images.length >= 4) {
        showToastMessage("Upload up to four photos at most.", "error", store);
        return;
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageUrl = URL.createObjectURL(file);
        images.push({ url: imageUrl, file, isEditing: true });
      }

      const formData = new FormData();
      for (const file of uploadFile.value) {
        formData.append("images", file);
      }

      const requestOptions = {
        body: formData,
      };
      const firebaseDbImages = await callApi(
        "/events/uploadImage",
        "POST",
        requestOptions
      );

      eventInfo.images.push({
        url:
          eventInfo.images && eventInfo.images.length > 0
            ? firebaseDbImages[firebaseDbImages.length - 1]
            : firebaseDbImages[0],
        uploadToCloud: true,
        isEditing: true,
      });
    };

    const updateFieldValue = (field, event) => {
      eventInfo[field] = event.target.value;
    };

    const applyEventInfo = async () => {
      try {
        const eventSettingInfo = {
          event: {
            eventName: eventInfo.eventName,
            location: eventInfo.location,
            assemblingPlace: eventInfo.assemblingPlace,
            announcements: eventInfo.announcements,
            selectNum: eventInfo.selectNum,
            endTime: eventInfo.endTime,
            meetingTime: eventInfo.meetingTime,
            images: eventInfo.images.map(({ url, desc }) => ({ url, desc })),
            uuid: uuidv4(),
          },
        };

        const requestOptions = {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventSettingInfo),
        };
        const eventData = await callApi("/events", "POST", requestOptions, store, Toast);

        if (eventData.errorMsg) {
          eventInfo.eventName = "";
          eventInfo.location = "";
          eventInfo.assemblingPlace = "";
          eventInfo.announcements = "";
          eventInfo.selectNum = "1";
          eventInfo.endTime = "";
          eventInfo.meetingTime = "";
          eventInfo.announcements = [];
          return;
        }
        showToastMessage(eventData.msg, "success", store);
        setTimeout(() => {
          router.push("/dashboard/initiatedEvent");
        }, 2000);
      } catch (error) {
        console.error("error:", error);
      }
    };

    const updateEventInfo = async () => {
      try {
        const updatedSettingInfo = {
          event: {
            eventName: eventInfo.eventName,
            location: eventInfo.location,
            assemblingPlace: eventInfo.assemblingPlace,
            announcements: eventInfo.announcements,
            selectNum: eventInfo.selectNum,
            endTime: eventInfo.endTime,
            meetingTime: eventInfo.meetingTime,
            uuid: editEvent.value.uuid,
          },
        };

        if (eventInfo.images) {
          updatedSettingInfo.event.images = eventInfo.images.map(({ url, desc }) => ({
            url,
            desc,
          }));
        }

        const requestOptions = {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedSettingInfo),
        };

        const updatedEventData = await callApi(
          "/events/" + editEvent.value.uuid,
          "PUT",
          requestOptions
        );

        emit("event-updated", updatedEventData.data);
        showToastMessage(updatedEventData.msg, "success", store);
      } catch (error) {
        console.log("error", error);
      }
    };

    const deletePhoto = (idx) => {
      eventInfo.images.splice(idx, 1);
    };

    const parseDateTimePicker = (date) => {
      if (!date) {
        return "";
      }
      const inputDatetime = new Date(date);
      return `${(inputDatetime.getMonth() + 1).toString().padStart(2, "0")}/
         ${inputDatetime.getDate().toString().padStart(2, "0")}/
         ${inputDatetime.getFullYear()}, 
         ${inputDatetime.getHours().toString().padStart(2, "0")}:
         ${inputDatetime.getMinutes().toString().padStart(2, "0")}`;
    };

    onMounted(() => {
      inputFile.value = document.getElementById("inputFile");
    });

    return {
      editable,
      VueDatePicker,
      inputFile,
      images,
      handleImageUpload,
      eventInfo,
      updateFieldValue,
      applyEventInfo,
      handlePhotoDesc,
      deletePhoto,
      getMinDate,
      updateEventInfo,
      handlePhotoDescDone,
      parseDateTimePicker,
    };
  },
};
</script>

<style scoped>
.box-container {
  margin-bottom: 30px;
  align-items: center;
  justify-content: center;
}

.numberSelect {
  font-size: 14px;
}

.numberSelect,
.form-range {
  width: 400px;
}
.datePicker {
  width: 340px;
  margin-left: 20px;
}
.startTitle,
.endTitle {
  width: 40px;
}

.upload-image {
  width: 100px;
  height: 100px;
  border: 1px solid #80808024;
}

.upload-image-area {
  display: flex;
  flex-direction: column;
  height: 350px;
  padding: 10px;
  margin-top: 20px;
  overflow: auto;
}

.upload-image-area thead tr th {
  font-weight: 200;
}

.upload-image-area thead tr th:first-child {
  width: 100px;
}

.upload-image-area thead tr th:nth-child(2) {
  width: 420px;
  padding-left: 20px;
}

.upload-image-area thead tr th:last-child {
  width: 100px;
  padding-left: 30px;
}

.custom-file-upload {
  display: inline-block;
  cursor: pointer;
  font-size: 16px;
  color: #fff;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.custom-file-upload:hover {
  background-color: #0056b3;
}

.upload-btn-area {
  width: 100px;
  display: flex;
  justify-content: center;
}

input[type="file"] {
  display: none;
}
.textArea {
  width: 400px;
  resize: none;
  color: gray;
  font-size: 14px;
}

.line {
  border-top: 1px solid #8080803d;
}

.disabled-icon {
  opacity: 0.5;
  pointer-events: none;
}

.meetingTimePicker {
  width: 400px;
  margin: 5px 0 5px 0;
}

.setting-hint {
  margin-top: 8px;
}

.annocement-text {
  color: gray;
  font-size: 14px;
}

.startTime {
  margin-left: 20px;
  padding-left: 20px;
  font-size: 14px;
  height: 40px;
  width: 340px;
}

.picture-annoucements-area {
  width: 660px;
}

.participants {
  width: 400px;
}
</style>

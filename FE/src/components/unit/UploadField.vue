<template>
  <div class="uploadImage">
    <div>
      <label for="fileInput" class="custom-file-upload bg-primary">
        <span>Edit Personal Photo</span>
      </label>
      <div v-if="uploadPhotoName !== ''" class="d-flex justify-content-center">
        {{ `file name is ${uploadPhotoName}` }}
      </div>
      <input
        id="fileInput"
        type="file"
        class="d-none"
        @change="handleFileUpload"
        ref="fileInputRef"
      />
      <button
        v-if="uploadPhotoName !== ''"
        class="btn btn-danger mt-3"
        @click="cancelEditPhoto"
      >
        Cancel Edit Photo
      </button>
      <button
        :class="uploadPhotoName == '' ? 'disabled' : ''"
        class="btn btn-primary mt-3"
        @click="uploadImage"
      >
        Upload Image
      </button>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { callApi } from "../../plugins/apiService.js";
import {showToastMessage} from '/src/common.js'
export default {
  name: "UploadField",
  setup() {
    const store = useStore();
    const selectedFile = ref(null);
    const uploadPhotoName = ref("");
    const fileInputRef = ref(null);

    const handleFileUpload = (e) => {
      selectedFile.value = e.target.files[0];
    };

    watch(selectedFile, (newFile) => {
      uploadPhotoName.value = newFile ? newFile.name : "";
    });

    const uploadImage = async () => {
      try {
        const formData = new FormData();
        formData.append("image", selectedFile.value);
        const requestOptions = {
           body: formData,
        };
        const data = await callApi('/account/uploadImage','POST',requestOptions);
        const updateUser = {...store.state.user}
        updateUser.photo = data.url
        store.dispatch("addUser", updateUser);
        showToastMessage(data.msg,'success', store)
        cancelEditPhoto();
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    };

    const cancelEditPhoto = () => {
      selectedFile.value = null;
      uploadPhotoName.value = "";
      if (fileInputRef.value) {
        fileInputRef.value.value = "";
      }
    };

    const initializeFileInputRef = () => {
      fileInputRef.value = document.getElementById("fileInput");
    };

    onMounted(() => {
      initializeFileInputRef();
    });

    return {
      selectedFile,
      handleFileUpload,
      uploadImage,
      uploadPhotoName,
      cancelEditPhoto,
    };
  },
};
</script>

<style scoped>
.uploadImage {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.uploadImage > div {
  display: flex;
  flex-direction: column;
}
.uploadImage > input {
  font-size: 12px;
}

.uploadImage > input,
.uploadImage > button {
  width: 90%;
  max-width: 300px; /* Set a max-width for better responsiveness */
}

.custom-file-upload {
  display: flex;
  justify-content: center;
  padding: 8px 30px;
  cursor: pointer;
  color: white;
  border-radius: 5px;
}

/* Add more styling as needed */
</style>

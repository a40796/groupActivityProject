<template>
  <div v-if="isVisible" class="dialog-overlay" @click.self="closeDialog">
    <div class="dialog-container">
      <div class="dialog-header">
        <h3 v-html="title"></h3>
        <button class="ms-3" @click="closeDialog">
          <font-awesome-icon icon="fa-solid fa-x" />
        </button>
      </div>
      <div class="dialog-content">
        <slot name="content"></slot>
      </div>
      <div class="button-area mt-1 mb-1" v-if="showButton">
        <button type="button" class="btn-style" @click="closeDialog">Cancel</button>
        <button type="button" class="btn-style ms-3" @click="clickOk" >
          {{ customizeOk ?? customizeOk }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    customizeOk: {
      type: String,
      default: "ok",
    },
    signupRef:{
      type:Boolean
    },
    showButton:{
      type:Boolean,
      default:true
    }
  },
  emits: ["close", "ok"],
  setup(props, { emit }) {
    const closeDialog = () => {
      emit("close");
    };

    const clickOk = () => {
      emit("ok");
    };

    return {
      closeDialog,
      clickOk,
    };
  },
};
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-container {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-header h3 {
  margin: 0;
}

.dialog-content {
  margin-top: 10px;
}

button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.button-area {
  display: flex;
  justify-content: center;
}

.btn-style {
  border-radius: 5px;
  width: 80px;
  background-color: #3498db;
  color: white;
}
</style>

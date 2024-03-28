<template>
  <div class="mb-3">
    <label :for="fieldId" class="form-label d-flex">{{ label }}</label>
    <div class="d-flex align-items-center">
      <input
        :type="type"
        class="form-control me-3 inputStyle white-bg"
        :id="fieldId"
        :value="value"
        :disabled="!editable"
        @mouseover="handleMouseOverOut(true)"
        @mouseout="handleMouseOverOut(false)"
        @change="$emit('updateValue', $event, fieldId)"
      />
      <font-awesome-icon class="text-danger" icon="ban" v-if="showBan && !editable" />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "InputField",
  props: {
    label: String,
    type: String,
    fieldId: String,
    value: String,
    editable: Boolean,
  },
  setup(props) {
    const showBan = ref(false);
    const handleMouseOverOut = (isMouseOver) => {
      if (!props.editable) {
        showBan.value = isMouseOver;
      }
    };
    return {
      handleMouseOverOut,
      showBan,
    };
  },
};
</script>

<style scoped>
.inputStyle {
  width: 400px;
  color:gray;
  font-size:14px;
}
</style>

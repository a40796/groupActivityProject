<template>
  <div>
    <div class="position-fixed bottom-0 end-0 p-3">
      <div
        class="toast"
        ref="toastElement"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="toast-body" :class="Message.success  ? 'bg-info text-white' : 'bg-danger text-white'">
          {{ Message.success || Message.error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";

export default {
  name: "ToastComponent",
  setup() {
    const store = useStore();
    const Message = computed(() => store.state.msg);
    
    return {
      Message,
    };
  },
};
</script>

<template>
  <table-lite
    :is-loading="table.isLoading"
    :columns="table.columns"
    :rows="table.rows"
    :total="table.totalRecordCount"
    :sortable="table.sortable"
    @is-finished="tableLoadingFinish"
    :is-hide-paging="true"
  >
  </table-lite>
</template>

<script>
import { reactive, watch } from "vue";
import TableLite from "vue3-table-lite";
export default {
  name: "DataTable",
  components: { TableLite },
  props: {
    /**
     * 定義th title
     */
    columns: {
      type: Array,
      required: true,
    },
    /**
     * 定義rowData
     */
    rows: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    const table = reactive({
      isLoading: false,
      columns: props.columns,
      rows: props.rows,
      totalRecordCount: 0,
    });

    const tableLoadingFinish = (elements) => {
      table.isLoading = false;
      Array.prototype.forEach.call(elements, function (element) {
        if (element.classList.contains("detail-btn")) {
          element.addEventListener("click", function (event) {
            event.stopPropagation();
            emit("open-detail", this.dataset.id);
          });
        }
      });
    };

    watch(
      () => props.rows,
      (newRows) => {
        table.rows = newRows;
      }
    );

    return { table, tableLoadingFinish };
  },
};
</script>

<style scoped>

::v-deep(.vtl-table .vtl-thead .vtl-thead-th) {
  color: gray;
  background-color: #f0f0f84a;
  border: none;
}

::v-deep(.vtl-table td),
::v-deep(.vtl-table tr) {
  border: none;
  border-bottom: 1px solid #f0f0f8fc;
  font-size:16px;
  max-height:40px;
}
::v-deep(.vtl-tbody-td) {
  color: gray;
}
</style>

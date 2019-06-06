<template>
  <div>
    <!-- HEADER -->
    <div class="flex justify-between mb-5">
      <h1 class="font-bold text-xl mb-2">Orders</h1>
      <Dropdown
        :options="$store.state.filters"
        @optionSelected="optionSelected"
      >
        <template v-slot:title>
          <p v-if="currentFilter">
            {{ statusMap[currentFilter] }}
          </p>
          <p v-else>All orders</p>
          <i class="fas fa-angle-down text-sm pl-3 px-2"></i>
        </template>
        <slot>hello world</slot>
      </Dropdown>
    </div>

    <!-- ORDERS -->
    <template v-if="filteredOrders.length">
      <div class="flex">
        <div class="flex-1 bg-gray-400 h-12">Order name</div>
        <div class="flex-1 bg-gray-400 h-12">Order status</div>
        <div class="flex-1 bg-gray-400 h-12">Destination</div>
        <div class="flex-1 bg-gray-400 h-12">Order created at</div>
      </div>
      <div
        class="flex cursor-pointer md:hover:text-blue-600"
        v-for="(order, index) in filteredOrders"
        :key="index"
        @click="
          openModal = true;
          selectedOrder = order;
        "
      >
        <div class="flex-1 bg-gray-400 h-12">{{ order.name }}</div>
        <div class="flex-1 bg-gray-400 h-12">{{ order.currentStatus }}</div>
        <div class="flex-1 bg-gray-400 h-12">{{ order.destination }}</div>
        <div class="flex-1 bg-gray-400 h-12">{{ order.sent_at_second }}</div>
      </div>
    </template>

    <div class="flex items-center justify-center" v-else>
      <EmptyState class="w-1/2" />
    </div>

    <Modal v-if="openModal" :open="openModal" @close="openModal = false">
      <div
        class="bg-white rounded-lg shadow-2xl px-6 py-6"
        style="width: 50vw;"
      >
        <OrderDetail :order="selectedOrder" />

        <div class="mt-6 flex justify-end">
          <button
            @click="openModal = false"
            class="p-4 py-2 text-gray-800 font-semibold bg-white hover:bg-gray-100 border rounded focus:outline-none focus:shadow-outline"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import Dropdown from "./Dropdown.vue";
import EmptyState from "../icons/EmptyState.vue";
import Modal from "./Modal.vue";
import OrderDetail from "./OrderDetail.vue";

export default {
  components: {
    Dropdown,
    EmptyState,
    Modal,
    OrderDetail
  },
  data() {
    return {
      currentFilter: this.filter || "CREATED",
      openModal: false,
      selectedOrder: null,
      statusMap: {
        CREATED: "Cooking Now",
        COOKED: "Cooked Orders",
        DRIVER_RECEIVED: "Drivers En Route",
        DELIVERED: "Delivered Orders",
        CANCELLED: "Cancelled Orders"
      }
    };
  },
  computed: {
    filteredOrders() {
      if (!this.currentFilter) {
        return this.$store.getters.notifications.filter(
          event => event.currentStatus
        );
      }
      return this.$store.getters.getOrdersByFilter(this.currentFilter);
    }
  },
  methods: {
    optionSelected(value) {
      this.currentFilter = value;
    }
  },
  props: {
    filter: {
      type: String
    }
  },
  watch: {
    filter(newVal) {
      this.currentFilter = newVal;
    }
  }
};
</script>

<style></style>

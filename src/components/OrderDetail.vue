<template>
  <div>
    <h2
      class="font-semibold text-gray-900 text-2xl leading-tight border-b-2 border-gray-200 pb-4 flex justify-between"
    >
      <span
        >{{ order.name }}
        <span class="text-gray-500">(ID: {{ order.id }})</span></span
      >
      <Dropdown
        :options="$store.state.filters"
        @optionSelected="optionSelected"
        preOptionText="Move to"
      >
        <template v-slot:title>
          <span
            class="flex items-center rounded-full text-white uppercase px-2 py-3 text-xs font-bold"
            :class="{
              'bg-red-500': order.currentStatus === 'CREATED',
              'bg-indigo-500': order.currentStatus === 'COOKED',
              'bg-orange-500': order.currentStatus === 'DRIVER_RECEIVED',
              'bg-green-500': order.currentStatus === 'DELIVERED',
              'bg-gray-500': order.currentStatus === 'CANCELLED'
            }"
            style="max-height: 35px"
          >
            <i
              class="fas px-2"
              :class="{
                'fa-receipt': order.currentStatus === 'CREATED',
                'fa-utensils': order.currentStatus === 'COOKED',
                'fa-car-side': order.currentStatus === 'DRIVER_RECEIVED',
                'fa-home': order.currentStatus === 'DELIVERED',
                'fa-times': order.currentStatus === 'CANCELLED'
              }"
            ></i>
            <span>{{ statusMap[order.currentStatus] }}</span>
            <i class="fas fa-angle-down text-sm pl-3 px-2"></i>
          </span>
        </template>
      </Dropdown>
    </h2>

    <OrderStepper :order="order" class="mt-3" />
  </div>
</template>

<script>
import Dropdown from "./Dropdown.vue";
import OrderStepper from "../components/OrderStepper.vue";

export default {
  components: {
    Dropdown,
    OrderStepper
  },
  props: {
    order: {
      type: Object
    }
  },
  data: () => ({
    statusMap: {
      CREATED: "Cooking Now",
      COOKED: "Cooked",
      DRIVER_RECEIVED: "Driver en route",
      DELIVERED: "Delivered",
      CANCELLED: "Cancelled"
    }
  }),
  methods: {
    optionSelected(selection) {
      this.$store.commit("UPDATE_ORDER_STATUS", {
        orderId: this.order.id,
        newStatus: selection
      });
    }
  }
};
</script>

<style></style>

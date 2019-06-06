<template>
  <div>
    <div class="flex p-10 pb-0">
      <div class="w-full">
        <h1 class="mb-4">Restaurant Overview</h1>
        <div class="flex">
          <div
            class="flex-1 p-5 rounded m-3 ml-0 bg-gray-400 hover:bg-blue-200 cursor-pointer"
            @click="filter = 'CREATED'"
          >
            <p class="font-bold text-xl mb-2">New orders</p>
            <p class="text-6xl">
              {{ $store.getters.getOrdersByFilter("CREATED").length }}
            </p>
          </div>
          <div
            class="flex-1 p-5 rounded m-3 bg-gray-400 hover:bg-blue-200 cursor-pointer"
            @click="filter = 'COOKED'"
          >
            <p class="font-bold text-xl mb-2">Cooked</p>
            <p class="text-6xl">
              {{ $store.getters.getOrdersByFilter("COOKED").length }}
            </p>
          </div>
          <div
            class="flex-1 p-5 rounded m-3 bg-gray-400 hover:bg-blue-200 cursor-pointer"
            @click="filter = 'DRIVER_RECEIVED'"
          >
            <p class="font-bold text-xl mb-2">Drivers en route</p>
            <p class="text-6xl">
              {{ $store.getters.getOrdersByFilter("DRIVER_RECEIVED").length }}
            </p>
          </div>
          <div
            class="flex-1 p-5 rounded m-3 bg-gray-400 hover:bg-blue-200 cursor-pointer"
            @click="filter = 'DELIVERED'"
          >
            <p class="font-bold text-xl mb-2">Delivered</p>
            <p class="text-6xl">
              {{ $store.getters.getOrdersByFilter("DELIVERED").length }}
            </p>
          </div>
          <div
            class="flex-1 p-5 rounded m-3 mr-0 bg-gray-400 hover:bg-blue-200 cursor-pointer"
            @click="filter = 'CANCELLED'"
          >
            <p class="font-bold text-xl mb-2">Cancelled</p>
            <p class="text-6xl">
              {{ $store.getters.getOrdersByFilter("CANCELLED").length }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="flex px-10">
      <div class="w-full">
        <div class="flex">
          <div class="flex-1 p-5 rounded m-3 mx-0 bg-gray-400">
            <FilteredOrders :filter="filter" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex px-10">
      <div class="w-full">
        <div class="flex">
          <div class="w-1/3 p-5 rounded m-3 ml-0 bg-gray-400">
            <p class="font-bold text-xl mb-2">Best sellers</p>
            <!-- EMPTY STATE -->
            <div
              class="flex items-center justify-center"
              v-if="!Object.values($store.getters.topSellers).length"
            >
              <EmptyState class="mt-5 w-4/5 h-full" />
            </div>
            <!-- BEST SELLERS STATE -->
            <template v-else>
              <div class="flex justify-between border-b-2 border-gray-500">
                <p class="text-xl">Ingredient</p>
                <p class="text-lg"># orders</p>
              </div>
              <div class="mt-2">
                <div
                  v-for="(bestSeller, index) in getBestSellers()"
                  :key="index"
                  class="flex justify-between"
                >
                  <p class="text-xl">{{ bestSeller[0] }}</p>
                  <p class="text-lg">{{ bestSeller[1] }}</p>
                </div>
              </div>
            </template>
          </div>
          <div class="w-1/3 p-5 rounded m-3 bg-gray-400">
            <p class="font-bold text-xl mb-2">Time to delivery</p>
            <!-- EMPTY STATE -->
            <div
              class="flex items-center justify-center"
              v-if="!$store.getters.deliveredOrders.length"
            >
              <EmptyState class="mt-5 w-4/5 h-full" />
            </div>
            <template v-else>
              <div class="flex flex-col justify-around text-center">
                <div>
                  <h1 class="text-5xl">{{ getAverageDeliveryTime() }}</h1>
                  <h1 class="text-xl">Average time to delivery (sec)</h1>
                  <p>
                    from {{ $store.getters.deliveredOrders.length }} delivered
                    orders
                  </p>
                </div>
                <button
                  @click="openTimeToDeliveryModal = true"
                  class="mt-8 p-4 py-2 text-gray-800 font-semibold bg-white hover:bg-gray-100 border rounded focus:outline-none focus:shadow-outline"
                >
                  View orders
                </button>
              </div>

              <!-- MODAL -->
              <Modal
                :open="openTimeToDeliveryModal"
                @close="openTimeToDeliveryModal = false"
              >
                <div
                  class="max-h-screen overflow-scroll w-full bg-white rounded-lg shadow-2xl px-6 py-6"
                  style="width: 50vw"
                >
                  <h2
                    class="font-semibold text-gray-900 text-2xl leading-tight border-b-2 border-gray-200 pb-4"
                  >
                    Time to delivery
                  </h2>
                  <div class="flex mt-5 font-bold">
                    <div class="flex-1 h-12">Order name</div>
                    <div class="flex-1 h-12">Order status</div>
                    <div class="flex-1 h-12">
                      Time to delivery (<i class="fas fa-arrow-down"></i> order)
                    </div>
                  </div>

                  <div
                    class="flex cursor-pointer md:hover:text-blue-600"
                    v-for="(order, index) in getDeliveredOrders()"
                    :key="index"
                    @click="
                      openModal = true;
                      selectedOrder = order;
                    "
                  >
                    <div class="flex-1 h-12">
                      {{ order.name }}
                    </div>
                    <div class="flex-1 h-12">
                      {{ order.currentStatus }}
                    </div>
                    <div class="flex-1 h-12">
                      {{
                        Math.round(
                          ((order.deliveredAt - order.createdAt) / 1000) * 100
                        ) / 100
                      }}
                      seconds
                    </div>
                  </div>

                  <div class="mt-6 flex justify-end">
                    <button
                      @click="openTimeToDeliveryModal = false"
                      class="px-4 py-2 text-gray-800 font-semibold bg-white hover:bg-gray-100 border rounded focus:outline-none focus:shadow-outline"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </Modal>
            </template>
          </div>
          <div class="w-1/3 p-5 rounded m-3 mr-0 bg-gray-400">
            <p class="font-bold text-xl mb-2">Average order value</p>
            <div class="flex items-center justify-center">
              <EmptyState class="mt-5 w-4/5 h-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EmptyState from "../icons/EmptyState.vue";
import FilteredOrders from "../components/FilteredOrders";
import Modal from "../components/Modal.vue";

export default {
  components: {
    EmptyState,
    FilteredOrders,
    Modal
  },

  data() {
    return {
      filter: "CREATED",
      openTimeToDeliveryModal: false
    };
  },

  methods: {
    getBestSellers() {
      return Object.entries(this.$store.getters.topSellers)
        .sort(([key1, value1], [key2, value2]) => {
          return value2 - value1;
        })
        .slice(0, 5);
    },

    getDeliveredOrders() {
      return this.$store.getters.deliveredOrders.sort((a, b) => {
        return b.deliveredAt - b.createdAt - (a.deliveredAt - a.createdAt);
      });
    },

    getAverageDeliveryTime() {
      const totalTime = this.$store.getters.deliveredOrders.reduce(
        (acc, order) => {
          return (acc += order.deliveredAt - order.createdAt);
        },
        0
      );

      const average =
        totalTime / this.$store.getters.deliveredOrders.length / 1000;

      return Math.round(average * 100) / 100;
    }
  }
};
</script>

<style lang="scss">
.btn {
  @apply text-white font-bold py-2 px-4 rounded my-2;
}
.btn-blue {
  @apply bg-blue-500;
}
.btn-blue:hover {
  @apply bg-blue-700;
}
.btn-gray {
  @apply bg-gray-500;
}
.btn-gray:hover {
  @apply bg-gray-700;
}
</style>

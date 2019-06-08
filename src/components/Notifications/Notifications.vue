<template>
  <div
    class="notifications-container transition-all transition-medium z-50"
    v-click-outside="closeNotifications"
    :class="{ hide: !showNotifications }"
  >
    <div class="actions flex justify-between items-center">
      <span
        @click="showNotifications = true"
        class="ml-2 cursor-pointer visible"
        :class="{ invisible: showNotifications }"
        ><i class="fas fa-outdent"></i
      ></span>
      <span
        @click="showNotifications = false"
        class="mr-3 cursor-pointer visible"
        :class="{ invisible: !showNotifications }"
        ><i class="fas fa-indent"></i
      ></span>
    </div>
    <div class="notifications overflow-auto">
      <div v-for="(notification, index) in notifications" :key="index">
        <Notification :notification="notification" />
      </div>
    </div>
  </div>
</template>

<script>
import Notification from "./Notification.vue";

export default {
  components: {
    Notification
  },
  data: () => ({
    showNotifications: true
  }),
  computed: {
    notifications() {
      return this.$store.getters.notifications;
    }
  },
  created() {
    setTimeout(() => {
      this.showNotifications = false;
    }, 5000);
  },
  methods: {
    closeNotifications() {
      if (this.showNotifications) {
        this.showNotifications = false;
      }
    }
  }
};
</script>

<style lang="scss">
.notifications-container {
  position: fixed;
  top: 0;
  right: 0;
  width: 350px;

  &.hide {
    transform: translateX(100%);
  }

  .actions {
    height: 35px;
    margin-left: -35px;
  }

  .notifications {
    height: calc(100vh - 35px);
  }
}
</style>

import { shallowMount } from "@vue/test-utils";
import Home from "@/views/Home.vue";

describe("Home.vue", () => {
  it("renders title", () => {
    const wrapper = shallowMount(Home);
    const title = wrapper.find("h1");
    expect(title.text()).toMatch("Restaurant Overview");
  });
});

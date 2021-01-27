<template>
  <DefaultLayout>
    <template #topbar>
      <TopBar />
    </template>
    <div class="dashboard">
      <div class="dashboard__temperatures">
        <div class="temperature temperature--low">
          <div class="temperature__value">18.3ºC</div>
          <div class="temperature__label">Dwór</div>
        </div>
        <div class="temperature temperature--medium">
          <div class="temperature__value">22.3ºC</div>
          <div class="temperature__label">Salon</div>
        </div>
        <div class="temperature temperature--high">
          <div class="temperature__value">25.6ºC</div>
          <div class="temperature__label">Kuchnia</div>
        </div>
      </div>
      <div class="dashboard__grid">
        <div class="grid__tile" data-group-id="KITCHEN">
          <div>
            <div class="tile__icon"><KitchenIcon size="10vw" /></div>
            <div class="tile__label">Kuchnia</div>
            <div class="tile__lights">
              <span
                v-for="light in getGroupElements('KITCHEN').lights"
                :key="light.id"
                v-show="light.state === 'ON'"
                class="light-dot"
              ></span>
            </div>
            <div class="tile__reeds">
              <span
                v-for="reed in getGroupElements('KITCHEN').reeds"
                :key="reed.id"
                v-show="reed.state === 'OPEN'"
                class="reed-dot"
              ></span>
            </div>
          </div>
        </div>
        <div class="grid__tile" data-group-id="BEDROOM">
          <div>
            <div class="tile__icon"><BedEmptyIcon size="10vw" /></div>
            <div class="tile__label">Sypialnia</div>
            <div class="tile__lights">
              <span
                v-for="light in getGroupElements('BEDROOM').lights"
                :key="light.id"
                v-show="light.state === 'ON'"
                class="light-dot"
              ></span>
            </div>
            <div class="tile__reeds">
              <span
                v-for="reed in getGroupElements('BEDROOM').reeds"
                :key="reed.id"
                v-show="reed.state === 'OPEN'"
                class="reed-dot"
              ></span>
            </div>
          </div>
        </div>
        <div class="grid__tile" data-group-id="BATHROOM">
          <div>
            <div class="tile__icon"><BathroomIcon size="10vw" /></div>
            <div class="tile__label">Łazienki / Pralnia</div>
            <div class="tile__lights">
              <span
                v-for="light in getGroupElements('BATHROOM').lights"
                :key="light.id"
                v-show="light.state === 'ON'"
                class="light-dot"
              ></span>
            </div>
            <div class="tile__reeds">
              <span
                v-for="reed in getGroupElements('BATHROOM').reeds"
                :key="reed.id"
                v-show="reed.state === 'OPEN'"
                class="reed-dot"
              ></span>
            </div>
            <div class="tile__lock"></div>
          </div>
        </div>

        <div class="grid__tile" data-group-id="ROOM_A">
          <div>
            <div class="tile__icon"><MonitorIcon size="10vw" /></div>
            <div class="tile__label">Pokój A</div>
            <div class="tile__lights">
              <span
                v-for="light in getGroupElements('ROOM_A').lights"
                :key="light.id"
                v-show="light.state === 'ON'"
                class="light-dot"
              ></span>
            </div>
            <div class="tile__reeds">
              <span
                v-for="reed in getGroupElements('ROOM_A').reeds"
                :key="reed.id"
                v-show="reed.state === 'OPEN'"
                class="reed-dot"
              ></span>
            </div>
          </div>
        </div>
        <div class="grid__tile" data-group-id="LIVING_ROOM">
          <div>
            <div
              class="tile__icon"
              :class="{
                'tile__icon--active':
                  getGroupElements('LIVING_ROOM').lights &&
                  getGroupElements('LIVING_ROOM').lights.some(
                    (light) => light.state === 'ON'
                  ),
              }"
            >
              <LivingRoomIcon size="10vw" />
            </div>
            <div class="tile__label">Salon</div>
            <div class="tile__lights">
              <span
                v-for="light in getGroupElements('LIVING_ROOM').lights"
                :key="light.id"
                v-show="light.state === 'ON'"
                class="light-dot"
              ></span>
            </div>
            <div class="tile__reeds">
              <span
                v-for="reed in getGroupElements('LIVING_ROOM').reeds"
                :key="reed.id"
                v-show="reed.state === 'OPEN'"
                class="reed-dot"
              ></span>
            </div>
          </div>
        </div>
        <div class="grid__tile" data-group-id="ROOM_B">
          <div>
            <div
              class="tile__icon"
              :class="{
                'tile__icon--active':
                  getGroupElements('ROOM_B').lights &&
                  getGroupElements('ROOM_B').lights.some(
                    (light) => light.state === 'ON'
                  ),
              }"
            >
              <MonitorIcon size="10vw" />
            </div>
            <div class="tile__label">Pokój B</div>
            <div class="tile__lights">
              <span
                v-for="light in getGroupElements('ROOM_B').lights"
                :key="light.id"
                v-show="light.state === 'ON'"
                class="light-dot"
              ></span>
            </div>
            <div class="tile__reeds">
              <span
                v-for="reed in getGroupElements('LIVING_ROOM').reeds"
                :key="reed.id"
                v-show="reed.state === 'OPEN'"
                class="reed-dot"
              ></span>
            </div>
            <div class="tile__lock"></div>
          </div>
        </div>

        <div class="grid__tile" data-group-id="GARAGE_AND_OTHERS">
          <div>
            <div class="tile__icon"><CarSideIcon size="10vw" /></div>
            <div class="tile__label">Garaż | Kotłownia</div>
            <div class="tile__lights">
              <span
                v-for="light in getGroupElements('GARAGE_AND_OTHERS').lights"
                :key="light.id"
                v-show="light.state === 'ON'"
                class="light-dot"
              ></span>
            </div>
            <div class="tile__reeds">
              <span
                v-for="reed in getGroupElements('GARAGE_AND_OTHERS').reeds"
                :key="reed.id"
                v-show="reed.state === 'OPEN'"
                class="reed-dot"
              ></span>
            </div>
            <div class="tile__lock tile__lock--locked">
              <DoorLockedIcon />
            </div>
          </div>
        </div>
        <div class="grid__tile" data-group-id="VESTIBULE">
          <div>
            <div class="tile__icon"><DoorIcon size="10vw" /></div>
            <div class="tile__label">Ganek | Korytarz</div>
            <div class="tile__lights">
              <span
                v-for="light in getGroupElements('VESTIBULE').lights"
                :key="light.id"
                v-show="light.state === 'ON'"
                class="light-dot"
              ></span>
            </div>
            <div class="tile__reeds">
              <span
                v-for="reed in getGroupElements('VESTIBULE').reeds"
                :key="reed.id"
                v-show="reed.state === 'OPEN'"
                class="reed-dot"
              ></span>
            </div>
            <div class="tile__lock tile__lock--unlocked">
              <DoorUnlockedIcon />
            </div>
          </div>
        </div>
        <div class="grid__tile" data-group-id="OUTSIDE">
          <div>
            <div class="tile__icon"><WallIcon size="10vw" /></div>
            <div class="tile__label">Dwór</div>
            <div class="tile__lights">
              <span
                v-for="light in getGroupElements('OUTSIDE').lights"
                :key="light.id"
                v-show="light.state === 'ON'"
                class="light-dot"
              ></span>
            </div>
            <div class="tile__reeds">
              <span
                v-for="reed in getGroupElements('OUTSIDE').reeds"
                :key="reed.id"
                v-show="reed.state === 'OPEN'"
                class="reed-dot"
              ></span>
            </div>
            <div class="tile__lock"></div>
          </div>
        </div>
      </div>
      <div class="dashboard__spacer">
        <span class="spacer__dot">&middot;</span>
        <span class="spacer__dot">&middot;</span>
        <span class="spacer__dot">&middot;</span>
      </div>
      <div class="dashboard__controls">
        <div class="controls__item">
          <LightbulbGroupIcon size="1.5rem" @click="switchAllLights('ON')" />
          <LightbulbGroupOffIcon
            size="1.5rem"
            @click="switchAllLights('OFF')"
          />
        </div>

        <div class="controls__item">
          <LightbulbGroupIcon size="1.5rem" />
          <LightbulbGroupOffIcon size="1.5rem" />
        </div>
        <div class="controls__item">
          <BlindsIcon size="1.5rem" />
          <BlindsOpenIcon size="1.5rem" />
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DefaultLayout from "components/DefaultLayout.vue";
import TopBar from "components/TopBar.vue";

// Icons
import LivingRoomIcon from "vue-material-design-icons/BedKingOutline.vue";
import KitchenIcon from "vue-material-design-icons/SilverwareVariant.vue";
import BedEmptyIcon from "vue-material-design-icons/BedEmpty.vue";
import BathroomIcon from "vue-material-design-icons/Shower.vue";
import WallIcon from "vue-material-design-icons/Wall.vue";
import CarSideIcon from "vue-material-design-icons/CarSide.vue";
import DoorUnlockedIcon from "vue-material-design-icons/DoorOpen.vue";
import DoorIcon from "vue-material-design-icons/DoorClosed.vue";
import DoorLockedIcon from "vue-material-design-icons/DoorClosedLock.vue";
import LightbulbGroupIcon from "vue-material-design-icons/LightbulbGroup.vue";
import LightbulbGroupOffIcon from "vue-material-design-icons/LightbulbGroupOff.vue";
import BlindsIcon from "vue-material-design-icons/Blinds.vue";
import BlindsOpenIcon from "vue-material-design-icons/BlindsOpen.vue";
import MonitorIcon from "vue-material-design-icons/Monitor.vue";
import { getAllThermometers, getAllLights, getAllReeds } from "services/api";

export default {
  name: "Dashboard",
  components: {
    DefaultLayout,
    TopBar,
    LivingRoomIcon,
    KitchenIcon,
    MonitorIcon,
    BedEmptyIcon,
    BathroomIcon,
    CarSideIcon,
    DoorIcon,
    WallIcon,
    DoorUnlockedIcon,
    DoorLockedIcon,
    LightbulbGroupIcon,
    LightbulbGroupOffIcon,
    BlindsIcon,
    BlindsOpenIcon,
  },
  data() {
    return {
      elements: { lights: [], thermometers: [], reeds: [] },
      isTouching: false,
      touchDirection: 0,
      touchLocked: false,
      touchStart: null,
      touchStartTimestamp: null,
      fired: false,
    };
  },
  created: async function () {
    this.elements.lights = await getAllLights();
    this.elements.thermometers = await getAllThermometers();
    this.elements.reeds = await getAllReeds();
  },
  sockets: {
    "lights/state": function (received) {
      const light = this.elements.lights.find(
        (light) => light.id === received.id
      );
      if (light) light.state = received.state;
    },
  },
  methods: {
    switchAllLights(state) {
      this.$socket.emit("lights/set/all", { state });
    },
    getGroupElements(groupId) {
      return {
        lights: this.elements.lights.filter(
          (light) => light.groupId === groupId
        ),
        thermometers: this.elements.thermometers.filter(
          (thermometer) => thermometer.groupId === groupId
        ),
        reeds: this.elements.reeds.filter((reed) => reed.groupId === groupId),
      };
    },
  },
  mounted() {
    const tiles = this.$el.getElementsByClassName("grid__tile");
    const TILE_LOCK_TIME = 350;

    tiles.forEach((tile) => {
      tile.addEventListener("click", () => {
        this.$router.push(`/group/${tile.dataset.groupId}`);
      });

      const tileContent = tile.firstElementChild;
      const fire = () => {
        this.fired = true;
        this.touchLocked = true;
        tileContent.style.transform =
          "translateX(" + this.touchDirection * 100 + "%)";

        setTimeout(() => {
          this.touchLocked = false;
          if (!this.touchStart) tileContent.style.transform = "translateX(0)";
        }, TILE_LOCK_TIME);

        const group = tile.dataset.groupId;
        fetch(
          `http://192.168.1.16:3000/msg?message=group/lights/set&groupId=${group}&state=${
            this.touchDirection === 1 ? "ON" : "OFF"
          }`
        );
      };

      // Start touch
      tile.addEventListener("touchstart", (event) => {
        if (this.touchLocked) return;
        this.debug = JSON.stringify(event.touches);
        this.touchStart = event.touches[0];
        this.touchStartTimestamp = event.timeStamp;

        this.fired = false;
      });

      // Move touch
      tile.addEventListener("touchmove", (event) => {
        if (this.fired) return;
        if (!this.touchStart) return;

        const clientX = event.changedTouches[0].clientX;
        const deltaX = clientX - this.touchStart.clientX; // Distance from touch start
        if (this.touchDirection == 0) {
          this.touchDirection = Math.sign(deltaX);
        }
        const move = deltaX / tile.clientWidth; // Percentage move of tile width
        tileContent.style.transform = `translateX(${move * 100}%)`;

        if (Math.abs(move) > 0.7) {
          fire();
        }
      });

      // End touch
      tile.addEventListener("touchend", (event) => {
        const VELOCITY_THRESHOLD = 0.4;

        if (!this.touchLocked) {
          tileContent.style.transform = "translateX(0)";
        }

        const touchEndTimestamp = event.timeStamp;
        const distance =
          event.changedTouches[0].clientX - (this.touchStart.clientX || 0);
        const deltaTime = touchEndTimestamp - this.touchStartTimestamp;
        const velocity = Math.abs(distance / deltaTime);

        if (velocity > VELOCITY_THRESHOLD && !this.fired) {
          fire();
        }

        this.debug = "end";
        this.touchStart = null;
        this.touchDirection = 0;
        if (!this.touchLocked) tileContent.style.transform = "translateX(0)";
      });
    });
  },
};
</script>

<style lang="stylus" scoped>
.dashboard
  padding 0 1rem
  noSelect()

.dashboard__temperatures
  display grid
  padding 1rem 0
  border-bottom 1px solid cGray800
  font-size 1.25rem
  grid-template-columns auto auto auto

.temperature
  text-align center
  text-shadow 0 0 2px @color

  &__label
    margin-top 0.2rem
    color cGray400
    text-shadow none
    font-size 1rem

  &--low
    color cBlue500

  &--medium
    color cGreen500

  &--high
    color cRed300

.dashboard__grid
  display grid
  grid-template-rows repeat(3 1fr)
  grid-template-columns repeat(3, 1fr)
  place-items center

// Grid item
distanceFromBorder = 0.5rem

.grid__tile
  overflow hidden
  width 100%
  height 33.333vw - 2rem
  border-bottom 1px solid cGray800
  border-left 1px solid cGray800

  &:nth-child(3n+1)
    border-left none

  &>div
    position relative
    position relative
    display flex
    flex-direction column
    justify-content center
    align-items center
    height 100%
    transition 0.1s

  &>div::before
    position absolute
    left -101%
    display block
    width 100%
    height 100%
    background-color cGreen500
    content ''

  &>div::after
    position absolute
    top 0
    left 101%
    display block
    width 100%
    height 100%
    background-color cRed500
    content ''

.tile__label
  margin 0.25rem 0
  color cGray500
  font-size 0.75rem

.tile__icon
  padding 0
  color cGray500

  &--active
    color cGreen500

.tile__lights
  position absolute
  bottom distanceFromBorder
  left distanceFromBorder

.light-dot
  display inline-block
  margin-right 0.4rem
  width 7px
  height 7px
  border-radius 50%
  background-color cGreen500

.tile__reeds
  position absolute
  right distanceFromBorder
  bottom distanceFromBorder

.reed-dot
  display inline-block
  margin-right 0.8rem
  width 4px
  height 7px
  border-top-left-radius @height * 2
  border-bottom-left-radius @height * 2
  background-color cRed300

  &::after
    display block
    margin-left 0.4rem
    width 4px
    height 7px
    border-top-right-radius @height * 2
    border-bottom-right-radius @height * 2
    background-color cRed300
    content ''

.tile__lock
  position absolute
  top distanceFromBorder
  right distanceFromBorder

  &--locked
    color cGreen500

  &--unlocked
    color cRed300

// Spacer
.dashboard__spacer
  display flex
  justify-content center
  align-items center
  padding 1rem 0
  height 2.2rem
  color cGray500
  gap 1rem

.dashboard__controls
  display grid
  height 4rem
  border-top 1px solid cGray800
  grid-template-columns 1fr 1fr 1fr

.controls__item
  display flex
  justify-content center
  align-items center
  height 100%
  color cGray500
  gap 2rem

  svg
    transition 0.5s

  svg:active
    color cGreen500
    transition 0s
    transform scale(1.2)

  &:nth-child(2)
    border-right 1px solid cGray800
    border-left 1px solid cGray800
</style>

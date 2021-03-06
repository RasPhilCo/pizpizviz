<template>
  <v-app style="background: transparent;">
    <v-navigation-drawer
      v-model="showMenu"
      absolute
      temporary
      style="background: lightblue;"
    >
      <v-list dense>
        <v-list-item>
          <v-file-input
            v-model="selectedFiles"
            class="ma-2"
            placeholder="Select pictures"
            prepend-icon="mdi-image"
            multiple
            id="file-selector"
            @change="fileSelected"
          >
          </v-file-input>
        </v-list-item>

        <v-list-item>
          <v-select
            v-model="numOfStacks"
            class="ma-2"
            :items="numOfStacksOptions"
            label="Stacks"
            prepend-icon="mdi-plus-box-multiple"
          >
          </v-select>
        </v-list-item>

        <v-list-item>
          <v-text-field
            v-model="pictureDuration"
            class="ma-2"
            label="Duration (seconds)"
            prepend-icon="mdi-timer-sand"
          >
          </v-text-field>
        </v-list-item>

        <v-list-item>
          <v-text-field
            v-model="transitionSpeed"
            class="ma-2"
            label="Transition (seconds)"
            prepend-icon="mdi-timer"
          >
          </v-text-field>
        </v-list-item>

        <v-list-item
          class="ma-2 font-weight-thin"
        >
          'Z': show/hide menu
          <br/>
          'Ctrl-F': fullscreen
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <v-container
        fluid
        style="margin-top: -12px;"
      >
        <v-row
          v-for="(_, rowIndex) in phantomRows"
          :key="rowIndex"
          no-gutters
        >
          <v-col
            v-bind:class="[`col-${colCSSMap()}`]"
            style="padding: 0px;"
            v-for="(_, colIndex) in phantomStacks"
            :key="colIndex"
          >
            <div class="stack"></div>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<style>
  body {
    background: black;
  }

  .container {
    padding: 0px;
  }

  /*  BEGIN STACK */
  .stack {
    position: relative;
  }

  .stack div {
    position: absolute;
    display: flex;
    height: 100vh;
    width: 100%;
    justify-content: center;
    align-items: center;
  }

  .stack img {
    display: block;
    max-width: 100%;
    max-height: 100%;
  }

  .stack div:nth-of-type(1) {
    animation-name: fadeOut;
    animation-delay: 6s;
    animation-duration: 3s;
    z-index: 2;
  }

  .stack div:nth-of-type(2) {
    z-index: 1;
    animation-name: fadeIn;
    animation-delay: 6s;
    animation-duration: 3s;
    opacity: 0;
  }

  .stack div:nth-of-type(n+3) {
    display: none;
  }

  /* SHARED */

  @keyframes fadeOut {
    from { opacity: 1.0; }
    to   { opacity: 0.0; }
  }

  @keyframes fadeIn {
    from { opacity: 0.0; }
    to   { opacity: 1.0; }
  }
</style>

<script>
export default {
  data: () => ({
    numOfStacks: 1,
    numOfStacksOptions: [1, 2, 4, 9],
    showMenu: true,
    selectedFiles: [],
    pictureDuration: 10,
    transitionSpeed: 3,
  }),
  computed: {
    phantomStacks() {
      const stacks = [];
      for (let index = 0; index < this.colMap(); index += 1) {
        stacks.push(index);
      }
      return stacks;
    },
    phantomRows() {
      const rows = [];
      for (let index = 0; index < this.rowMap(); index += 1) {
        rows.push(index);
      }
      return rows;
    },
  },
  mounted() {
    window.addEventListener('keyup', (event) => {
      if (event.keyCode === 27) {
        this.showMenu = false;
      } else if (event.keyCode === 90) {
        if (this.showMenu) {
          this.showMenu = false;
          return;
        }
        this.showMenu = true;
      }
    });
  },
  watch: {
    numOfStacks() {
      setTimeout(() => {
        this.resetStacks();
        this.buildStacks();
      }, 500);
    },
    multiStacks() {
      setTimeout(() => {
        this.resetStacks();
        this.buildStacks();
      }, 500);
    },
    pictureDuration() {
      setTimeout(() => {
        this.resetStacks();
        this.buildStacks();
      }, 500);
    },
    transitionSpeed() {
      setTimeout(() => {
        this.resetStacks();
        this.buildStacks();
      }, 500);
    },
  },
  methods: {
    rowMap() {
      const i = Number(this.numOfStacks);
      if (i === 4) return 2;
      if (i === 9) return 3;
      return 1;
    },
    colMap() {
      const i = Number(this.numOfStacks);
      if (i === 2) return 2;
      if (i === 4) return 2;
      if (i === 9) return 3;
      return 1;
    },
    colCSSMap() {
      const i = Number(this.numOfStacks);
      if (i === 2) return 6;
      if (i === 4) return 6;
      if (i === 9) return 4;
      return 12;
    },
    heightMap() {
      if (this.rowMap() === 2) return 50;
      if (this.rowMap() === 3) return 33.3;
      return 100;
    },
    fileSelected(selected) {
      this.selectedFiles = selected;
      this.resetStacks();
      this.buildStacks();
    },
    resetStacks() {
      // reset stacks
      const stack = document.getElementsByClassName('stack');
      stack.forEach((s) => {
        // eslint-disable-next-line no-param-reassign
        s.innerHTML = '';
      });
    },
    buildStacks() {
      const fileUrls = this.selectedFiles.map((f) => URL.createObjectURL(f));
      const imageSets = {};
      this.chunkArray(
        this.shuffle(fileUrls),
        fileUrls.length / this.numOfStacks,
      ).forEach((s, idx) => {
        imageSets[idx] = s;
      });

      console.dir('Audit stacks...');
      console.dir(`Num of stacks: ${Object.keys(imageSets).length}`);

      function manipulateDomForStack(id, delay, speed, height) {
        const stack = document.getElementsByClassName('stack')[id];
        stack.style.cssText = `height: ${height}vh;`;
        imageSets[id].forEach((imgSrc) => {
          const domImg = document.createElement('img');
          domImg.src = imgSrc;
          const domDiv = document.createElement('div');
          domDiv.style.cssText = `animation-delay: ${delay}s; animation-duration: ${speed}s; height: ${height}vh;`;
          domDiv.appendChild(domImg);
          stack.appendChild(domDiv);
        });
        const { children } = stack;
        const fadeComplete = (e) => {
          if (e.animationName === 'fadeOut') stack.appendChild(children[0]);
        };
        for (let i = 0; i < children.length; i += 1) {
          children[i].addEventListener('animationend', fadeComplete, false);
        }
      }

      for (let id = 0; id < Object.keys(imageSets).length; id += 1) {
        let delay = this.pictureDuration - this.transitionSpeed;
        if (id >= 1) delay = Math.floor((delay + id) * 1.2);
        manipulateDomForStack(
          id,
          delay,
          this.transitionSpeed,
          this.heightMap(),
        );
      }
    },
    shuffle(data) {
      const a = data;
      let j;
      let x;
      let i;
      for (i = a.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
      }
      return a;
    },
    chunkArray(data, chunksize) {
      const a = data;
      let index = 0;
      const arrayLength = a.length;
      const tempArray = [];

      for (index = 0; index < arrayLength; index += chunksize) {
        const myChunk = a.slice(index, index + chunksize);
        tempArray.push(myChunk);
      }
      return tempArray;
    },
  },
};
</script>

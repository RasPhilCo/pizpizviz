<template>
<v-app style="background: transparent;">
    <v-overlay v-if="!selectedFiles.length"
    absolute="absolute"
    value="overlay"
  >
      Welcome to PizPizViz!<br/>
      Press the 'Z' key for the<br/>
      menu to get started.
  </v-overlay>
  <v-content>
    <v-container
      fluid
      style="margin-top: -12px;"
    >
      <v-row
        style="position:relative;"
      >
        <v-col
          v-bind:class="[multiStacks ? 'col-6' : 'col-12']"
          class="stacks-col"
          style="padding: 0px;"
        >
          <div id="stack1"></div>
        </v-col>
        <v-col
          cols="6"
          class="stacks-col"
          style="padding: 0px;"
          v-if="multiStacks"
        >
          <div id="stack2"></div>
        </v-col>
      </v-row>
    </v-container>
  </v-content>

  <v-row
    v-if="showMenu"
    style="z-index: 9999;"
  >
    <v-col cols=3>
      <v-list style="background-color: lightcoral;">
        <v-list-item>
          <v-file-input
            v-model="selectedFiles"
            placeholder="Upload your pictures"
            multiple
            prepend-icon="mdi-image"
            color="#50dfff"
            id="file-selector"
            @change="fileSelected"
          >
            <template v-slot:selection="{ text }">
              <v-chip
                small
                label
                color="#ff5088"
              >
                {{ text }}
              </v-chip>
            </template>
          </v-file-input>
        </v-list-item>

        <v-list-item>
          <v-switch
            v-model="multiStacks"
            class="ma-2"
            color="#ffba50"
            label="Display multi-stacks"
          >
          </v-switch>
        </v-list-item>

        <v-list-item>
          <v-text-field
            v-model="pictureDuration"
            class="ma-2"
            color="#ffba50"
            label="Duration (seconds)"
          >
            <v-icon slot="prepend" color="#ffba50">mdi-clock</v-icon>
          </v-text-field>
        </v-list-item>

        <v-list-item>
          <v-text-field
            v-model="transitionSpeed"
            class="ma-2"
            color="#ffba50"
            label="Transition (seconds)"
          >
            <v-icon slot="prepend" color="#ffba50">mdi-clock</v-icon>
          </v-text-field>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
</v-app>
</template>

<style>
  body {
    background: black;
    position: relative
  }

  .container {
    padding: 0px;
  }

  /*  BEGIN STACK 1 */
  #stack1 {
    position: relative;
  }

  #stack1 div {
    position: absolute;
    display: flex;
    height: 100vh;
    width: 100%;
    justify-content: center;
    align-items: center;
  }

  #stack1 img {
    display: block;
    max-width:100%;
    max-height:100%;
  }

  #stack1 div:nth-of-type(1) {
    animation-name: fadeOut;
    animation-delay: 6s;
    animation-duration: 3s;
    z-index: 20;
  }

  #stack1 div:nth-of-type(2) {
    z-index: 10;
    animation-name: fadeIn;
    animation-delay: 6s;
    animation-duration: 3s;
    opacity: 0.0;
  }

  #stack1 div:nth-of-type(n+3) {
    display: none;
  }

  /*  BEGIN STACK 2 */
  #stack2 {
    position: relative;
  }

  #stack2 div {
    position: absolute;
    display: flex;
    height: 100vh;
    width: 100%;
    justify-content: center;
    align-items: center;
  }

  #stack2 img {
    display: block;
    max-width:100%;
    max-height:100%;
  }

  #stack2 div:nth-of-type(1) {
    animation-name: fadeOut;
    animation-delay: 7s;
    animation-duration: 3s;
    z-index: 20;
  }

  #stack2 div:nth-of-type(2) {
    z-index: 10;
    animation-name: fadeIn;
    animation-delay: 7s;
    animation-duration: 3s;
    opacity: 0.0;
  }

  #stack2 div:nth-of-type(n+3) {
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
    showMenu: false,
    selectedFiles: [],
    multiStacks: false,
    pictureDuration: 10,
    transitionSpeed: 3,
  }),
  computed: {
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
    fileSelected(selected) {
      this.selectedFiles = selected;
      this.resetStacks();
      this.buildStacks();
    },
    resetStacks() {
      // reset stacks
      const stack1 = document.getElementById('stack1');
      if (stack1) stack1.innerHTML = '';
      const stack2 = document.getElementById('stack2');
      if (stack2) stack2.innerHTML = '';
    },
    buildStacks() {
      const fileUrls = this.selectedFiles.map((f) => URL.createObjectURL(f));
      const imageSets = {};
      const numOfStacks = this.multiStacks ? 2 : 1;
      this.chunkArray(this.shuffle(fileUrls), (fileUrls.length / numOfStacks))
        .forEach((s, idx) => { imageSets[idx + 1] = s; });

      console.dir('Audit stacks...');
      console.dir(`Num of stacks: ${Object.keys(imageSets).length}`);

      function manipulateDomForStack(id, delay, speed) {
        const stack = document.getElementById(`stack${id}`);
        imageSets[id].forEach((imgSrc) => {
          const domImg = document.createElement('img');
          domImg.src = imgSrc;
          const domDiv = document.createElement('div');
          domDiv.style.cssText = `animation-delay: ${delay}s; animation-duration: ${speed}s;`;
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

      for (let id = 1; id <= Object.keys(imageSets).length; id += 1) {
        let delay = (this.pictureDuration - this.transitionSpeed);
        if (id === 2) delay = Math.floor(delay * 1.2);
        manipulateDomForStack(id, delay, this.transitionSpeed);
      }
    },
    shuffle(data) {
      const a = data;
      let j; let x; let
        i;
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

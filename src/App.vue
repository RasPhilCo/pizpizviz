<template>
<v-app style="background: transparent;">
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
      <template v-slot:activator="{ on }">
        <v-btn icon
          color="#ff7f50"
          v-on="on"
        >
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item>
          <v-file-input
            placeholder="Upload your pictures"
            multiple
            prepend-icon="mdi-image"
            color="purple"
            id="file-selector"
            @change="fileSelected"
          >
            <template v-slot:selection="{ text }">
              <v-chip
                small
                label
                color="primary"
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
            label="Multi-stacks"
            @click="buildStacks"
          >
          </v-switch>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
</v-app>
</template>

<style>
  body, html {
    height: 100%;
  }

  body {
    background: black;
    position: relative
  }

  .container {
    padding: 0px;
  }

  #stack1 {
    position: relative;
  }

  #stack1 div {
    position: absolute;
  }

  #stack1 div:nth-of-type(1) {
    animation-name: fader;
    animation-delay: 6s;
    animation-duration: 1s;
    z-index: 20;
  }

  #stack1 div:nth-of-type(2) {
    z-index: 10;
  }

  #stack1 div:nth-of-type(n+3) {
    display: none;
  }

  #stack2 {
    position: relative;
  }

  #stack2 div{
    position: absolute;
  }

  #stack2 div:nth-of-type(1) {
    animation-name: fader;
    animation-delay: 7s;
    animation-duration: 1s;
    z-index: 20;
  }

  #stack2 div:nth-of-type(2) {
    z-index: 10;
  }

  #stack2 div:nth-of-type(n+3) {
    display: none;
  }

  @keyframes fader {
    from { opacity: 1.0; }
    to   { opacity: 0.0; }
  }

</style>

<script>
export default {
  data: () => ({
    showMenu: false,
    selectedFiles: [],
    multiStacks: false,
  }),
  computed: {
  },
  mounted() {
    window.addEventListener('keyup', (event) => {
      if (event.keyCode === 90) {
        if (this.showMenu) {
          this.showMenu = false;
          return;
        }
        this.showMenu = true;
      }
    });
  },
  methods: {
    fileSelected(selected) {
      this.selectedFiles = selected;
      this.buildStacks();
    },
    buildStacks() {
      const fileUrls = this.selectedFiles.map((f) => URL.createObjectURL(f));
      // const fileUrls = [
      //   'https://www.w3schools.com/howto/img_snow_wide.jpg',
      //   'https://www.w3schools.com/howto/img_mountains_wide.jpg',
      //   'https://www.w3schools.com/howto/img_band_ny.jpg',
      //   'https://www.w3schools.com/howto/img_band_la.jpg',
      // ];
      const imageSets = {};
      const numOfStacks = this.multiStacks ? 2 : 1;
      this.chunkArray(this.shuffle(fileUrls), (fileUrls.length / numOfStacks))
        .forEach((s, idx) => { imageSets[idx + 1] = s; });

      function manipulateDomForStack(id) {
        const stack = document.getElementById(`stack${id}`);
        imageSets[id].forEach((imgSrc) => {
          const domImg = document.createElement('img');
          domImg.src = imgSrc;
          domImg.style['max-width'] = '100%';
          domImg.style.height = 'auto';
          const domDiv = document.createElement('div');
          domDiv.appendChild(domImg);
          stack.appendChild(domDiv);
        });
        const { children } = stack;
        const fadeComplete = () => { stack.appendChild(children[0]); };
        for (let i = 0; i < children.length; i += 1) {
          children[i].addEventListener('animationend', fadeComplete, false);
        }
      }

      for (let index = 0; index < Object.keys(imageSets).length; index += 1) {
        manipulateDomForStack(index + 1);
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

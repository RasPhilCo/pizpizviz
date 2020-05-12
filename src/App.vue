<template>
<v-app style="background: transparent;">
  <v-content>
    <v-container fluid>
      <v-row
        style="position:relative;"
      >
        <v-col
          cols="6"
          class="stacks-col"
        >
          <div id="stack-1"></div>
        </v-col>
        <v-col
          cols="6"
          class="stacks-col"
        >
          <div id="stack-2"></div>
        </v-col>
      </v-row>
    </v-container>

<v-file-input
    v-model="files"
    placeholder="Upload your pictures"
    label="Upload your pictures"
    multiple
    prepend-icon="mdi-image"
    color="purple"
    id="file-selector"
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
  </v-content>
 </v-app>
</template>

<style>
  body {
    background: black;
    position: relative
  }

  .stacks-cols {
    padding: 0px;
  }

  #stage1 {
    position: relative;
  }

  #stage1 img {
    position: absolute;
  }

  #stage1 img:nth-of-type(1) {
    animation-name: fader;
    animation-delay: 6s;
    animation-duration: 1s;
    z-index: 20;
  }

  #stage1 img:nth-of-type(2) {
    z-index: 10;
  }

  #stage1 img:nth-of-type(n+3) {
    display: none;
  }

  #stage2 {
    position: relative;
  }

  #stage2 img{
    position: absolute;
  }

  #stage2 img:nth-of-type(1) {
    animation-name: fader;
    animation-delay: 7s;
    animation-duration: 1s;
    z-index: 20;
  }

  #stage2 img:nth-of-type(2) {
    z-index: 10;
  }

  #stage2 img:nth-of-type(n+3) {
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
  }),
  mounted() {
    function shuffle(data) {
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
    }

    function chunkArray(data, chunksize) {
      const a = data;
      let index = 0;
      const arrayLength = a.length;
      const tempArray = [];

      for (index = 0; index < arrayLength; index += chunksize) {
        const myChunk = a.slice(index, index + chunksize);
        tempArray.push(myChunk);
      }
      return tempArray;
    }

    const fileSelector = document.getElementById('file-selector');

    fileSelector.addEventListener('change', (event) => {
      // const fileUrls = [];
      // event.target.files.forEach((f) => { fileUrls.push(URL.createObjectURL(f)); });
      const fileUrls  = [
        'https://www.w3schools.com/howto/img_snow_wide.jpg',
        'https://www.w3schools.com/howto/img_mountains_wide.jpg',
        'https://www.w3schools.com/howto/img_band_ny.jpg',
        'https://www.w3schools.com/howto/img_band_la.jpg',
      ];
      const imageSets = {};
      chunkArray(shuffle(fileUrls), (fileUrls.length / 2))
        .forEach((s, idx) => { imageSets[idx + 1] = s; });

      function manipulateDomForStack(id) {
        const stage = document.getElementById(`stack-${id}`);
        imageSets[id].forEach((imgSrc) => {
          const domImg = document.createElement('img');
          domImg.src = imgSrc;
          domImg.style.width = '100%';
          stage.appendChild(domImg);
        });
        const { children } = stage;
        const fadeComplete = function () { stage.appendChild(children[0]); };
        for (let i = 0; i < children.length; i += 1) {
          children[i].addEventListener('animationend', fadeComplete, false);
        }
      }
      [1, 2].forEach((id) => {
        manipulateDomForStack(id);
      });
    });
  },
};
</script>

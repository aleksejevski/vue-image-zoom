<template lang="pug">
  transition(name="image-zoom-fade", @before-enter="lockScroll")
    .__image-zoom__modal(v-show="visible", @click="modalClicked", :id="id")
      .__image-zoom__close-container
        button.__image-zoom__button.__image-zoom__close-button(@click.stop="openExternal") ↗
        button.__image-zoom__button.__image-zoom__close-button(@click.stop="close") &times;
      .__image-zoom__img-outer-container(:style="{ display: verticalCenter ? 'table' : 'block' }")
        .__image-zoom__img-inner-container(:style="{ display: verticalCenter ? 'table-cell' : 'block' }")
          img(:src="src",:style="{ width: scaledWidth, height: scaledHeight }", ref="img", @load="autoScaleCalc()", @click.stop).__image-zoom__image
      .__image-zoom__scale-container(v-if="allowZoom")
        .__image-zoom__scaler
          button.__image-zoom__button.__image-zoom__scaleButton.__image-zoom__scaleButton-l(@click.stop="scaleDown", :disabled="!canScaleDown") -
          button.__image-zoom__button.__image-zoom__scale(@click.stop="scaleToggle") {{ scaleToShow }}
          button.__image-zoom__button.__image-zoom__scaleButton.__image-zoom__scaleButton-r(@click.stop="scaleUp", :disabled="!canScaleUp") +
</template>

<script>

const scaleList = [10, 25, 30, 33, 40, 50, 60, 67, 75, 90, 100, 110, 125, 150, 200, 250, 300, 400, 600, 800];
const defaultScaleLevel = 10;

export default {
  data () {
    return {
      visible:        false,
      id:             '',

      src:            null,

      allowZoom:      true,
      autoScale:      true,
      scaleLevel:     -1,

      closeOnClickModal: true,

      closed:         false,

      _defaultWidth:  0,
      _defaultHeight: 0,
      _initialized:   false,
    }
  },
  computed: {
    scaleToShow () {
      return scaleList[this.scaleLevel] + ' %';
    },
    scaledWidth () {
      return (this._defaultWidth * scaleList[this.scaleLevel] / 100) + 'px';
    },
    scaledHeight () {
      return (this._defaultHeight * scaleList[this.scaleLevel] / 100) + 'px';
    },
    canScaleDown () {
      return this.scaleLevel > 0;
    },
    canScaleUp () {
      return this.scaleLevel < scaleList.length - 1;
    },
    verticalCenter () {
      const windowHeight = parseInt(window.innerHeight);
      const scaledHeight = parseInt(this._defaultHeight * scaleList[this.scaleLevel] / 100);
      return windowHeight >= scaledHeight;
    }
  },
  watch: {
    closed (newVal) {     // If closed, remove all event handles and destroy the element
      if (newVal) {
        this.visible = false;
        this.destroyElement();
      }
    },

  },
  methods: {
    destroyElement () {
      this.unlockScroll();
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    },
    lockScroll () {
      document.body.style.overflow = 'hidden';
    },
    unlockScroll () {
      document.body.style.overflow = '';
    },

    modalClicked () {
      if (this.closeOnClickModal) {
        this.close();
      }
    },

    setScale (scale) {
      if (scale >= 0 && scale <= scaleList.length - 1) {
        this.scaleLevel = scale;
      }
    },
    scaleDown () {
      if (this.canScaleDown) {
        this.scaleLevel--;
      }
    },
    scaleUp () {
      if (this.canScaleUp) {
        this.scaleLevel++;
      }
    },
    resetScale () {
      this.scaleLevel = defaultScaleLevel;
    },
    autoScaleCalc () {
      const $img = this.$refs.img;
      if (!this._initialized){
        this._defaultHeight = $img.offsetHeight;      // 2000
        this._defaultWidth = $img.offsetWidth;        // 1414
        this._initialized = true;
      }
      if (this.allowZoom && this.autoScale) {
        const windowHeight = window.innerHeight;  // 974
        const windowWidth = window.innerWidth;    // 1366
        
        const imgHeight = $img.offsetHeight;      // 2000
        const imgWidth = $img.offsetWidth;        // 1414

        let currentScale = defaultScaleLevel;
        // Step 1: Is the image widther than the screen? If yes, scale down until it's suitable.
        for (currentScale; currentScale > 0; currentScale--){
          let currentWidth = imgWidth * scaleList[currentScale] / 100
          if (currentWidth < windowWidth) break;
        }
        
        // Step 2: Is it higher? If yes, do so.
        if (currentScale > 0){ // It's meaningless to deal with a zero
          for (currentScale; currentScale > 0; currentScale--){
            let currentHeight = imgHeight * scaleList[currentScale] / 100
            if (currentHeight < windowHeight) break;
          }
        }
        
        // Step 3: Set scale
        this.setScale(currentScale);
      }
    },

    scaleToggle () {
      if (this.scaleLevel === defaultScaleLevel) {
        this.autoScaleCalc();
      } else {
        this.setScale(defaultScaleLevel);
      }
    },

    openExternal () {
      const src = this.src;
      if (!src.startsWith('data:image/')) {
        window.open(src);
      } else {
        const w = window.open('about:blank');
        const t = setTimeout(() => {
          clearTimeout(t);
          w.document.write(`<iframe width="100%" height="100%" frameborder="0" src="${src}"></iframe>`);
        }, 0);
      }
    },

    close () {
      this.closed = true;
    },
  },
}
</script>

<style lang="less">
  .__image-zoom__button {
    min-width:      2em;
    padding:        4px 0;
    text-align:     center;
    color:          #fff;
    text-shadow:    0px 0px 2px #888;
    font-size:      16px;
    line-height:    18px;
    border:         2px solid #ddd;
    background:     rgba(0, 0, 0, .1);

    &:first-child {
      border-top-left-radius:     6px;
      border-bottom-left-radius:  6px;
    }
    &:last-child {
      border-top-right-radius:    6px;
      border-bottom-right-radius: 6px;
    }
    &:nth-child(n+2) {
      border-left:    0;
    }
  }

  .__image-zoom__modal {
    position:   fixed;
    top:        0;
    left:       0;
    height:     100%;
    width:      100%;

    background: rgba(0, 0, 0, .8);
  }
  .__image-zoom__close-container {
    position:       fixed;
    top:            5%;
    right:          5%;
    z-index:        10;

    box-sizing:     border-box;
    display:        block;
    cursor:         default;
  }

  .__image-zoom__img-outer-container {
    display:    table;
    overflow:   auto;
    width:      100%;
    height:     100%;
  }
  .__image-zoom__img-inner-container {
    display:        table-cell;
    vertical-align: middle;
    text-align:     center;
  }
  .__image-zoom__image {
    background:     rgba(255, 255, 255, .1);
  }

  .__image-zoom__scale-container {
    position:   fixed;
    bottom:     5%;
    left:       0;
    width:      100%;

    text-align: center;
  }

  .__image-zoom__scaler {
    box-sizing:     border-box;
    display:        inline-block;
    text-align:     center;
    background:     rgba(0, 0, 0, .1);
    border-radius:  6px;
  }
  .__image-zoom__scale {
    display:        inline-block;
    width:          6em;
  }
  .__image-zoom__scaleButton {
    display:        inline-block;
    width:          2em;

    &:disabled {
      color:        #888;
      border-color: #888;
    }
  }
  
  .__image-zoom__scaler {
    box-sizing:     border-box;
    display:        inline-block;
  }
</style>


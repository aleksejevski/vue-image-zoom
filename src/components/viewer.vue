<template lang="pug">
  transition(name="image-zoom-fade", @before-enter="lockScroll")
    .__image-zoom__modal(v-show="visible", @click="modalClicked", :id="id")
      .__image-zoom__close_container(@click.stop="close")
        .__image-zoom__close &times;
      .__image-zoom__container
        img(:src="src",:style="'transform: scale(' + scale + ')'").__image-zoom__image
      .__image-zoom__scale_container(v-if="allowZoom")
        .__image-zoom__scaler
          button.__image-zoom__scaleButton.__image-zoom__scaleButton-l(@click="scaleDown", :disabled="!canScaleDown") -
          span.__image-zoom__scale {{ scaleToShow }}
          button.__image-zoom__scaleButton.__image-zoom__scaleButton-r(@click="scaleUp", :disabled="!canScaleUp") +
</template>

<script>

const scaleList = [25, 33, 50, 67, 75, 100, 110, 125, 150, 200, 250, 300, 400, 600, 800];

export default {
  data () {
    return {
      visible:      false,
      customClass:  '',
      id:           '',

      src:          null,

      allowZoom:    true,
      scaleLevel:   5,

      closeOnClickModal: true,

      closed:       false,
    }
  },
  computed: {
    scaleToShow () {
      return scaleList[this.scaleLevel] + ' %';
    },
    scale () {
      return scaleList[this.scaleLevel] / 100 ;
    },
    canScaleDown () {
      return this.scaleLevel > 0;
    },
    canScaleUp () {
      return this.scaleLevel < scaleList.length - 1
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

    close () {
      this.closed = true;
    },

  }
}
</script>

<style lang="less">
  .__image-zoom__modal {
    position:   fixed;
    top:        0;
    left:       0;
    height:     100%;
    width:      100%;

    background: rgba(0, 0, 0, .8);
  }
  .__image-zoom__close_container {
    position:       fixed;
    top:            5%;
    right:          5%;

    box-sizing:     border-box;
    display:        block;
    width:          24px;
    height:         24px;
    border:         2px solid #ccc;
    border-radius:  12px;
  }
  .__image-zoom__close {
    color:          #ccc;
    text-align:     center;
    line-height:    20px;
    font-weight:    bold;
  }
  .__image-zoom__container {
    display:          flex;
    align-items:      center; // 垂直居中
    justify-content:  center; // 水平居中
    width:      100%;
    height:     100%;
  }
  .__image-zoom__image {
    display:    block;
  }

  .__image-zoom__scale_container {
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
  }
  .__image-zoom__scale {
    // box-sizing:     border-box;
    display:        inline-block;
    width:          6em;
    padding:        4px 0;
    text-align:     center;
    color:          #eee;
    font-size:      16px;
  }
  .__image-zoom__scaleButton {
    display:        inline-block;
    width:          2em;
    padding:        4px 0;
    text-align:     center;
    color:          #eee;
    font-size:      16px;
    border:         2px solid #ccc;
    background:     transparent;

    &:disabled {
      color:        #888;
      border-color: #888;
    }
  }
  .__image-zoom__scaleButton-l {
    border-top-left-radius:     6px;
    border-bottom-left-radius:  6px;
  }
  .__image-zoom__scaleButton-r {
    border-top-right-radius:    6px;
    border-bottom-right-radius: 6px;
  }
  .__image-zoom__scaler {
    box-sizing:     border-box;
    display:        inline-block;
  }
</style>


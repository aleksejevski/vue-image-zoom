<template lang="pug">
  transition(name="image-zoom-fade", @before-enter="lockScroll")
    .__image-zoom__modal(v-show="visible", @click="modalClicked", :id="id")
      .__image-zoom__close_container(@click.stop="close")
        .__image-zoom__close &times;
      .__image-zoom__container
        img(:src="src",:style="'transform: scale(' + scale + ')'").__image-zoom__image
      .__image-zoom__scale_container(v-if="allowZoom")
        .__image-zoom__scaler
          button(@click="scaleDown") -
          span {{ scaleToShow }}
          button(@click="scaleUp") +
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
      if (this.scaleLevel > 0) {
        this.scaleLevel--;
      }
    },
    scaleUp () {
      if (this.scaleLevel < scaleList.length - 1) {
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

    background: rgba(0, 0, 0, .75);
  }
  .__image-zoom__close_container {
    position:   fixed;
    top:        5%;
    right:      5%;
  }
  .__image-zoom__close {
    display:        block;
    width:          16px;
    height:         16px;
    border:         1px solid #ccc;
    border-radius:  8px;

    color:          #ccc;
    text-align:     center;
    line-height:    1;
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
    display:    inline-block;
    color:      #eee;
  }
</style>


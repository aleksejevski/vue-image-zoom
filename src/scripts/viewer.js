import Vue from 'vue';
import rGen from '../gadgets/randomIdGen.js';
import viewerComponent from '../components/viewer.vue';

let viewerConstuctor = Vue.extend(viewerComponent);

let instance ;
let seed = 1;
const baseZIndex = 3000;

const randomId = rGen();

let Viewer = function (options = {}, options2) {  // No pollution!
  if (Vue.prototype.$isServer) return;      // No SSR, nor Sharuru

  let settings = {} ;
  if (typeof options2 === 'object') {
    settings = options2;
  }
  if (typeof options === 'string') {    // like ' this.$zoom(imgSrc) '
    settings.src = options;
  } else {
    settings = option;  // Ignore options2
  }

  const id = `image-zoom_${randomId}_${seed++}`;

  instance = new viewerConstuctor({
    data: settings
  });
  instance.id = id;
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
  instance.vm.visible = true;
  instance.dom = instance.vm.$el;
  instance.dom.style.zIndex = baseZIndex + seed;
  return instance.vm;
}

export default Viewer;
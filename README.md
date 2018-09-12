# vue-image-zoom

A vue-based image viewer plugin with zooming

## Install

```
$ npm install -D vue-image-zoom
```

```JavaScript
// main.js

import zoom from 'vue-image-zoom';
import 'vue-image-zoom/dist/vue-image-zoom.css';

Vue.use(zoom);
```

## Usage

Normal:

```JavaScript
this.$zoom('/path/to/your/img');
```

With Params:

```JavaScript
this.$zoom('/path/to/your/img', {
  allowZoom:          true,  // When false, zooming is not available. Image will be shown on 100% size.
  autoScale:          true,  // When true, if the image is larger than the screen, it will be automatically scaled down until suitable. Along with 'allowZoom'
  closeOnClickModal:  false, // When false, clicking modal layer will close the viewer.
});
```
import Viewer from './scripts/viewer.js';

const install = function(Vue,options = {}) {
	/* istanbul ignore if */
	if (install.installed) return;
	
	Vue.prototype.$zoom = Viewer;
};

if (typeof window !== 'undefined' && window.Vue) {
	install(window.Vue);
};

export default {
	version:	'1.0.0',
	install,
}
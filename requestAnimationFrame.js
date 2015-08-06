import {setTimeout, clearTimeout} from './window'

const TARGET_FPS = 60
var requests = Object.create(null)
var raf_handle = 0
var timeout_handle = -1

function onFrameTimer () {
	var cur_requests = requests;
	requests = Object.create(null);
	timeout_handle = -1;
	Object.keys(cur_requests).forEach(function(id) {
		var request = cur_requests[id];
		if (!request.element || isVisible(request.element))
			request.callback(Date.now());
	});
}

export function requestAnimationFrame (callback, element) {
	var cb_handle = ++raf_handle
	requests[cb_handle] = {callback: callback, element: element}
	if (timeout_handle === -1) {
		timeout_handle = setTimeout(onFrameTimer, 1000 / TARGET_FPS)
	}
	return cb_handle
}

export function cancelAnimationFrame(handle) {
	delete requests[handle];
	if (Object.keys(requests).length === 0) {
		clearTimeout(timeout_handle);
		timeout_handle = -1;
	}
}

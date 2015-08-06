import {ActiveXObject} from './window'

function XMLHttpRequest () {
	try { return new ActiveXObject("Msxml2.XMLHTTP.6.0") } catch (_) { }
	try { return new ActiveXObject("Msxml2.XMLHTTP.3.0") } catch (_) { }
	try { return new ActiveXObject("Msxml2.XMLHTTP") } catch (_) { }
	throw Error("This browser does not support XMLHttpRequest.")
}

// XMLHttpRequest interface constants
// Needed for IE8-
XMLHttpRequest.UNSENT = 0
XMLHttpRequest.OPENED = 1
XMLHttpRequest.HEADERS_RECEIVED = 2
XMLHttpRequest.LOADING = 3
XMLHttpRequest.DONE = 4

export default XMLHttpRequest

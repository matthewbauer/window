import {setTimeout} from './window'

export default function setImmediate (callback) {
	var params = [].slice.call(arguments, 1)
	return setTimeout(function () {
		callback.apply(null, params)
	}, 0)
}

import exports from './exports.js'
import config from './config.json'

const props = config.prop
const prefixes = config.prefixes

export default function (window={}) {
	function addProps (add) {
		props.forEach(function (prop) {
			if (!window[prop]) {
				window[prop] = add(window, prop)
			}
		})
	}
	addProps(function (prop) {
		for (var prefix in prefixes) {
			if (window[prefix + prop]) {
				return window[prefix + prop]
			}
		}
	})
	addProps(function (prop) {
		return exports[prop]
	})
	addProps(function (prop) {
		throw 'Could not shim ' + prop
	})
	return window
}

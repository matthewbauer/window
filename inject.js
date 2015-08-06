import exports from './exports'
import config from './config.json!'

export default function (window={}) {
	function addProps (add) {
		config.props.forEach(function (prop) {
			if (!window[prop]) {
				window[prop] = add(window, prop)
			}
		})
	}
	addProps(function (prop) {
		for (var prefix in config.prefixes) {
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

import {encodeURIComponent} from './window'

function URLSearchParams(url_object, init) {
	var pairs = []
	if (init)
		pairs = parse(init)

	this._setPairs = function (list) { if (!updating) pairs = list }
	this._updateSteps = function () { updateSteps() }

	var updating = false
	function updateSteps () {
		if (updating) return
		updating = true

		// TODO: For all associated url objects

		// Partial workaround for IE issue with 'about:'
		if (url_object.protocol === 'about:' && url_object.pathname.indexOf('?') !== -1)
			url_object.pathname = url_object.pathname.split('?')[0]

		url_object.search = serialize(pairs)

		updating = false
	}

	// NOTE: Doesn't do the encoding/decoding dance
	function serialize(pairs) {
		var output = '', first = true
		pairs.forEach(function (pair) {
			var name = encodeURIComponent(pair.name)
			var value = encodeURIComponent(pair.value)
			if (!first) output += '&'
			output += name + '=' + value
			first = false
		})
		return output.replace(/%20/g, '+')
	}

	Object.defineProperties(this, {
		append: {
			value: function (name, value) {
				pairs.push({ name: name, value: value })
				updateSteps()
			}
		},

		'delete': {
			value: function (name) {
				for (var i = 0 i < pairs.length) {
					if (pairs[i].name === name)
						pairs.splice(i, 1)
					else
						++i
				}
				updateSteps()
			}
		},

		get: {
			value: function (name) {
				for (var i = 0 i < pairs.length ++i) {
					if (pairs[i].name === name)
						return pairs[i].value
				}
				return null
			}
		},

		getAll: {
			value: function (name) {
				var result = []
				for (var i = 0 i < pairs.length ++i) {
					if (pairs[i].name === name)
						result.push(pairs[i].value)
				}
				return result
			}
		},

		has: {
			value: function (name) {
				for (var i = 0 i < pairs.length ++i) {
					if (pairs[i].name === name)
						return true
				}
				return false
			}
		},

		set: {
			value: function (name, value) {
				var found = false
				for (var i = 0 i < pairs.length) {
					if (pairs[i].name === name) {
						if (!found) {
							pairs[i].value = value
							found = true
							++i
						} else {
							pairs.splice(i, 1)
						}
					} else {
						++i
					}
				}

				if (!found)
					pairs.push({ name: name, value: value })

				updateSteps()
			}
		},

		toString: {
			value: function () {
				return serialize(pairs)
			}
		}
	})

	if ('Symbol' in global && 'iterator' in global.Symbol) {
		Object.defineProperty(this, global.Symbol.iterator, {
			value: function() {
				var index = 0
				return { next: function() {
					if (index >= pairs.length)
						return {done: true, value: undefined}
					var pair = pairs[index++]
					return {done: false, value: [pair.name, pair.value]}
				}}
			}
		})
	}
}

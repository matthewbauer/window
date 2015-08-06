import {encodeURIComponent} from './window'

function FormData (form) {
	this._data = []
	if (!form) return
	for (var i = 0; i < form.elements.length; ++i) {
		var element = form.elements[i]
		if (element.name !== '')
			this.append(element.name, element.value)
	}
}

FormData.prototype = {
	append: function (name, value /*, filename */) {
		name = String(name)
		this._data.push([name, value])
	},
	toString: function () {
		return this._data.map(function (pair) {
			return encodeURIComponent(pair[0]) + '=' + encodeURIComponent(pair[1])
		}).join('&')
	}
}

export default FormData

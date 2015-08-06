// based off of github.com/github/fetch

import {FileReader, Blob, FormData} from './window'

function decode (body) {
  var form = new FormData()
  body.trim().split('&').forEach(function (bytes) {
    if (bytes) {
      var split = bytes.split('=')
      var name = split.shift().replace(/\+/g, ' ')
      var value = split.join('=').replace(/\+/g, ' ')
      form.append(decodeURIComponent(name), decodeURIComponent(value))
    }
  })
  return form
}

function consumed (body) {
  if (body.bodyUsed) {
    return Promise.reject(new TypeError('Already read'))
  }
  body.bodyUsed = true
}

function fileReaderReady (reader) {
  return new Promise(function (resolve, reject) {
    reader.onload = function () {
      resolve(reader.result)
    }
    reader.onerror = function () {
      reject(reader.error)
    }
  })
}

function readBlobAsArrayBuffer (blob) {
  var reader = new FileReader()
  reader.readAsArrayBuffer(blob)
  return fileReaderReady(reader)
}

function readBlobAsText (blob) {
  var reader = new FileReader()
  reader.readAsText(blob)
  return fileReaderReady(reader)
}

export default function Body () {
  this.bodyUsed = false

  this._initBody = function (body) {
    this._bodyInit = body
    if (typeof body === 'string') {
      this._bodyText = body
    } else if (Blob.prototype.isPrototypeOf(body)) {
      this._bodyBlob = body
    } else if (FormData.prototype.isPrototypeOf(body)) {
      this._bodyFormData = body
    } else if (!body) {
      this._bodyText = ''
    } else {
      throw new Error('unsupported BodyInit type')
    }
  }

  this.blob = function () {
    var rejected = consumed(this)
    if (rejected) {
      return rejected
    }

    if (this._bodyBlob) {
      return Promise.resolve(this._bodyBlob)
    } else if (this._bodyFormData) {
      throw new Error('could not read FormData body as blob')
    } else {
      return Promise.resolve(new Blob([this._bodyText]))
    }
  }

  this.arrayBuffer = function () {
    return this.blob().then(readBlobAsArrayBuffer)
  }

  this.text = function () {
    var rejected = consumed(this)
    if (rejected) {
      return rejected
    }

    if (this._bodyBlob) {
      return readBlobAsText(this._bodyBlob)
    } else if (this._bodyFormData) {
      throw new Error('could not read FormData body as text')
    } else {
      return Promise.resolve(this._bodyText)
    }
  }

  this.formData = function () {
    return this.text().then(decode)
  }

  this.json = function () {
    return this.text().then(JSON.parse)
  }

  return this
}

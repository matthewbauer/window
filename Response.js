// based off of github.com/github/fetch

import {Headers, Body} from './window'

function Response (bodyInit, options) {
  if (!options) {
    options = {}
  }

  this._initBody(bodyInit)
  this.type = 'default'
  this.url = null
  this.status = options.status
  this.ok = this.status >= 200 && this.status < 300
  this.statusText = options.statusText
  this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
  this.url = options.url || ''
}

Body.call(Response.prototype)

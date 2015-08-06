import {clearTimeout} from './window'

export default function clearImmediate (handle) {
	clearTimeout(handle)
}

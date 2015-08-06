import inject from './inject'

if (typeof window !== 'undefined') {
	inject(window)
} else if (typeof global !== 'undefined') {
	inject(global)
} else if (typeof self !== 'undefined') {
	inject(self)
} else {
	inject()
}

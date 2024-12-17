function normalizeRgbChannel(channel){
	channel /= 255

	return 100 * (channel > 0.04045
		? Math.pow((channel + 0.055) / 1.055, 2.4)
		: channel / 12.92
	)
}

function normalizeXyzChannel(channel){
	return (channel > 0.008856)
		? Math.pow(channel, 1/3)
		: (7.787 * channel) + (16 / 116)
}

function RGB_TO_LAB({r,g,b}){
	r = normalizeRgbChannel(r)
	g = normalizeRgbChannel(g)
	b = normalizeRgbChannel(b)

	let X = r * 0.4124 + g * 0.3576 + b * 0.1805
	let Y = r * 0.2126 + g * 0.7152 + b * 0.0722
	let Z = r * 0.0193 + g * 0.1192 + b * 0.9505

	X = normalizeXyzChannel(X / 95.0470)
	Y = normalizeXyzChannel(Y / 100.0)
	Z = normalizeXyzChannel(Z / 108.883)

	return {
		L: (116 * Y) - 16,
		a: 500 * (X - Y),
		b: 200 * (Y - Z)
	}
}
export default RGB_TO_LAB
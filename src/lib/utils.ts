export function rgb2hex(_rgb: string) {
	const rgb = _rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
	if (rgb) {
		function hex(x: string) {
			return `0${Number.parseInt(x).toString(16)}`.slice(-2);
		}
		return `#${hex(rgb[1])}${hex(rgb[2])}${hex(rgb[3])}`;
	}

	console.log("rgb2hex illegal color input:", _rgb);
	return "#000000";
}

export function hexToHsv(hex: string): { h: number; s: number; l: number } {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

	if (!result) {
		throw new Error("Could not parse Hex Color");
	}

	const rHex = Number.parseInt(result[1], 16);
	const gHex = Number.parseInt(result[2], 16);
	const bHex = Number.parseInt(result[3], 16);

	const r = rHex / 255;
	const g = gHex / 255;
	const b = bHex / 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);

	let h = (max + min) / 2;
	let s = h;
	let l = h;

	if (max === min) {
		// Achromatic
		return { h: 0, s: 0, l };
	}

	const d = max - min;
	s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	switch (max) {
		case r:
			h = (g - b) / d + (g < b ? 6 : 0);
			break;
		case g:
			h = (b - r) / d + 2;
			break;
		case b:
			h = (r - g) / d + 4;
			break;
	}
	h /= 6;

	s = s * 100;
	s = Math.round(s);
	l = l * 100;
	l = Math.round(l);
	h = Math.round(360 * h);

	return { h, s, l };
}

export function hsvToHex(h: number, s: number, v: number) {
	const l = v / 100;
	const a = (s * Math.min(l, 1 - l)) / 100;
	const f = (n: number) => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color)
			.toString(16)
			.padStart(2, "0"); // convert to Hex and prefix "0" if needed
	};
	return `#${f(0)}${f(8)}${f(4)}`;
}

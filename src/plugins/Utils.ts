export function stringToCamelCase(val: string): string {
	return val.replace(/^([A-Z])|\s(\w)/g, function (match, p1, p2, offset) {
		if (p2) return p2.toUpperCase();
		return p1.toLowerCase();
	});
}

export function stringToCamelCase(val: string): string {
	return val.replace(/^([A-Z])|\s(\w)/g, function (match, p1, p2, offset) {
		if (p2) return p2.toUpperCase();
		return p1.toLowerCase();
	});
}

export function joinString(arr: string[], join = "and"): string {
	if (arr.length === 1) return arr[0];
	const firsts = arr.slice(0, arr.length - 1);
	const last = arr[arr.length - 1];
	return `${firsts.join(", ")} ${join} ${last}`;
}

export function invariant(value: string): string {
	return value.toLowerCase().replace(" ", "");
}

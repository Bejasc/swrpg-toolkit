import axios from "axios";

export async function getData<T>(collection: string, id?: string, version?: string): Promise<T[]> {
	const swrpgApi = "https://swrpg.bejasc.dev/api"; //import.meta.env.VITE_SWRPG_API ?? "NOT PROVIDED";

	let url = swrpgApi;
	if (version) url = `${url}/${version}`;
	url = `${url}/${collection}`;

	//if ID provided, add to the request
	if (id) url += `/${id}`;

	console.log(url);
	const response = await axios({
		method: "get",
		url,
		headers: {
			"Content-Type": "application/json",
		},
	});

	const result: T[] = JSON.parse(JSON.stringify(response.data));
	return result;
}

export async function postData<T>(collection: string, item: T): Promise<T | null> {
	const swrpgApi = "https://swrpg.bejasc.dev/api"; //process.env.VUE_APP_SWRPG_API ?? "NOT PROVIDED";

	const url = swrpgApi + collection;

	const body = JSON.stringify(item);
	console.log(body);
	const response = await axios({
		method: "post",
		url,
		headers: {
			"Content-Type": "application/json",
		},
		data: body,
	});

	console.log(response.status);

	if (response.status === 200) {
		const result: T = JSON.parse(JSON.stringify(response.data));
		return result;
	} else {
		//TODO handle ot her response types
		return null;
	}
}

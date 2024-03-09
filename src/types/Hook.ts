// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IHook {
	title: string;
	thumbnail: string | undefined;
	image: string | undefined;
	description: string;
}

export class Hook implements IHook {
	title: string;
	thumbnail: string;
	image: string;
	description: string;

	constructor() {
		this.title = "";
		this.thumbnail = "";
		this.image = "";
		this.description = "";
	}

	toCommand(): string {
		return `^!hook "${this.title}"${this.image.length > 0 ? ` --image=${this.image}` : ""}${this.thumbnail.length > 0 ? ` --thumbnail=${this.thumbnail}` : ""} "${this.description}"`;
	}
}

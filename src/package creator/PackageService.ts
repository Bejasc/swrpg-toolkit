import type { IBasePackage } from "@/types/packages/BasePackage";
import type IItem from "@/types/SwrpgTypes/IItem";

export class Package implements IBasePackage {
	public packageInfo: { author: string; name: string; description?: string | undefined; dateCreated: Date };

	private items: IItem[] = [];

	public constructor({ name, author, description }: { name: string; author: string; description?: string }) {
		this.packageInfo = {
			name,
			author,
			description: description ?? "Created with the SWRPG Contributor Tools",
			dateCreated: new Date(),
		};
	}

	public addItem(item: IItem) {
		this.items.push(item);
	}

	public removeItem(item: IItem) {
		this.items = this.items.filter((i) => i !== item);
	}

	public getItems(): IItem[] {
		return this.items;
	}

	public exportPackage(): string {
		return JSON.stringify(this, null, 2);
	}
}

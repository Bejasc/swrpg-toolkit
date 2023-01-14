import mongoose from "mongoose";

export interface IEventBase {
	id: string;
	author?: string;
	/**Is this event avaialable via random events? */
	circulationOptions?: {
		allowCirculation: boolean;
		/**By default, the event will be available in all Locations */
		locationOptions?: ILocationOptions;
		frequency?: Frequency;
		frequencyOverride?: {
			location: string;
			frequency: Frequency;
		}[];
	};
	timeout?: number;
	postOnNoReact?: boolean;
	embedOptions?: IEmbedOptions;
	eventLinks?: IEventLink[];
	requirements?: {
		match: RequirementMatch;
		conditions: IEventCondition[];
		failEvent: IEventBase;
	};
	results?: {
		pickRandom?: boolean;
		changes: IEventResult[];
	};
}

export type Frequency = "Disabled" | "Common" | "Regular" | "Uncommon" | "Rare" | "Legendary";

export interface ILocationOptions {
	/**When set to Whitelist, Locations will *only* be selected from values. When set to Blacklist, any location in values will be ignored. */
	type: "whitelist" | "blacklist";
	/**List of Location names or IDs to use */
	values: string[];
}

export interface IEventLink {
	title: string;
	emoji?: string;
	description?: string;
	event: IEventBase[];
}

export interface IEmbedOptions {
	author?: {
		avatar?: string;
		name?: string;
	};
	/**The Title of the Discord Embed */
	title?: string;
	/**The Description shown in the Embed */
	description?: string;
	image?: string;
	thumbnail?: string;
	/**The colour that appears dow nthe side of the embed */
	color?: string;
}

export type RequirementMatch = "Any of" | "All of" | "None of";
export type IEventOperator = "<" | ">=" | "==" | "!=";
export interface IEventCondition {
	identifier: string;
	match: RequirementMatch;
	subConditions: IEventSubCondition[];
}

export interface IEventSubCondition {
	type: "item" | "location" | "credits" | "hitpoints" | "skill" | "attribute" | "species";
	key: string;
	value: string | number;
	operator: IEventOperator;
}

export interface IEventResult {
	modifier: "add" | "subtract" | "set";
	type: "item" | "credits" | "affinity" | "skill" | "experience" | "hitpoints" | "location" | "primaryWeapon" | "secondaryWeapon" | "ship" | "equipment" | "flag";
	key: string;
	value: string | number | null;
}

export interface IItemQuantity {
	itemId: string;
	count: number;
}

export interface ISkillLevel {
	skill: string;
	level: number;
}

export interface IAffinity {
	faction: string;
	points: number;
}

export function DEFAULT_EVENT_STATE(): IEventBase {
	const event: IEventBase = {
		id: new mongoose.Types.ObjectId().toString(),
		embedOptions: {
			title: "Event Title",
			color: "#E6A00E",
		},
	};
	return event;
}

export interface IEventHelper {
	locationMode: "blacklist" | "whitelist";
	locationValues: string[];
	spawnEverywhere: boolean;
}

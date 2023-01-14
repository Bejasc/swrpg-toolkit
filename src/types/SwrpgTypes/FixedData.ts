//TODO get these from the API
//The reason this hasn't been done, is the types used in swrpg itself are fairly complex. Species references Skill and Attribute by name, etc.
//Would need to create a service for each of those, reference things by ID instead, etc.

export const supportedSpecies = [
	{ title: "Human", value: "human" },
	{ title: "Rodian", value: "rodian" },
	{ title: "Twi'lek", value: "twilek" },
	{ title: "Duros", value: "duros" },
	{ title: "Tradnoshan", value: "trandoshan" },
	{ title: "Chiss", value: "chiss" },
];

export const supportedSkills = ["Computer Use", "Mechanics", "Persuasion", "Control", "Awareness", "Survival", "Athletics", "Hand-tohand", "Stealth", "Marksman"];

export const supportedAttributes = ["Strength", "Dexterity", "Intelligence", "Constitution", "Wisdom", "Charisma"];

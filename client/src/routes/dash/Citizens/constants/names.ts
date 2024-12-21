// Seedable random number generator
function mulberry32(a: number) {
	return function () {
		let t = (a += 0x6d2b79f5);
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

// Function to generate name pair from an ID
export function generateNamePair(id: string): {
	firstName: string;
	lastName: string;
} {
	const GLOBAL_SEED = 'game0'; // Change this to a unique seed for each game

	const input = GLOBAL_SEED + id;
	const seed = input
		.split('')
		.reduce((acc, char) => acc + char.charCodeAt(0), 0);
	const rng = mulberry32(seed);

	// Use the seeded random number generator to select names
	const firstNameIndex = Math.floor(rng() * firstNames.length);
	const lastNameIndex = Math.floor(rng() * firstNames.length);

	return {
		firstName: firstNames[firstNameIndex],
		lastName: firstNames[lastNameIndex]
	};
}

/**
 * LIST OF NAMES
 *
 * */

/* prettier-ignore */
const firstNames_Male = [
'David', 'Mike', 'John', 'Chris', 'Robert', 'Michael', 'William', 'James', 'Charles', 'Joseph',
'Anthony', 'Kevin', 'Brian', 'Gary', 'Steven', 'Kenneth', 'Paul', 'Jason', 'Mark', 'Richard',
'Thomas', 'Daniel', 'Matthew', 'Donald', 'George', 'Kenneth', 'Edward', 'Ronald', 'Timothy', 'Jeffrey',
'Frank', 'Scott', 'Eric', 'Stephen', 'Andrew', 'Raymond', 'Gregory', 'Joshua', 'Jerry', 'Dennis',
'Walter', 'Patrick', 'Peter', 'Harold', 'Douglas', 'Henry', 'Carl', 'Arthur', 'Ryan', 'Roger',
'Joe', 'Juan', 'Jack', 'Albert', 'Jonathan', 'Justin', 'Terry', 'Gerald', 'Keith', 'Samuel',
'Willie', 'Ralph', 'Lawrence', 'Nicholas', 'Roy', 'Benjamin', 'Bruce', 'Brandon', 'Adam', 'Harry',
'Fred', 'Wayne', 'Billy', 'Steve', 'Louis', 'Jeremy', 'Aaron', 'Randy', 'Howard', 'Eugene',
'Carlos', 'Russell', 'Bobby', 'Victor', 'Martin', 'Ernest', 'Phillip', 'Todd', 'Jesse', 'Craig',
'Alan', 'Shawn', 'Clarence', 'Sean', 'Philip', 'Chris', 'Johnny', 'Earl', 'Jimmy', 'Antonio',
'Danny', 'Bryan', 'Tony', 'Luis', 'Mike', 'Stanley', 'Leonard', 'Nathan', 'Dale', 'Manuel',
'Rodney', 'Curtis', 'Norman', 'Allen', 'Marvin', 'Vincent', 'Glenn', 'Jeffery', 'Travis', 'Jeff',
'Chad', 'Jacob', 'Lee', 'Melvin', 'Alfred', 'Kyle', 'Francis', 'Bradley', 'Jesus', 'Herbert',
'Frederick', 'Ray', 'Joel', 'Edwin', 'Don', 'Eddie', 'Ricky', 'Troy', 'Randall', 'Barry',
'Alexander', 'Bernard', 'Mario', 'Leroy', 'Francisco', 'Marcus', 'Micheal', 'Theodore', 'Clifford', 'Miguel',
'Oscar', 'Jay', 'Jim', 'Tom', 'Calvin', 'Alex', 'Jon', 'Ronnie', 'Bill', 'Lloyd',
'Ted', 'Harvey', 'Caleb', 'Sam', 'Tony', 'Darrell', 'Derrick', 'Warren', 'Dwight', 'Kent',
];

/* prettier-ignore */
const firstNames_Female = [
'Amy', 'Beth', 'Cara', 'Dana', 'Emma', 'Faye', 'Gina', 'Haley', 'Ivy', 'Jill',
'Karen', 'Lisa', 'Megan', 'Nina', 'Olivia', 'Paula', 'Quinn', 'Rachel', 'Sara', 'Tina',
'Una', 'Vicki', 'Wendy', 'Xena', 'Yara', 'Zoe', 'Alice', 'Bella', 'Cathy', 'Diana',
'Elise', 'Fiona', 'Grace', 'Holly', 'Iris', 'Julia', 'Kate', 'Laura', 'Mary', 'Nancy',
'Opal', 'Penny', 'Quincy', 'Rita', 'Samantha', 'Tanya', 'Uma', 'Violet', 'Willa', 'Xandra',
'Yolanda', 'Zara', 'Abigail', 'Brianna', 'Charlotte', 'Danielle', 'Elizabeth', 'Faith', 'Georgia', 'Hannah',
'Isabel', 'Jade', 'Kylie', 'Leah', 'Madison', 'Natalie', 'Olivia', 'Paige', 'Quinn', 'Rebecca',
'Sophia', 'Taylor', 'Uma', 'Veronica', 'Whitney', 'Ximena', 'Yvette', 'Zoe', 'Adelaide', 'Beatrice',
'Clara', 'Delilah', 'Eleanor', 'Frances', 'Gabrielle', 'Hazel', 'Isla', 'Josephine', 'Katherine',
'Lillian', 'Molly', 'Nora', 'Olive', 'Penelope', 'Quinn', 'Rose', 'Scarlett', 'Tessa', 'Una',
'Valerie', 'Wendy', 'Xanthe', 'Yasmin', 'Zelda', 'Alexa', 'Bailey', 'Cassie', 'Doris', 'Evelyn',
'Felicity', 'Gemma', 'Harriet', 'Ivy', 'Jasmine', 'Kiera', 'Lola', 'Maeve', 'Nora', 'Ophelia',
'Phoebe', 'Quinn', 'Ruby', 'Sadie', 'Tiffany', 'Una', 'Violet', 'Willow', 'Xena', 'Yara',
'Zara', 'Annabelle', 'Bridget', 'Cora', 'Daisy', 'Edith', 'Freya', 'Georgia', 'Hazel', 'Imogen',
'Jane', 'Kira', 'Luna', 'Mia', 'Naomi', 'Odette', 'Piper', 'Quinn', 'Roxanne', 'Savannah',
'Tara', 'Una', 'Vivian', 'Winona', 'Xandra', 'Yvonne', 'Zoe', 'Adele', 'Bonnie', 'Camilla',
'Dorothy', 'Eloise', 'Faye', 'Genevieve', 'Harlow', 'Irene', 'Jodie', 'Kylie', 'Lily', 'Marissa',
'Nora', 'Opal', 'Paris', 'Quinn', 'Renee', 'Stella', 'Thea', 'Una', 'Vera', 'Wren',
'Xena', 'Yael', 'Zoe'
]

/* prettier-ignore */
const firstNames_Special = [
'Neon', 'Byte', 'Circuit', 'Pixel', 'Glitch', 'Hacker', 'Echo', 'Volt', 'Blade', 'Cipher',
'Drone', 'Flux', 'Grid', 'Helix', 'Ion', 'Jazz', 'Kilo', 'Laser', 'Matrix', 'Nano',
'Omega', 'Ping', 'Quantum', 'Razor', 'Silicon', 'Tera', 'Upload', 'Vector', 'Watt', 'Xeno',
'Yottabyte', 'Zero', 'Aether', 'Binary', 'Cyber', 'Data', 'Entropy', 'Fractal', 'Giga', 'Hologram',
'Infinitum', 'Jolt', 'Krypt', 'Link', 'Megabyte', 'Neuron', 'Override', 'Portal', 'Quark', 'Rift',
'Script', 'Terabyte', 'Uplink', 'Virus', 'Widget', 'Xenon', 'Yield', 'Zap', 'Access', 'Bit',
'Code', 'Droid', 'Erase', 'Feed', 'Gizmo', 'Hertz', 'Intruder', 'Jinx', 'Kernel', 'Loop',
'Modem', 'Node', 'Optic', 'Patch', 'Query', 'Radix', 'Scanner', 'Trace', 'Unit', 'Voxel',
'Widget', 'X-Ray', 'Yotta', 'Zip', 'Ampere', 'Bot', 'Chip', 'Disk', 'Encrypt', 'Firewall',
'Gear', 'Hex', 'Icon', 'Jitter', 'Key', 'Logic', 'Mainframe', 'Network', 'Oscillator', 'Patch',
'Query', 'Robot', 'Stream', 'Thread', 'Upload', 'Virus', 'Wafer', 'Xen', 'Yottasecond', 'Zettabyte',
'Alpha', 'Beta', 'Cache', 'Debug', 'Ether', 'Flash', 'Ghost', 'Hash', 'Iota', 'Jammer',
'Kode', 'Lag', 'Modem', 'Nuke', 'Override', 'Probe', 'Quantum', 'Reboot', 'Scanner', 'Toggle',
'Update', 'Vector', 'Wave', 'Xenon', 'Yield', 'Zap', 'Amp', 'Bandwidth', 'Core', 'Drone',
'Echo', 'Frame', 'Gigahertz', 'Hub', 'Interface', 'Jack', 'Keyframe', 'Latency', 'Morph', 'Node',
'Ops', 'Packet', 'Qbit', 'Render', 'Sensor', 'Trace', 'User', 'Vertex', 'Wattage', 'Xcode',
'Yottabit', 'Zeta', 'Alias', 'Botnet', 'Cloud', 'Daemon', 'Encrypt', 'Firewall', 'Gadget', 'Hack',
'Input', 'Jive', 'Kilohertz', 'Log', 'Machine', 'Null', 'Output', 'Ping', 'Quantum', 'Router',
'Script', 'Tech', 'Unix', 'Voxel', 'Web', 'Xeno', 'Yield', 'Zap'
]

/* prettier-ignore */
const lastNames = [
'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
'Digital', 'Byte', 'Circuit', 'Pixel', 'Glitch', 'Hacker', 'Echo', 'Volt', 'Blade', 'Cipher',
'Drone', 'Flux', 'Grid', 'Helix', 'Ion', 'Jazz', 'Kilo', 'Laser', 'Matrix', 'Nano',
'Omega', 'Ping', 'Quantum', 'Razor', 'Silicon', 'Tera', 'Upload', 'Vector', 'Watt', 'Xeno',
'Yottabyte', 'Zero', 'Aether', 'Binary', 'Cyber', 'Data', 'Entropy', 'Fractal', 'Giga', 'Hologram',
'Infinitum', 'Jolt', 'Krypt', 'Link', 'Megabyte', 'Neuron', 'Override', 'Portal', 'Quark', 'Rift',
'Script', 'Terabyte', 'Uplink', 'Virus', 'Widget', 'Xenon', 'Yield', 'Zap', 'Access', 'Bit',
'Code', 'Droid', 'Erase', 'Feed', 'Gizmo', 'Hertz', 'Intruder', 'Jinx', 'Kernel', 'Loop',
'Modem', 'Node', 'Optic', 'Patch', 'Query', 'Radix', 'Scanner', 'Trace', 'Unit', 'Voxel',
'Widget', 'X-Ray', 'Yotta', 'Zip', 'Ampere', 'Bot', 'Chip', 'Disk', 'Encrypt', 'Firewall',
'Gear', 'Hex', 'Icon', 'Jitter', 'Key', 'Logic', 'Mainframe', 'Network', 'Oscillator', 'Patch',
'Query', 'Robot', 'Stream', 'Thread', 'Upload', 'Virus', 'Wafer', 'Xen', 'Yottasecond', 'Zettabyte',
'Alpha', 'Beta', 'Cache', 'Debug', 'Ether', 'Flash', 'Ghost', 'Hash', 'Iota', 'Jammer',
'Kode', 'Lag', 'Modem', 'Nuke', 'Override', 'Probe', 'Quantum', 'Reboot', 'Scanner', 'Toggle',
'Update', 'Vector', 'Wave', 'Xenon', 'Yield', 'Zap', 'Amp', 'Bandwidth', 'Core', 'Drone',
'Echo', 'Frame', 'Gigahertz', 'Hub', 'Interface', 'Jack', 'Keyframe', 'Latency', 'Morph', 'Node',
'Ops', 'Packet', 'Qbit', 'Render', 'Sensor', 'Trace', 'User', 'Vertex', 'Wattage', 'Xcode',
'Yottabit', 'Zeta'
]

const firstNames = [
	...firstNames_Male,
	...firstNames_Female,
	...firstNames_Special
];

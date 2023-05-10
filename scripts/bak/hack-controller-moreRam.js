/** @param {NS} ns */
export async function main(ns) {
	let targets = ns.scan();
	let threads = 2;
	for (let x = 0; x < targets.length; x++) {
		let target = targets[x];
		if (ns.hasRootAccess(target) == false) {
			if(ns.getServerNumPortsRequired(target) === 0) ns.nuke(target);
		}else{
			ns.run('/scripts/utility/base.js',threads,target);
		}
	}
}
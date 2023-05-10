/** @param {NS} ns */
export async function main(ns) {

}
/** @param {NS} ns */
export function spreadScript(ns, script, ownedServer, toExploit) {
	if (!ns.fileExists(script, ownedServer)) {
		ns.scp(script, ownedServer, "home");
	}
	runScript(ns, script, ownedServer, toExploit);
}
/** @param {NS} ns */
export function runScript(ns, script, ownedServer, toExploit){
	if (!ns.scriptRunning(script, ownedServer)) {
		let getThreads = Math.floor(ns.getServerMaxRam(ownedServer) / 2.40);
		let threads = (getThreads !== 0) ? getThreads : 1;
		let scriptPID = ns.exec(script, ownedServer, threads, toExploit);
		if (scriptPID !== 0) {
			ns.tprint("Running script on " + ownedServer + "with PID: " + scriptPID);
		}
	}
}
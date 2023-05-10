/** This script automatically scans all available server that can be hacked and
 *  spreads a given exploit.
 */
/** @param {NS} ns */
import { spreadScript } from "/scripts/utility/scripts.js";
let visited = [];
let toExploit;
export async function main(ns) {
    toExploit = (ns.args.length !== 0) ? ns.args[0] : null;
    let targets = ns.scan();
    let hacks = getHacks(ns);
    scanTargets(ns, targets, hacks);
    if (toExploit !== null) {
        visited.forEach((target) => { hackTargets(ns, target); })
    }
}
/** @param {NS} ns */
function scanTargets(ns, targets, hacks) {
    if (targets.length === 0) {
        return;
    }
    else {
        targets.forEach(async (target) => {
            if (!visited.includes(target)) {
                visited.push(target);
                if (ns.hasRootAccess(target) === false) {
                    await attemptRoot(ns, target, hacks);
                }
                else {
                    // await automateBackdoorInstallation(ns, target);
                    scanTargets(ns, ns.scan(target), hacks);
                }
            }
        });
    }
}
/** @param {NS} ns */
async function attemptRoot(ns, target, hacks) {
    let reqPorts = ns.getServerNumPortsRequired(target);
    if (reqPorts <= hacks.length) {
        for (let y = 0; y < reqPorts; y++) {
            hacks[y](target);
        }
        let playerHackingSkill = ns.getPlayer().skills.hacking;
        if (playerHackingSkill >= ns.getServerRequiredHackingLevel(target)) {
            ns.nuke(target);
            ns.tprintf("Rooted: %s", target);
        }
        else {
            ns.tprintf("Failed to root %s : Needs %d more hacking skill to be hacked.", target, playerHackingSkill - hacks.length);
        }
        //await automateBackdoorInstallation(ns, target);
    }
    else {
        ns.tprintf("Failed to root %s : Needs %d more open ports to be hacked.", target, reqPorts - hacks.length);
    }
}
/** @param {NS} ns  NEEDS SOURCE FILE 4*/
// async function automateBackdoorInstallation(ns, target) {
// 	ns.singularity.connect(target);
// 	await ns.singularity.installBackdoor();
// }
/** @param {NS} ns */
function getHacks(ns) {
    let hacks = ["BruteSSH.exe", "FTPCrack.exe"];
    let hacksFunction = [ns.brutessh, ns.ftpcrack];
    let retVal = [];
    let count = 0;

    while (count < hacks.length) {
        if (ns.fileExists(hacks[count], "home")) {
            retVal.push(hacksFunction[count]);
            count++;
        }
    }
    return retVal;
}

function hackTargets(ns, target) {
    // await automateBackdoorInstallation(ns, target); TO ADD
    spreadScript(ns, "/scripts/hacks/exploit.js", target, toExploit);
}
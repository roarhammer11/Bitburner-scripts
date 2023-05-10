/** @param {NS} ns */
export async function main(ns) {
    let availableMoney = ns.getPlayer().money;
    ns.tprint(availableMoney);
    let purchaseServerThreshold = ns.getPurchasedServerLimit();
    let ownedServers = ns.getPurchasedServers();
    dynamicallyPurchaseServers(ns, availableMoney, purchaseServerThreshold, ownedServers.length);
    dynamicallyUpgradeServers(ns, availableMoney, purchaseServerThreshold, ownedServers);
}
/** @param {NS} ns */
function dynamicallyPurchaseServers(ns, availableMoney, purchaseServerThreshold, numberOfOwnedServers) {
    let ram = getOptimalRam(ns, availableMoney, purchaseServerThreshold, numberOfOwnedServers);
    for (let x = numberOfOwnedServers; x < purchaseServerThreshold; x++) {
        ns.purchaseServer("Server-" + (x + 1), Math.pow(2, ram));
    }
}
/** @param {NS} ns */
function dynamicallyUpgradeServers(ns, availableMoney, purchaseServerThreshold, ownedServers) {
    let ram = getOptimalRam(ns, availableMoney, purchaseServerThreshold, ownedServers.length);
    ownedServers.forEach((server) => {
        if (ns.upgradePurchasedServer(server, ram)) {
            ns.tprint("Successfully upgraded" + server);
        } else {
            ns.tprint("Could not upgrade" + server);
        }
    })
}

function getOptimalRam(ns, availableMoney, purchaseServerThreshold) {
    let i = 1;

    for (; i <= 20 && (ns.getPurchasedServerCost(Math.pow(2, i + 1))) <= Math.ceil(availableMoney / purchaseServerThreshold); i++) { }
    return Math.pow(2, i);
}
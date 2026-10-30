import dns from "dns";
import { env } from "./env";

// Node's default resolver can be unreachable on some machines (127.0.0.1),
// which breaks mongodb+srv:// SRV lookups. Point Node at DNS_SERVERS if set.
if (env.dnsServers.length) {
  dns.setServers(env.dnsServers);
}

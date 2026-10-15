import { SearchItem } from '@/types';
import { CURRICULUM_TOPICS } from './curriculum';
import { CERTIFICATIONS } from './certifications';
import { ENTERPRISE_PRODUCTS } from './products';

export const HIGH_PROFILE_CVES: SearchItem[] = [
  {
    id: 'cve-2024-3400',
    title: 'CVE-2024-3400: PAN-OS GlobalProtect Command Injection',
    type: 'cve',
    category: 'Vulnerabilities & CVEs',
    description: 'Critical unauthenticated remote code execution vulnerability in Palo Alto Networks PAN-OS GlobalProtect gateway feature allowing root compromise.',
    href: '/knowledge/tier-2/next-generation-firewalls-pan-os-fortigate-checkpoint',
    tags: ['palo alto', 'pan-os', 'globalprotect', 'cve-2024-3400', 'rce', 'critical', 'firewall'],
  },
  {
    id: 'cve-2024-21762',
    title: 'CVE-2024-21762: Fortinet FortiOS SSL VPN Out-of-Bound Write',
    type: 'cve',
    category: 'Vulnerabilities & CVEs',
    description: 'Critical out-of-bounds write vulnerability in FortiOS SSL VPN daemon allowing unauthenticated remote code execution via specifically crafted HTTP requests.',
    href: '/knowledge/tier-2/next-generation-firewalls-pan-os-fortigate-checkpoint',
    tags: ['fortinet', 'fortios', 'ssl vpn', 'cve-2024-21762', 'rce', 'critical'],
  },
  {
    id: 'cve-2023-20198',
    title: 'CVE-2023-20198: Cisco IOS XE Web UI Privilege Escalation',
    type: 'cve',
    category: 'Vulnerabilities & CVEs',
    description: 'Active exploitation in Cisco IOS XE Software Web UI feature permitting an unauthenticated remote attacker to create a local user account with privilege level 15.',
    href: '/knowledge/tier-0/linux-socket-troubleshooting-netsec-tools',
    tags: ['cisco', 'ios-xe', 'cve-2023-20198', 'privilege escalation', 'zero-day'],
  },
  {
    id: 'cve-2021-44228',
    title: 'CVE-2021-44228: Log4Shell JNDI Injection Vulnerability',
    type: 'cve',
    category: 'Vulnerabilities & CVEs',
    description: 'Critical remote code execution flaw in Apache Log4j2 JNDI parsing affecting enterprise network appliances, SIEMs, and management consoles worldwide.',
    href: '/knowledge/tier-1/network-acl-snort-suricata-ids-ips-mechanics',
    tags: ['log4shell', 'log4j', 'cve-2021-44228', 'jndi', 'rce', 'snort signature'],
  },
  {
    id: 'cve-2014-0160',
    title: 'CVE-2014-0160: OpenSSL Heartbleed Information Disclosure',
    type: 'cve',
    category: 'Vulnerabilities & CVEs',
    description: 'Memory over-read in OpenSSL TLS heartbeat extension allowing remote attackers to leak server private keys and plaintext session data across the wire.',
    href: '/knowledge/tier-1/applied-cryptography-pki-tls13-mechanics',
    tags: ['heartbleed', 'openssl', 'cve-2014-0160', 'tls', 'crypto', 'memory leak'],
  },
];

export const VENDOR_COMMAND_ITEMS: SearchItem[] = [
  {
    id: 'cmd-tcpdump-hex',
    title: 'tcpdump -i eth0 -nn -XX tcp',
    type: 'command',
    category: 'Vendor Commands',
    description: 'Capture raw TCP packets with numerical IP addresses and print both hexadecimal and ASCII payload bytes.',
    href: '/labs?tab=terminal',
    tags: ['linux', 'tcpdump', 'packet capture', 'pcap', 'hex dump'],
  },
  {
    id: 'cmd-ss-tulpn',
    title: 'ss -tulpn',
    type: 'command',
    category: 'Vendor Commands',
    description: 'Display all listening TCP and UDP sockets with numerical port numbers and associated process IDs (PIDs).',
    href: '/labs?tab=terminal',
    tags: ['linux', 'sockets', 'ss', 'netstat', 'ports'],
  },
  {
    id: 'cmd-cisco-extended-acl',
    title: 'ip access-list extended <NAME>',
    type: 'command',
    category: 'Vendor Commands',
    description: 'Configure named extended access control list with sequence number management on Cisco IOS-XE routers and switches.',
    href: '/labs?tab=terminal',
    tags: ['cisco', 'acl', 'firewall', 'ios-xe', 'security'],
  },
  {
    id: 'cmd-palo-test-policy',
    title: 'test security-policy-match',
    type: 'command',
    category: 'Vendor Commands',
    description: 'Palo Alto PAN-OS operational CLI command to simulate a packet 5-tuple and identify exactly which security rule evaluates it.',
    href: '/products?vendor=palo-alto-pan-os',
    tags: ['palo alto', 'pan-os', 'troubleshooting', 'policy match'],
  },
  {
    id: 'cmd-fortigate-sniffer',
    title: 'diagnose sniffer packet any "<filter>" 4 10 a',
    type: 'command',
    category: 'Vendor Commands',
    description: 'FortiOS built-in command-line packet sniffer with level 4 verbosity and absolute timestamps.',
    href: '/products?vendor=fortinet-fortigate',
    tags: ['fortinet', 'fortigate', 'sniffer', 'packet capture', 'fortios'],
  },
  {
    id: 'cmd-checkpoint-fw-monitor',
    title: 'fw monitor -e "accept host(<IP>);"',
    type: 'command',
    category: 'Vendor Commands',
    description: 'Check Point Gaia kernel inspection tool tracking packet traversal across pre-inbound (i), post-inbound (I), pre-outbound (o), and post-outbound (O) inspection points.',
    href: '/products?vendor=checkpoint-gaia',
    tags: ['check point', 'gaia', 'fw monitor', 'troubleshooting'],
  },
];

export function getAllSearchItems(): SearchItem[] {
  const topicItems: SearchItem[] = CURRICULUM_TOPICS.map((topic) => ({
    id: topic.id,
    title: topic.title,
    type: 'topic',
    category: topic.tierName,
    description: topic.summary,
    href: `/knowledge/${topic.tierId}/${topic.slug}`,
    tags: [
      topic.category.toLowerCase(),
      topic.difficulty.toLowerCase(),
      ...topic.certAlignments.map((c) => c.toLowerCase()),
      ...topic.keyConcepts.map((k) => k.title.toLowerCase()),
    ],
  }));

  const certItems: SearchItem[] = CERTIFICATIONS.map((cert) => ({
    id: cert.id,
    title: `${cert.code} - ${cert.name}`,
    type: 'cert',
    category: 'Certifications',
    description: cert.summary,
    href: `/certs?cert=${cert.id}`,
    tags: [cert.vendor.toLowerCase(), cert.level.toLowerCase(), cert.code.toLowerCase(), 'exam', 'certification'],
  }));

  const productItems: SearchItem[] = ENTERPRISE_PRODUCTS.map((prod) => ({
    id: prod.id,
    title: prod.name,
    type: 'product',
    category: prod.category,
    description: prod.description,
    href: `/products?product=${prod.id}`,
    tags: [prod.vendor.toLowerCase(), prod.category.toLowerCase(), prod.badge.toLowerCase(), 'firewall', 'enterprise'],
  }));

  return [...topicItems, ...certItems, ...productItems, ...HIGH_PROFILE_CVES, ...VENDOR_COMMAND_ITEMS];
}

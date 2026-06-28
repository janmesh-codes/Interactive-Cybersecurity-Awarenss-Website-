let vpnOn = false;

const toggleEl = document.getElementById('vpn-toggle');
const toggleLabel = document.getElementById('toggle-label');
const vpnStatus = document.getElementById('vpn-status');
const packetDot = document.getElementById('packet-dot');
const packetLabel = document.getElementById('packet-label');
const vpnLog = document.getElementById('vpn-log');

toggleEl.addEventListener('click', () => {
  vpnOn = !vpnOn;
  toggleEl.classList.toggle('on', vpnOn);
  toggleLabel.textContent = `VPN: ${vpnOn ? 'ON' : 'OFF'}`;

  if (vpnOn) {
    vpnStatus.className = 'vpn-status on';
    vpnStatus.textContent = '● ENCRYPTED';

    packetDot.className = 'packet-dot encrypted';
    packetLabel.className = 'packet-label enc';
    packetLabel.textContent = 'AES-256 ENCRYPTED';

    vpnLog.innerHTML = `
<span style="color:var(--glow)">✔</span>  VPN: CONNECTED<br>
<span style="color:var(--glow)">✔</span>  Protocol: WireGuard / OpenVPN<br>
<span style="color:var(--glow)">✔</span>  Encryption: AES-256-GCM<br>
<span style="color:var(--glow)">✔</span>  Traffic: Fully encrypted tunnel<br>
<span style="color:var(--glow)">✔</span>  Visible to network: Only encrypted VPN packets<br>
<span style="color:var(--glow)">✔</span>  Attacker sees: ████████████████████ (nothing useful)<br>
<span style="color:var(--text-dim)">_</span><span class="cursor"></span>
    `;
  } else {
    vpnStatus.className = 'vpn-status off';
    vpnStatus.textContent = '● UNPROTECTED';

    packetDot.className = 'packet-dot plain';
    packetLabel.className = 'packet-label plain';
    packetLabel.textContent = 'PLAINTEXT DATA';

    vpnLog.innerHTML = `
<span style="color:var(--accent)">⚠</span>  VPN: DISABLED<br>
<span style="color:var(--accent)">⚠</span>  Traffic: UNENCRYPTED<br>
<span style="color:var(--accent)">⚠</span>  Risk: Attacker on same network CAN intercept data<br>
<span style="color:var(--accent)">⚠</span>  Visible to network: Websites visited, login credentials, form data<br>
<span style="color:var(--text-dim)">_</span><span class="cursor"></span>
    `;
  }
});

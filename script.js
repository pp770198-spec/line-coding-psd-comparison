// JavaScript extracted from index.html
/* Globals */
let currentBits = [];
let currentScheme = "";
/* ===============================
   NAVIGATION + HINT SYSTEM CLEAN
================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- PAGE SWITCHING ---------- */

  const navButtons = document.querySelectorAll(".topnav .nav-btn[data-section]");
  const panels = document.querySelectorAll(".panel");
  const hintBtn = document.getElementById("hintToggle");
  const hintPanel = document.getElementById("hintPanel");

  navButtons.forEach(btn => {
    btn.addEventListener("click", function () {

      const target = btn.getAttribute("data-section");

      // Switch panels
      panels.forEach(p => p.classList.remove("active"));
      const activePanel = document.getElementById(target);
      if (activePanel) activePanel.classList.add("active");

      // Highlight active nav
      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Show hint only in simulation
      if (target === "simulation") {
        if (hintBtn) hintBtn.style.display = "block";
      } else {
        if (hintBtn) hintBtn.style.display = "none";
        if (hintPanel) hintPanel.classList.remove("show-hint");
      }

    });
  });

  /* ---------- HINT TOGGLE ---------- */
  if (hintBtn && hintPanel) {
    hintBtn.addEventListener("click", function () {
      hintPanel.classList.toggle("show-hint");
    });
  }

  /* ---------- AUTO GENERATE FROM HINT ---------- */

  function generateBits(len) {
    let s = "";
    for (let i = 0; i < len; i++) {
      s += Math.random() < 0.5 ? "0" : "1";
    }
    return s;
  }

  function autoGenerate(bits, schemeName) {
    const input = document.getElementById("bitSeq");
    const schemeSelect = document.getElementById("scheme");
    const renderBtn = document.getElementById("renderBtn");

    if (!input || !schemeSelect || !renderBtn) return;

    input.value = bits;
    schemeSelect.value = schemeName;

    renderBtn.click(); // auto generate waveform + PSD
  }

  const btnNormal = document.getElementById("btnNormal");
  const btnHDB3 = document.getElementById("btnHDB3");
  const btnB8ZS = document.getElementById("btnB8ZS");

  if (btnNormal) {
    btnNormal.addEventListener("click", function () {
      autoGenerate(generateBits(8), "Polar NRZ-L");
    });
  }

  if (btnHDB3) {
    btnHDB3.addEventListener("click", function () {
      autoGenerate(generateBits(12) + "0000", "HDB3");
    });
  }

  if (btnB8ZS) {
    btnB8ZS.addEventListener("click", function () {
      autoGenerate(generateBits(8) + "00000000", "B8ZS");
    });
  }

});
/* ---------- College logo fallback ---------- */
(function(){
  const logo = document.querySelector(".college-logo");
  if (!logo) return;

  const candidates = [
    "ptuLogo.png",
    "Emblem_of_Puducherry_Technological_University.png",
    "ptu-logo.png"
  ];

  let idx = candidates.indexOf(logo.getAttribute("src")) ;
  if (idx < 0) idx = 0;

  logo.addEventListener("error", ()=>{
    const nextIdx = idx + 1;
    if (nextIdx >= candidates.length) {
      logo.style.display = "none";
      return;
    }
    idx = nextIdx;
    logo.src = candidates[idx];
  });
})();


/* ---------- Schemes list (exact 12 you requested) ---------- */
const schemes = {
  "Unipolar Codes": ["Unipolar NRZ","Unipolar RZ"],
  "Polar Codes": ["Polar NRZ-L","Polar NRZ-I","Polar RZ","Manchester","Differential Manchester"],
  "Bipolar Codes": ["AMI","Pseudoternary"],
  "Scrambling": ["HDB3","B8ZS"],
  "Partial Response": ["Duobinary","Modified Duobinary"]
};

// Compact qualitative properties for each scheme (for comparison insight)
const schemeProps = {
  "Unipolar NRZ": {
    bw: "low (narrow main lobe)",
    dc: "strong DC component",
    sync: "poor synchronization for long runs",
    note: "very simple but not suitable for transformer-coupled links"
  },
  "Unipolar RZ": {
    bw: "higher than Unipolar NRZ (due to RZ pulses)",
    dc: "still has DC component",
    sync: "better sync thanks to frequent zero crossings",
    note: "trade-off between bandwidth and timing recovery"
  },
  "Polar NRZ-L": {
    bw: "similar to NRZ but more efficient than unipolar",
    dc: "reduced DC for balanced data",
    sync: "sync issue for long constant patterns",
    note: "good power efficiency compared to unipolar"
  },
  "Polar NRZ-I": {
    bw: "similar to Polar NRZ-L",
    dc: "no DC for random data",
    sync: "better than NRZ-L (inversions on 1s)",
    note: "information carried in transitions rather than absolute level"
  },
  "Polar RZ": {
    bw: "higher than NRZ (RZ pulses)",
    dc: "small DC component possible",
    sync: "good timing due to regular returns to zero",
    note: "useful when clock recovery is important"
  },
  "Manchester": {
    bw: "high (approximately double NRZ)",
    dc: "no DC component",
    sync: "excellent self-synchronization",
    note: "ideal when robust clock recovery is more important than bandwidth"
  },
  "Differential Manchester": {
    bw: "high (similar to Manchester)",
    dc: "no DC component",
    sync: "excellent, robust to polarity inversion",
    note: "preferred on links where polarity may flip"
  },
  "AMI": {
    bw: "moderate",
    dc: "practically zero DC (alternate marks)",
    sync: "good for random data, worse for long zero runs",
    note: "supports simple violation-based error monitoring"
  },
  "Pseudoternary": {
    bw: "similar to AMI",
    dc: "practically zero DC",
    sync: "good for random data",
    note: "logic roles of 0 and 1 swapped compared to AMI"
  },
  "HDB3": {
    bw: "similar to AMI",
    dc: "DC-free by design",
    sync: "maintains sync even on long zero runs",
    note: "widely used on E-carrier systems for long-haul transmission"
  },
  "B8ZS": {
    bw: "similar to AMI",
    dc: "DC-free by deliberate violation pattern",
    sync: "good sync even when long zeros occur",
    note: "North-American T1 equivalent of HDB3"
  },
  "Duobinary": {
    bw: "reduced bandwidth (partial response)",
    dc: "small DC component",
    sync: "depends on precoding and channel",
    note: "uses controlled ISI to compress spectrum"
  },
  "Modified Duobinary": {
    bw: "similar to Duobinary but DC-free",
    dc: "no DC (with proper precoding)",
    sync: "good when implemented with a precoder",
    note: "spectrally efficient and DC-free partial-response scheme"
  }
};

/* populate main scheme select and compare selects */
const schemeSelect = document.getElementById("scheme");
const schemeA = document.getElementById("schemeA");
const schemeB = document.getElementById("schemeB");
for (const group in schemes) {
  const optgroup = document.createElement("optgroup"); optgroup.label = group;
  schemes[group].forEach(s=>{
    const o = document.createElement("option"); o.value = s; o.textContent = s;
    optgroup.appendChild(o);
    // also add to compare dropdowns
    const oa = document.createElement("option"); oa.value = s; oa.textContent = s;
    const ob = oa.cloneNode(true);
    schemeA.appendChild(oa); schemeB.appendChild(ob);
  });
  schemeSelect.appendChild(optgroup);
}

/* ---------- Random bit generator ---------- */
const randomBtn = document.getElementById("randomBtn");
if (randomBtn) {
  randomBtn.addEventListener("click", ()=>{
    const L = 8 + Math.floor(Math.random()*9);
    const s = Array.from({length:L},()=>Math.random()>0.5? "1":"0").join("");
    document.getElementById("bitSeq").value = s;
  });
}

/* ---------- Render button ---------- */
document.getElementById("renderBtn").addEventListener("click", ()=>{
  const bitsStr = document.getElementById("bitSeq").value.trim();
  if (!bitsStr) { alert("Enter or generate a bit sequence."); return; }
  const bits = bitsStr.split("").map(ch=>Number(ch));
  if (bits.some(b=>b!==0 && b!==1)) { alert("Bit sequence must contain only 0 and 1."); return; }
  const scheme = document.getElementById("scheme").value;
  currentBits = bits; currentScheme = scheme;
  plotInput(bits);
  const out = generateLineCode(bits, scheme);
  plotOutput(out, bits, scheme);
  renderPSD(bits, scheme); // update PSD section
});

/* ---------- Compare button: waveform + theoretical PSD overlay ---------- */
document.getElementById("compareBtn").addEventListener("click", () => {
  const bits = currentBits.length ? currentBits : [1, 0, 1, 0, 1, 1, 0, 1];
  const a = document.getElementById("schemeA").value;
  const b = document.getElementById("schemeB").value;

  if (a === b) {
    alert("Please choose two different schemes for comparison.");
    return;
  }

  // Generate waveforms for both schemes
  const wa = generateLineCode(bits, a);
  const wb = generateLineCode(bits, b);
  const samplesPerBit = 20;
  const x = [];
  for (let i = 0; i < bits.length; i++) {
    for (let s = 0; s < samplesPerBit; s++) {
      x.push(i + s / samplesPerBit);
    }
  }

  // Waveform overlay: sharp HV pulses, yellow vs blue
  const traceA = {
    x,
    y: wa,
    mode: "lines",
    line: { shape: "hv", color: "#ffeb3b", width: 3 },
    name: a
  };
  const traceB = {
    x,
    y: wb,
    mode: "lines",
    line: { shape: "hv", color: "#40c4ff", width: 3 },
    name: b
  };

  // Mark exact overlap points so you can see where both are present
  const overlapX = [];
  const overlapY = [];
  for (let i = 0; i < wa.length; i++) {
    if (wa[i] === wb[i]) {
      overlapX.push(x[i]);
      overlapY.push(wa[i]);
    }
  }
  const traceOverlap = {
    x: overlapX,
    y: overlapY,
    mode: "markers",
    marker: { color: "#ffffff", size: 4 },
    name: "Overlap",
    showlegend: false
  };

  const layoutWave = {
    title: {
      text: `<b>Waveform Comparison: ${a} vs ${b}</b>`,
      font: { color: "#64ffda", size: 20 }
    },
    xaxis: { title: "Time (bit periods)", color: "#fff" },
    yaxis: { title: "Amplitude", color: "#fff", range: [-2.2, 2.2] },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    showlegend: true,
    legend: {
      bgcolor: "rgba(0,0,0,0.7)",
      bordercolor: "rgba(255,255,255,0.8)",
      borderwidth: 1,
      font: { color: "#ffffff" }
    }
  };
  Plotly.newPlot("compareWaveform", [traceB, traceA, traceOverlap], layoutWave, { responsive: true });

  // Theoretical PSD comparison for both schemes over a wider band (to show sidelobes)
  const N = 2048;
  const freqs = Array.from({ length: N }, (_, i) => i / (N / 3.0));

  const psdA = getTheoreticalPSD(a, freqs);
  const psdB = getTheoreticalPSD(b, freqs);
  const maxPSD = Math.max(...psdA, ...psdB);

  const psdTraceA = {
    x: freqs,
    y: psdA,
    mode: "lines",
    line: { color: "#ffeb3b", width: 2, shape: "spline" },
    name: `${a} PSD`,
    fill: "tozeroy",
    fillcolor: "rgba(255, 235, 59, 0.15)"
  };
  const psdTraceB = {
    x: freqs,
    y: psdB,
    mode: "lines",
    line: { color: "#40c4ff", width: 2, shape: "spline" },
    name: `${b} PSD`,
    fill: "tozeroy",
    fillcolor: "rgba(64, 196, 255, 0.15)"
  };

  const layoutPSD = {
    title: {
      text: `<b>PSD Comparison: ${a} vs ${b}</b>`,
      font: { color: "#64ffda", size: 18 }
    },
    xaxis: {
      title: "Normalized Frequency",
      color: "#fff",
      showgrid: true,
      gridcolor: "rgba(255, 255, 255, 0.1)",
      zeroline: true,
      zerolinecolor: "rgba(255, 255, 255, 0.3)",
      range: [0, 3],
      tickvals: [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0],
      ticktext: ["0", "0.5", "1.0", "1.5", "2.0", "2.5", "3.0"]
    },
    yaxis: {
      title: "Power Spectral Density",
      color: "#fff",
      showgrid: true,
      gridcolor: "rgba(255, 255, 255, 0.1)",
      zeroline: true,
      zerolinecolor: "rgba(255, 255, 255, 0.3)",
      range: [0, maxPSD > 0 ? maxPSD * 1.1 : 1]
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    margin: { t: 50, b: 80, l: 80, r: 40 },
    showlegend: true,
    legend: {
      bgcolor: "rgba(0,0,0,0.7)",
      bordercolor: "rgba(255,255,255,0.8)",
      borderwidth: 1,
      font: { color: "#ffffff" }
    }
  };

  Plotly.newPlot("comparePSD", [psdTraceA, psdTraceB], layoutPSD, { responsive: true });

  const info = document.getElementById("compareInfo");
  if (info) {
    const pa = schemeProps[a] || {};
    const pb = schemeProps[b] || {};
    info.innerHTML = `
      <div style="border:1px solid #64ffda;padding:10px;border-radius:8px;background:rgba(0,255,255,0.05);">
        <div><b>Bits used:</b> ${bits.join("")}</div>
        <div style="margin-top:6px;"><b>Scheme A:</b> <span style="font-weight:700;color:#ffeb3b;">${a}</span></div>
        <ul style="margin-left:18px;margin-top:2px;">
          <li><b>Bandwidth:</b> ${pa.bw || '—'}</li>
          <li><b>DC component:</b> ${pa.dc || '—'}</li>
          <li><b>Synchronization:</b> ${pa.sync || '—'}</li>
          <li><b>Note:</b> ${pa.note || ''}</li>
        </ul>
        <div style="margin-top:8px;"><b>Scheme B:</b> <span style="font-weight:700;color:#40c4ff;">${b}</span></div>
        <ul style="margin-left:18px;margin-top:2px;">
          <li><b>Bandwidth:</b> ${pb.bw || '—'}</li>
          <li><b>DC component:</b> ${pb.dc || '—'}</li>
          <li><b>Synchronization:</b> ${pb.sync || '—'}</li>
          <li><b>Note:</b> ${pb.note || ''}</li>
        </ul>
        <div style="margin-top:8px;">
          <b>Observation:</b>
          ${pa.bw && pb.bw ? `
            <b>${a}</b> ${pa.bw.indexOf('high')!==-1 ? 'demands more bandwidth' : pa.bw.indexOf('low')!==-1 ? 'is more bandwidth-efficient' : ''}
            compared to <b>${b}</b>${pb.dc && pb.dc.toLowerCase().includes('no dc') ? ', and <b>' + b + '</b> is DC-free' : ''}.
          ` : ''}
        </div>
      </div>
    `;
  }
});

/* ---------- Output waveform generator (12 schemes) ---------- */
function generateLineCode(bits, scheme) {
  const samplesPerBit = 20;
  const out = [];
  if (scheme === "Unipolar NRZ") {
    bits.forEach(b=> { for (let i=0;i<samplesPerBit;i++) out.push(b===1?1:0); });
  } else if (scheme === "Unipolar RZ") {
    bits.forEach(b=> {
      if (b===1) { for(let i=0;i<10;i++) out.push(1); for(let i=0;i<10;i++) out.push(0); }
      else { for(let i=0;i<20;i++) out.push(0); }
    });
  } else if (scheme === "Polar NRZ-L") {
    bits.forEach(b=> { for (let i=0;i<samplesPerBit;i++) out.push(b===1?1:-1); });
  } else if (scheme === "Polar NRZ-I") {
    let state = -1;
    bits.forEach(b=>{
      if (b===1) state *= -1;
      for (let i=0;i<samplesPerBit;i++) out.push(state);
    });
  } else if (scheme === "Polar RZ") {
    bits.forEach(b=>{
      if (b===1) { for(let i=0;i<10;i++) out.push(1); for(let i=0;i<10;i++) out.push(0); }
      else { for(let i=0;i<10;i++) out.push(-1); for(let i=0;i<10;i++) out.push(0); }
    });
  } else if (scheme === "Manchester") {
    bits.forEach(b=>{
      if (b===1) { for(let i=0;i<10;i++) out.push(1); for(let i=0;i<10;i++) out.push(-1); }
      else { for(let i=0;i<10;i++) out.push(-1); for(let i=0;i<10;i++) out.push(1); }
    });
  } else if (scheme === "Differential Manchester") {
    // Differential Manchester: transition every mid-bit; data encoded by boundary transition
    let prevStart = 1; // level at start of previous bit
    for (let i = 0; i < bits.length; i++) {
      const b = bits[i];
      let first, second;
      if (i === 0) {
        // Initialize with a Manchester-like first bit
        first = 1;
        second = -1;
      } else if (b === 0) {
        // Transition at start of bit, then mid-bit transition
        first = -prevStart;
        second = prevStart;
      } else { // b === 1
        // No transition at start, only mid-bit transition
        first = prevStart;
        second = -prevStart;
      }
      for (let s = 0; s < samplesPerBit/2; s++) out.push(first);
      for (let s = 0; s < samplesPerBit/2; s++) out.push(second);
      prevStart = first;
    }
  } else if (scheme === "AMI") {
    let pol = 1;
    bits.forEach(b=>{
      if (b===1) { for(let i=0;i<samplesPerBit;i++) out.push(pol); pol *= -1; }
      else { for(let i=0;i<samplesPerBit;i++) out.push(0); }
    });
  } else if (scheme === "Pseudoternary") {
    let pol = -1;
    bits.forEach(b=>{
      if (b===0) { for(let i=0;i<samplesPerBit;i++) out.push(pol); pol *= -1; }
      else { for(let i=0;i<samplesPerBit;i++) out.push(0); }
    });
  } else if (scheme === "HDB3") {

    let last = -1;         // last transmitted non-zero polarity (+1 or -1)
    let zeroRun = 0;       // count consecutive zeros
    let pulseCount = 0;    // non-zero pulses since last violation (V)

    for (let i = 0; i < bits.length; i++) {
      const b = bits[i];

      if (b === 1) {
        // Base AMI: alternate polarity on each mark
        last *= -1;
        for (let s = 0; s < samplesPerBit; s++) out.push(last);
        zeroRun = 0;
        pulseCount++;
        continue;
      }

      // b === 0
      zeroRun++;
      for (let s = 0; s < samplesPerBit; s++) out.push(0);

      // Detect exactly four consecutive zeros and substitute
      if (zeroRun === 4) {
        const start = out.length - 4 * samplesPerBit; // index where the 4-zero run begins (in samples)

        let pattern;
        if (pulseCount % 2 === 1) {
          // ODD -> 000V
          // V must have SAME polarity as last non-zero pulse (violation)
          const V = last;
          pattern = [0, 0, 0, V];
          last = V;
        } else {
          // EVEN -> B00V
          // B must have OPPOSITE polarity (normal AMI)
          // V must violate AMI by repeating the immediately previous non-zero (B)
          const B = -last;
          const V = B;
          pattern = [B, 0, 0, V];
          last = V;
        }

        // Overwrite the last 4 bit-intervals (already emitted as zeros) with the substitution pattern
        for (let k = 0; k < 4; k++) {
          const val = pattern[k];
          const base = start + k * samplesPerBit;
          for (let s = 0; s < samplesPerBit; s++) out[base + s] = val;
        }

        // After inserting V, reset pulse counter
        zeroRun = 0;
        pulseCount = 0;
      }
    }
  }
  else if (scheme === "B8ZS") {
    let pol = -1;           // keeps track of AMI polarity (last non-zero pulse)
    let zeroCount = 0;

    for (let i = 0; i < bits.length; i++) {
      const b = bits[i];

      if (b === 1) {
        pol *= -1;
        for (let s = 0; s < samplesPerBit; s++) out.push(pol);
        zeroCount = 0;
      } else {
        zeroCount++;
        for (let s = 0; s < samplesPerBit; s++) out.push(0);

        if (zeroCount === 8) {
          // --- B8ZS substitution: 000VB0VB ---
          // V pulses: same polarity as last non-zero (violation)
          // B pulses: opposite polarity (normal AMI)
          const V1 = pol;
          const B1 = -pol;
          const V2 = B1;
          const B2 = -V2;
          const pattern = [0, 0, 0, V1, B1, 0, V2, B2];

          const start = out.length - 8 * samplesPerBit;
          for (let k = 0; k < 8; k++) {
            const val = pattern[k];
            const base = start + k * samplesPerBit;
            for (let s = 0; s < samplesPerBit; s++) out[base + s] = val;
          }

          pol = B2;
          zeroCount = 0;
        }
      }
    }
  }
 else if (scheme === "Duobinary") {
    // Correct Duobinary: c[k] = a[k] + a[k-1]
    let prev = -1;   // a[-1] = -1 (reference bit = 0)
    let prec = 0;

    for (let i = 0; i < bits.length; i++) {

        // Convert bit to +1 / -1
        prec = (bits[i] & 1) ^ prec;
        let ak = prec === 1 ? +1 : -1;

        // Duobinary equation: ck = ak + a(k−1)
        let ck = ak + prev;

        // Map to 3-level signaling (-2,0,+2 → -1,0,+1)
        let mapped = ck;

        // Push samples
        for (let s = 0; s < samplesPerBit; s++) out.push(mapped);

        // Update previous symbol
        prev = ak;
    }
} else if (scheme === "Modified Duobinary") {
    let prevAk = 0;
    for (let i = 0; i < bits.length; i++) {
      const ak = (bits[i] === 1 ? +1 : -1);
      const ck = ak - prevAk;
      for (let s = 0; s < samplesPerBit; s++) out.push(ck);
      prevAk = ak;
    }
} else {
  // default: produce zeros
  bits.forEach(()=> { for(let i=0;i<samplesPerBit;i++) out.push(0); });
}
  return out;
}

/* ---------- Plot input waveform ---------- */
function plotInput(bits) {
  const samplesPerBit = 20;
  const x = [];
  const y = [];
  for (let i = 0; i < bits.length; i++) {
    for (let s = 0; s < samplesPerBit; s++) {
      x.push(i + s / samplesPerBit);
      y.push(bits[i]); // Input is simple: 0 or 1
    }
  }
  const trace = {
    x,
    y,
    mode: "lines",
    line: { shape: "hv", color: "#00ffff", width: 3 },
    name: "Input"
  };
  const bitLabels = bits.map((b, i) => ({
    x: i + 0.5,
    y: 1.2,
    text: b.toString(),
    showarrow: false,
    font: { color: "#fff", size: 12 }
  }));
  
  const layout = {
    title: { text: "<b>Input: Binary Sequence</b>", font: { color: "#64ffda", size: 20 } },
    xaxis: { title: "Time (bit periods)", color: "#fff", range: [0, bits.length + 1] },
    yaxis: { title: "Amplitude", range: [-0.5, 1.5], color: "#fff" },
    annotations: bitLabels,
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)"
  };
  Plotly.newPlot("inputPlot", [trace], layout, { responsive: true });
}

/* ---------- Plot output waveform ---------- */
function buildManchesterMidBitArrows(y, samplesPerBit, bitCount) {
  const anns = [];
  for (let i = 0; i < bitCount; i++) {
    const x = i + 0.5;

    const yTop = 1;
    const yBot = -1;
    const start = i * samplesPerBit;
    const mid = start + Math.floor(samplesPerBit / 2);
    const first = (start >= 0 && start < y.length) ? y[start] : 0;
    const second = (mid >= 0 && mid < y.length) ? y[mid] : first;
    const down = first > second;

    const glow = {
      x,
      y: down ? yBot : yTop,
      ax: x,
      ay: down ? yTop : yBot,
      xref: "x",
      yref: "y",
      axref: "x",
      ayref: "y",
      showarrow: true,
      text: "",
      arrowcolor: "#ffffff",
      arrowwidth: 5,
      arrowsize: 0.95,
      arrowhead: 2,
      opacity: 0.22,
      captureevents: false
    };

    const main = {
      x,
      y: down ? yBot : yTop,
      ax: x,
      ay: down ? yTop : yBot,
      xref: "x",
      yref: "y",
      axref: "x",
      ayref: "y",
      showarrow: true,
      text: "",
      arrowcolor: "#ffffff",
      arrowwidth: 2.2,
      arrowsize: 0.9,
      arrowhead: 1,
      opacity: 0.95,
      captureevents: false
    };

    anns.push(glow, main);
  }
  return anns;
}

function renderModifiedDuobinaryBox(bits) {
  const box = document.getElementById("modifiedDuobinaryLogicBox");
  const example = document.getElementById("modifiedDuobinaryExample");
  if (!box || !example) return;

  const ak = bits.map(b => (b === 1 ? +1 : -1));
  const ck = [];
  let prev = 0;
  for (let i = 0; i < ak.length; i++) {
    ck.push(ak[i] - prev);
    prev = ak[i];
  }

  const fmt = v => (v === -1 ? "&minus;1" : v === -2 ? "&minus;2" : v === 1 ? "+1" : v === 2 ? "+2" : "0");
  example.innerHTML =
    `<div><b>Bits:</b> ${bits.map(b => String(b)).join(" ")}</div>` +
    `<div style="margin-top:6px;"><b>a<sub>k</sub>:</b> ${ak.map(v => fmt(v)).join(" ")}</div>` +
    `<div style="margin-top:6px;"><b>c<sub>k</sub>:</b> ${ck.map(v => fmt(v)).join(" ")}</div>`;
}

function renderDuobinaryBox(bits) {
  const box = document.getElementById("duobinaryLogicBox");
  const example = document.getElementById("duobinaryExample");
  if (!box || !example) return;

  const ak = bits.map(b => (b === 1 ? +1 : -1));
  const ck = [];
  let prev = 0;
  for (let i = 0; i < ak.length; i++) {
    ck.push(ak[i] + prev);
    prev = ak[i];
  }

  const fmt = v => (v === -1 ? "&minus;1" : v === -2 ? "&minus;2" : v === 1 ? "+1" : v === 2 ? "+2" : "0");
  example.innerHTML =
    `<div><b>Bits:</b> ${bits.map(b => String(b)).join(" ")}</div>` +
    `<div style="margin-top:6px;"><b>a<sub>k</sub>:</b> ${ak.map(v => fmt(v)).join(" ")}</div>` +
    `<div style="margin-top:6px;"><b>c<sub>k</sub>:</b> ${ck.map(v => fmt(v)).join(" ")}</div>`;
}

function plotOutput(y, bits, scheme) {
  const samplesPerBit = 20;
  const x = []; 
  for (let i=0; i<bits.length; i++) { 
    for (let s=0; s<samplesPerBit; s++) { 
      x.push(i + s/samplesPerBit); 
    } 
  }
  const trace = { 
    x, 
    y, 
    mode: "lines", 
    line: {shape: "hv", color: "#00ffcc", width: 3}, 
    name: scheme 
  };
  const bitLabels = bits.map((b,i) => ({ 
    x: i+0.5, 
    y: 1.6, 
    text: b.toString(), 
    showarrow: false, 
    font: {color: "#fff", size: 12} 
  }));

  const manchesterMidArrows = (scheme === "Manchester" || scheme === "Differential Manchester")
    ? buildManchesterMidBitArrows(y, samplesPerBit, bits.length)
    : [];
  const allAnnotations = bitLabels.concat(manchesterMidArrows);
  
  const layout = {
    title: { 
      text: `<b>Output: ${scheme}</b>`,
      font: { color: "#64ffda", size: 20 }
    },
    xaxis: {
      title: "Time (bit periods)",
      color: "#fff",
      range: [0, bits.length + 1]
    },
    yaxis: {
      title: "Amplitude",
      color: "#fff",
      range: [-2.2, 2.2]
    },
    annotations: allAnnotations,
    paper_bgcolor: "rgba(0,0,0,0)", 
    plot_bgcolor: "rgba(0,0,0,0)"
  };
  Plotly.newPlot("outputPlot", [trace], layout, {responsive: true});

  const duobox = document.getElementById("duobinaryLogicBox");
  if (duobox) duobox.style.display = (scheme === "Duobinary") ? "block" : "none";
  if (scheme === "Duobinary") renderDuobinaryBox(bits);

  const mdbox = document.getElementById("modifiedDuobinaryLogicBox");
  if (mdbox) mdbox.style.display = (scheme === "Modified Duobinary") ? "block" : "none";
  if (scheme === "Modified Duobinary") renderModifiedDuobinaryBox(bits);
}

function getTheoreticalPSD(scheme, freqs) {
  // freqs is normalized f·Tb (bit-rate normalized frequency). We use A=1, Tb=1.
  const sincPi = u => (Math.abs(u) < 1e-8 ? 1 : Math.sin(Math.PI * u) / (Math.PI * u));
  const p = 0.5;   // probability of mark (for Unipolar, AMI, etc.)
  const D = 0.5;   // RZ duty cycle
  const df = freqs.length > 1 ? Math.abs(freqs[1] - freqs[0]) : 1;
  const f0 = freqs.length ? freqs[0] : 0;
  const maxU = freqs.length ? freqs[freqs.length - 1] : 0;

  switch (scheme) {
    case "Unipolar NRZ": { // Var = A^2(p - p^2), Mean = A·p, Tb=1, A=1
      const Var = p - p * p;
      const Mean = p;
      const psd = freqs.map(u => Var * Math.pow(sincPi(u), 2));
      if (psd.length) psd[0] += Mean * Mean;
      return psd;
    }

    case "Polar NRZ-L":
    case "Polar NRZ-I":
      // S(f) = A^2·Tb·sinc^2(π f Tb)  with A=1, Tb=1
      return freqs.map(u => Math.pow(sincPi(u), 2));

    case "Unipolar RZ": {
      const Var = p - p * p;
      const Mean = p;
      const psd = freqs.map(u => Var * Math.pow(D, 2) * Math.pow(sincPi(D * u), 2));
      const kMax = Math.floor(maxU + 1e-12);
      for (let k = 0; k <= kMax; k++) {
        const idx = Math.round((k - f0) / df);
        if (idx >= 0 && idx < psd.length && Math.abs(freqs[idx] - k) <= df / 2 + 1e-12) {
          psd[idx] += Mean * Mean * Math.pow(D, 2) * Math.pow(sincPi(D * k), 2);
        }
      }
      return psd;
    }

    case "Polar RZ":
      // S(f) = A^2·Tb·D^2·sinc^2(π f D Tb)  with A=1, Tb=1
      return freqs.map(u => Math.pow(D, 2) * Math.pow(sincPi(D * u), 2));

    case "Manchester":
    case "Differential Manchester":
      // DC-free, bandpass spectrum with nulls at integer multiples of R
      return freqs.map(u => {
        const uh = u / 2;
        const sincHalf = Math.abs(uh) < 1e-8 ? 1 : Math.sin(Math.PI * uh) / (Math.PI * uh);
        return Math.pow(sincHalf, 2) * Math.pow(Math.sin(Math.PI * uh), 2);
      });

    case "AMI":
    case "Pseudoternary":
      // DC-free alternate-mark spectrum: sinc^2 shaped with (1 - cos(2π f Tb)) factor
      return freqs.map(u => {
        const base = Math.pow(sincPi(u), 2);
        const shaping = 2 * Math.pow(Math.sin(Math.PI * u), 2);
        return p * base * shaping;
      });

    case "Duobinary":
      // S(f) = (A^2/Tb) · sinc^2(π f Tb) · 4 cos^2(π f Tb)
      return freqs.map(u => 4 * Math.pow(sincPi(u), 2) * Math.pow(Math.cos(Math.PI * u), 2));

    case "Modified Duobinary":
      // S(f) = (A^2/Tb) · sinc^2(π f Tb) · 4 sin^2(2 π f Tb)
      return freqs.map(u => 4 * Math.pow(sincPi(u), 2) * Math.pow(Math.sin(2 * Math.PI * u), 2));

    case "HDB3":
    case "B8ZS":
      // Approximate as enhanced AMI-like spectrum with stronger midband energy, still DC-free
      return freqs.map(u => {
        const base = Math.pow(sincPi(u), 2);
        const shaping = 2 * Math.pow(Math.sin(Math.PI * u), 2);
        return p * base * shaping;
      });

    default:
      return freqs.map(() => 0);
  }
}

function renderPSD(bits, scheme) {
    // Generate normalized frequency points from 0 to 1.5 (as in reference implementation)
    const N = 1536;
    const freqs = Array.from({length: N}, (_, i) => i / (N/1.5));
    
    // Get theoretical PSD values over full normalized band
    const psd = getTheoreticalPSD(scheme, freqs);
    const maxPSD = Math.max(...psd);

    // Create the plot
    const trace = { 
        x: freqs, 
        y: psd, 
        mode: 'lines', 
        name: scheme,
        line: {
            color: '#00ffff',
            width: 2,
            shape: 'spline',
            smoothing: 0.6
        },
        fill: 'tozeroy',
        fillcolor: 'rgba(0, 255, 255, 0.1)'
    };

    const layout = {
        title: { 
            text: `<b>Power Spectral Density — ${scheme}</b>`,
            font: { color: '#64ffda', size: 18 }
        },
        xaxis: {
            title: 'Normalized Frequency',
            color: '#fff',
            showgrid: true,
            gridcolor: 'rgba(255, 255, 255, 0.1)',
            zeroline: true,
            zerolinecolor: 'rgba(255, 255, 255, 0.3)',
            range: [0, 1.5],
            tickvals: [0, 0.5, 1.0, 1.5],
            ticktext: ['0', '0.5', '1.0', '1.5']
        },
        yaxis: {
            title: 'Power Spectral Density',
            color: '#fff',
            showgrid: true,
            gridcolor: 'rgba(255, 255, 255, 0.1)',
            zeroline: true,
            zerolinecolor: 'rgba(255, 255, 255, 0.3)',
            range: [0, maxPSD > 0 ? maxPSD * 1.1 : 1]
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 50, b: 80, l: 80, r: 40 },
        showlegend: false
    };

    Plotly.newPlot('psdPlot', [trace], layout, {responsive: true});
    
    const info = document.getElementById('psdInfo');
    if (info) {
        info.textContent = `Theoretical PSD for ${scheme} (normalized frequency)`;
    }
}

document.addEventListener("DOMContentLoaded", ()=>{
  const pretest = [
    {
      q: "Which statement best describes the major drawback of Unipolar NRZ line coding?",
      options: [
        "It has no DC component and provides excellent timing.",
        "It contains a strong DC component and can lose synchronization on long runs.",
        "It is DC-free but requires twice the bandwidth of NRZ.",
        "It uses three amplitude levels and requires precoding."
      ],
      a: 1,
      explain: {
        correct: "Unipolar NRZ produces a non-zero average (DC) and may have long runs with few transitions, so timing recovery is poor.",
        wrong: [
          "Unipolar NRZ is not DC-free and does not guarantee frequent transitions.",
          "This is the correct statement.",
          "Manchester is DC-free and bandwidth-hungry; not unipolar NRZ.",
          "Three-level signaling/precoding is associated with partial-response schemes like duobinary."
        ]
      }
    },
    {
      q: "In Polar NRZ-I, how is a data bit ‘1’ typically represented?",
      options: [
        "By holding the same level as the previous bit.",
        "By forcing the signal to zero for half the bit period.",
        "By a transition (inversion) at the start of the bit interval.",
        "By alternating between +V and −V on every ‘1’ pulse."
      ],
      a: 2,
      explain: {
        correct: "NRZ-I encodes information in transitions: a '1' causes inversion at the bit boundary; a '0' causes no change.",
        wrong: [
          "That describes a '0' in NRZ-I (no transition), not a '1'.",
          "Forcing to zero half-bit is an RZ behavior.",
          "This is the correct statement.",
          "Alternating marks is AMI behavior, not NRZ-I."
        ]
      }
    },
    {
      q: "Which line coding scheme guarantees a mid-bit transition and is self-clocking?",
      options: [
        "Unipolar NRZ",
        "Manchester",
        "Polar NRZ-L",
        "Duobinary"
      ],
      a: 1,
      explain: {
        correct: "Manchester has a transition in the middle of every bit, so clock can be recovered reliably.",
        wrong: [
          "NRZ can have long runs without transitions.",
          "This is the correct statement.",
          "NRZ-L does not force a mid-bit transition.",
          "Duobinary uses controlled ISI but does not guarantee mid-bit transitions."
        ]
      }
    },
    {
      q: "In an AMI system, the binary ‘1’ is represented by:",
      options: [
        "A constant +V level.",
        "A constant −V level.",
        "Alternating +V and −V pulses for successive ‘1’s.",
        "A mid-bit transition regardless of data."
      ],
      a: 2,
      explain: {
        correct: "AMI alternates polarity on successive '1's while '0' remains at 0 V, which removes DC.",
        wrong: [
          "Constant +V corresponds to unipolar NRZ for 1s.",
          "Constant −V is not the AMI rule.",
          "This is the correct statement.",
          "Mandatory mid-bit transition is Manchester-style coding."
        ]
      }
    },
    {
      q: "Why are scrambling schemes like HDB3 and B8ZS used with bipolar coding?",
      options: [
        "To increase the DC component for transformer coupling.",
        "To replace long runs of zeros and preserve synchronization.",
        "To reduce the number of transitions to zero.",
        "To force the spectrum to be strictly bandpass."
      ],
      a: 1,
      explain: {
        correct: "Scrambling inserts deliberate violation patterns during long zero runs to create transitions for clock recovery.",
        wrong: [
          "Practical bipolar systems aim to reduce DC, not increase it.",
          "This is the correct statement.",
          "Scrambling increases transitions during long zero runs; it does not reduce them.",
          "Scrambling primarily targets transition density/DC behavior rather than forcing a strictly bandpass spectrum."
        ]
      }
    },
    {
      q: "HDB3 replaces a run of four consecutive zeros using patterns such as:",
      options: [
        "000VB00V",
        "B00V or 000V",
        "0V0V0V0V",
        "11110000"
      ],
      a: 1,
      explain: {
        correct: "HDB3 substitutes 0000 using either 000V or B00V depending on parity to maintain DC balance and transitions.",
        wrong: [
          "000VB00V is associated with B8ZS substitution patterns.",
          "This is the correct statement.",
          "HDB3 uses specific B and V placement, not alternating V every bit.",
          "This is a raw bit pattern, not an HDB3 substitution rule."
        ]
      }
    },
    {
      q: "B8ZS primarily substitutes which sequence?",
      options: [
        "Four consecutive zeros",
        "Eight consecutive zeros",
        "Eight consecutive ones",
        "Alternating zeros and ones"
      ],
      a: 1,
      explain: {
        correct: "B8ZS is designed to break runs of eight zeros by inserting a bipolar violation pattern.",
        wrong: [
          "Four-zero substitution is the HDB3 case.",
          "This is the correct statement.",
          "B8ZS targets zeros, not ones.",
          "Alternating patterns already contain transitions and do not need substitution."
        ]
      }
    },
    {
      q: "In a PSD plot of a line code, a noticeable spike at f = 0 typically indicates:",
      options: [
        "A strong DC component",
        "Excellent clock recovery",
        "Reduced bandwidth",
        "Controlled ISI"
      ],
      a: 0,
      explain: {
        correct: "A spike at 0 Hz indicates the waveform has a non-zero mean (DC component).",
        wrong: [
          "This is the correct statement.",
          "Clock recovery depends on transition density and spectral shaping, not a DC spike.",
          "Bandwidth is related to spectral spread, not necessarily DC.",
          "Controlled ISI shapes spectrum but does not inherently create a DC spike."
        ]
      }
    },
    {
      q: "Compared to NRZ, RZ signaling generally:",
      options: [
        "Requires higher bandwidth but offers better timing information.",
        "Requires lower bandwidth and has fewer transitions.",
        "Always introduces controlled ISI.",
        "Always contains a larger DC component."
      ],
      a: 0,
      explain: {
        correct: "RZ returns to zero within each bit, increasing transitions (timing cues) at the expense of bandwidth.",
        wrong: [
          "This is the correct statement.",
          "RZ generally increases transitions and bandwidth compared to NRZ.",
          "Controlled ISI is a partial-response concept (e.g., duobinary), not inherent to RZ.",
          "DC depends on code and data balance; RZ does not always increase DC."
        ]
      }
    },
    {
      q: "Inter-Symbol Interference (ISI) is best described as:",
      options: [
        "Noise that flips isolated bits randomly.",
        "Interference caused by pulse spreading from neighboring symbols.",
        "A deliberate violation pulse inserted for scrambling.",
        "A mid-bit transition used for synchronization."
      ],
      a: 1,
      explain: {
        correct: "ISI occurs when channel dispersion spreads pulses so neighboring symbols overlap at the sampling instant.",
        wrong: [
          "Random flips are noise/bit errors, not ISI.",
          "This is the correct statement.",
          "Violation pulses relate to scrambling schemes like HDB3/B8ZS.",
          "Mid-bit transitions are for self-clocking (Manchester), not ISI definition."
        ]
      }
    }
  ];


  const posttest = [
    {
      q: "For a transformer-coupled link where DC cannot pass, which option is the best choice?",
      options: [
        "Unipolar NRZ",
        "Polar NRZ-L",
        "Manchester or Differential Manchester",
        "Unipolar RZ"
      ],
      a: 2,
      explain: {
        correct: "Transformer/AC coupling blocks DC, so DC-free self-clocking codes like the Manchester family are preferred.",
        wrong: [
          "Unipolar NRZ has strong DC and poor AC-coupling behavior.",
          "Polar NRZ may still suffer baseline wander and does not guarantee a DC null for all patterns.",
          "This is the correct statement.",
          "Unipolar RZ can still have DC for unbalanced data."
        ]
      }
    },
    {
      q: "A PSD that has a null at DC and significant energy around mid-band is most characteristic of:",
      options: [
        "Manchester coding",
        "Unipolar NRZ",
        "Duobinary (without precoding)",
        "Unipolar RZ"
      ],
      a: 0,
      explain: {
        correct: "Manchester is DC-free (null at 0 Hz) and shifts energy upward due to mandatory transitions.",
        wrong: [
          "This is the correct statement.",
          "Unipolar NRZ typically has DC / strong low-frequency content.",
          "Duobinary is partial-response but not the classic mid-bit transition spectrum.",
          "Unipolar RZ does not guarantee a DC null."
        ]
      }
    },
    {
      q: "In an AMI system, long sequences of zeros cause loss of synchronization mainly because:",
      options: [
        "There are no transitions during long zero runs.",
        "The signal becomes strictly bandpass.",
        "Violations occur too frequently.",
        "The average power becomes too high."
      ],
      a: 0,
      explain: {
        correct: "During long zero runs AMI stays at 0 V, producing no edges for clock recovery.",
        wrong: [
          "This is the correct statement.",
          "AMI is not inherently strictly bandpass.",
          "Violations are inserted by scrambling (HDB3/B8ZS), not plain AMI.",
          "Long zero runs usually reduce transitions and average power."
        ]
      }
    },
    {
      q: "In HDB3, when the number of non-zero pulses since the last violation is EVEN, the substitution used is:",
      options: [
        "000V",
        "B00V",
        "00BV",
        "0B0V"
      ],
      a: 1,
      explain: {
        correct: "For even pulse count, HDB3 uses B00V to maintain DC balance and ensure transitions.",
        wrong: [
          "000V is the odd-parity case.",
          "This is the correct statement.",
          "Not a standard HDB3 substitution.",
          "Not a standard HDB3 substitution."
        ]
      }
    },
    {
      q: "Duobinary signaling is called a partial-response scheme because it:",
      options: [
        "Eliminates all ISI at the receiver.",
        "Intentionally introduces controlled ISI to reduce bandwidth.",
        "Uses only two amplitude levels.",
        "Always produces a DC-free spectrum without precoding."
      ],
      a: 1,
      explain: {
        correct: "Duobinary compresses spectrum by allowing known/controlled ISI (partial-response behavior).",
        wrong: [
          "Duobinary does not eliminate ISI; it uses controlled ISI.",
          "This is the correct statement.",
          "Duobinary is typically multi-level (often 3 levels).",
          "DC-free behavior depends on precoding/modified duobinary, not guaranteed here."
        ]
      }
    },
    {
      q: "Which relation best represents ideal duobinary encoding (conceptually)?",
      options: [
        "y[k] = x[k]",
        "y[k] = x[k] + x[k-1]",
        "y[k] = x[k] − x[k-1]",
        "y[k] = (−1)^{x[k]}"
      ],
      a: 1,
      explain: {
        correct: "Basic duobinary is modeled as y[k] = x[k] + x[k−1], i.e., the current and previous symbols add.",
        wrong: [
          "That is memoryless transmission (not partial-response).",
          "This is the correct statement.",
          "Subtraction is not the standard basic duobinary relation.",
          "This is a polar mapping, not the duobinary relation."
        ]
      }
    },
    {
      q: "Modified duobinary is preferred over duobinary primarily because it:",
      options: [
        "Requires twice the bandwidth.",
        "Eliminates the DC component (with proper precoding).",
        "Removes the need for any receiver equalization.",
        "Guarantees a mid-bit transition for every bit."
      ],
      a: 1,
      explain: {
        correct: "With proper precoding, modified duobinary can reduce/eliminate DC while retaining spectral efficiency.",
        wrong: [
          "It is used to improve spectral properties, not increase bandwidth.",
          "This is the correct statement.",
          "Partial-response still needs careful decoding; equalization may still be needed.",
          "Mid-bit transitions are Manchester-type behavior, not duobinary."
        ]
      }
    },
    {
      q: "If the channel may invert polarity (swap +V and −V), which line code is most robust without ambiguity?",
      options: [
        "Polar NRZ-L",
        "Unipolar NRZ",
        "Differential Manchester",
        "Unipolar RZ"
      ],
      a: 2,
      explain: {
        correct: "Differential Manchester encodes data by transitions (relative changes), so polarity inversion does not affect decoding.",
        wrong: [
          "NRZ-L depends on absolute polarity, so inversion can flip meaning.",
          "Unipolar codes are not polarity-robust and have DC issues.",
          "This is the correct statement.",
          "Unipolar RZ still depends on absolute level."
        ]
      }
    },
    {
      q: "A strong DC component in a line code typically leads to which practical issue in AC/transformer coupling?",
      options: [
        "Improved clock recovery",
        "Baseline wander / inability to pass through coupling capacitors",
        "Reduced ISI automatically",
        "Guaranteed spectral nulls at integer multiples of the bit rate"
      ],
      a: 1,
      explain: {
        correct: "AC coupling blocks DC, so DC-heavy codes can cause baseline wander and distortion through coupling.",
        wrong: [
          "Clock recovery is driven mainly by transitions, not DC.",
          "This is the correct statement.",
          "ISI depends on the channel response, not automatically reduced by DC.",
          "Spectral nulls are determined by code structure/pulse shape, not guaranteed by DC."
        ]
      }
    },
    {
      q: "When comparing two schemes using PSD overlays, a scheme with the narrower main lobe generally indicates:",
      options: [
        "Lower required bandwidth (more spectrally efficient)",
        "Higher required bandwidth",
        "More DC content necessarily",
        "Guaranteed self-synchronization"
      ],
      a: 0,
      explain: {
        correct: "A narrower main lobe typically means less occupied bandwidth (better spectral efficiency).",
        wrong: [
          "This is the correct statement.",
          "A wider main lobe generally indicates higher bandwidth.",
          "DC depends on waveform mean, not only main-lobe width.",
          "Self-synchronization depends on transition structure (e.g., Manchester), not PSD width alone."
        ]
      }
    }
  ];

  const submitted = { pre: false, post: false };

  function renderTest(questions, rootId, key) {
    const root = document.getElementById(rootId);
    if (!root) return;
    root.innerHTML = "";
    questions.forEach((qq, i)=>{
      const card = document.createElement("div");
      card.className = "plot-box mcq-card";
      card.setAttribute("data-correct", String(qq.a));
      card.setAttribute("data-qindex", String(i));

      const qEl = document.createElement("div");
      qEl.className = "mcq-q";
      qEl.textContent = `Q${i+1}. ${qq.q}`;
      card.appendChild(qEl);

      qq.options.forEach((opt, j)=>{
        const lab = document.createElement("label");
        lab.className = "mcq-option";
        lab.setAttribute("data-opt", String(j));

        const inp = document.createElement("input");
        inp.type = "radio";
        inp.name = `${key}_q${i}`;
        inp.value = String(j);

        let startX = 0;
        let startY = 0;
        let moved = false;
        lab.addEventListener("pointerdown", (e) => {
          moved = false;
          startX = e.clientX;
          startY = e.clientY;
        });
        lab.addEventListener("pointermove", (e) => {
          const dx = Math.abs(e.clientX - startX);
          const dy = Math.abs(e.clientY - startY);
          if (dx + dy > 10) moved = true;
        });
        lab.addEventListener("click", (e) => {
          if (submitted[key]) {
            e.preventDefault();
            return;
          }
          if (moved) {
            e.preventDefault();
            return;
          }
          e.preventDefault();
          inp.checked = true;
        });

        const span = document.createElement("span");
        span.textContent = opt;

        lab.appendChild(inp);
        lab.appendChild(span);
        card.appendChild(lab);
      });

      const exp = document.createElement("div");
      exp.className = "mcq-explain";
      exp.innerHTML = `<div class="mcq-explain-title">Explanation</div><div class="mcq-explain-body"></div>`;
      card.appendChild(exp);

      root.appendChild(card);
    });
  }

  function gradeTest(questions, rootId, submitBtnId, resultId, key) {
    if (submitted[key]) return;
    const root = document.getElementById(rootId);
    const btn = document.getElementById(submitBtnId);
    const result = document.getElementById(resultId);

    if (!root || !btn || !result) return;

    let score = 0;
    const total = questions.length;

    root.querySelectorAll(".mcq-card").forEach(card=>{
      const correct = Number(card.getAttribute("data-correct"));
      const qIndex = Number(card.getAttribute("data-qindex"));
      const chosen = card.querySelector(`input[name=\"${key}_q${qIndex}\"]:checked`);
      const chosenIdx = chosen ? Number(chosen.value) : -1;
      if (chosenIdx === correct) score++;

      card.querySelectorAll(".mcq-option").forEach(lab=>{
        const opt = Number(lab.getAttribute("data-opt"));
        lab.classList.remove("correct","wrong");
        if (opt === correct) lab.classList.add("correct");
        if (chosenIdx !== -1 && opt === chosenIdx && chosenIdx !== correct) lab.classList.add("wrong");
      });

      const qq = questions[qIndex];
      const expBox = card.querySelector(".mcq-explain");
      const expBody = expBox ? expBox.querySelector(".mcq-explain-body") : null;
      if (expBox && expBody) {
        const correctReason = qq && qq.explain && qq.explain.correct ? qq.explain.correct : "";
        const wrongReasons = (qq && qq.explain && Array.isArray(qq.explain.wrong)) ? qq.explain.wrong : [];
        const wrongLines = wrongReasons.map((t, idx) => `<li>${t}</li>`).join("");
        expBody.innerHTML = `
          <div><b>Why the correct option is right:</b> ${correctReason || "—"}</div>
          <div style="margin-top:6px;"><b>Why others are wrong:</b></div>
          <ul style="margin-left:18px;margin-top:4px;">${wrongLines || "<li>—</li>"}</ul>
        `;
        expBox.style.display = "block";
      }
    });

    root.querySelectorAll("input[type=radio]").forEach(r=>r.disabled = true);
    result.style.display = "block";
    result.innerHTML = `
      <div style="font-weight:800;color:#7fe7ff;">Score: ${score}/${total}</div>
      <div style="margin-top:6px;color:#d7e2ee;">Refresh the page to attempt again.</div>
    `;

    btn.disabled = true;
    btn.textContent = "Test Submitted";
    submitted[key] = true;
  }

  renderTest(pretest, "pretestQuestions", "pre");
  renderTest(posttest, "posttestQuestions", "post");

  const preBtn = document.getElementById("pretestSubmit");
  if (preBtn) preBtn.addEventListener("click", ()=> gradeTest(pretest, "pretestQuestions", "pretestSubmit", "pretestResult", "pre"));
  const postBtn = document.getElementById("posttestSubmit");
  if (postBtn) postBtn.addEventListener("click", ()=> gradeTest(posttest, "posttestQuestions", "posttestSubmit", "posttestResult", "post"));
});


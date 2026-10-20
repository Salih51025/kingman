function OfferedFlower() {
  return (
    <g className="offered-flower">
      <path className="flower-stem" d="M150 118 C148 102 152 90 150 78" fill="none" stroke="#2f7a48" strokeWidth="3" />
      <path className="flower-leaf" d="M150 104 C138 102 138 94 148 98" fill="#3d9a5c" />
      <path className="flower-leaf leaf-r" d="M150 108 C162 106 162 98 152 102" fill="#3d9a5c" />
      <g className="flower-bloom">
        <circle cx="150" cy="72" r="8" fill="#f4a7c0" />
        <circle cx="142" cy="76" r="6" fill="#e56b8c" />
        <circle cx="158" cy="76" r="6" fill="#e56b8c" />
        <circle cx="150" cy="66" r="6" fill="#ffd0de" />
        <circle cx="150" cy="74" r="3" fill="#f3d27a" />
      </g>
    </g>
  );
}

function VictoryHeart() {
  return (
    <svg className="victory-heart" viewBox="0 0 48 44" aria-hidden="true">
      <path
        d="M24 40 C10 28 4 20 4 13 C4 7 9 4 14 4 C18 4 22 7 24 11 C26 7 30 4 34 4 C39 4 44 7 44 13 C44 20 38 28 24 40 Z"
        fill="#e45b7c"
        stroke="#7a2438"
        strokeWidth="2.2"
      />
      <path d="M16 12 C18 8 22 10 24 14" fill="none" stroke="#ffd0de" strokeWidth="2" />
    </svg>
  );
}

export default function Knight({
  phase,
  attacking,
  attackVariant,
  inBattle,
  idle,
  jumpPhase,
  ultimatePhase,
  blocking,
  victoryPhase,
  showVictoryHeart,
}) {
  const planted =
    ultimatePhase === "kneel" ||
    ultimatePhase === "flower" ||
    ["plant", "raise", "leap", "land"].includes(victoryPhase);
  const showFlower = ultimatePhase === "kneel" || ultimatePhase === "flower";

  return (
    <div
      className={[
        "knight",
        `phase-${phase.toLowerCase()}`,
        idle ? "is-idle" : "",
        inBattle ? "in-battle" : "",
        blocking ? "is-blocking" : "",
        jumpPhase ? `jump-${jumpPhase}` : "",
        ultimatePhase ? `ultimate-${ultimatePhase}` : "",
        victoryPhase ? `celebrate-${victoryPhase}` : "",
        attacking ? `is-attacking hit-${attackVariant}` : "",
      ].join(" ")}
      aria-hidden="true"
    >
      <svg viewBox="0 0 190 220" className="knight-svg" role="img">
        <title>Cartoon knight</title>
        <ellipse className="boot-shadow" cx="94" cy="208" rx="46" ry="8" fill="#141022" opacity="0.45" />
        <g className="knight-rig">
          <g className="cape">
            <path
              d="M72 90 C28 108 22 156 34 196 C70 166 96 152 124 142 C108 116 100 98 72 90 Z"
              fill="#c45c62"
              stroke="#3a1c28"
              strokeWidth="3"
            />
            <path d="M78 102 C54 124 48 156 52 176" fill="none" stroke="#e08a86" strokeWidth="3" opacity="0.45" />
          </g>
          <g className="leg-l">
            <rect x="66" y="138" width="24" height="46" rx="10" fill="#2b355c" stroke="#1c2240" strokeWidth="2.8" />
            <rect x="70" y="154" width="16" height="12" rx="3" fill="#3f4c7a" />
            <ellipse cx="76" cy="190" rx="18" ry="9" fill="#4a3222" stroke="#1c2240" strokeWidth="2.8" />
          </g>
          <g className="leg-r">
            <rect x="98" y="138" width="24" height="46" rx="10" fill="#323e6c" stroke="#1c2240" strokeWidth="2.8" />
            <rect x="102" y="154" width="16" height="12" rx="3" fill="#46568a" />
            <ellipse cx="118" cy="190" rx="18" ry="9" fill="#4a3222" stroke="#1c2240" strokeWidth="2.8" />
          </g>
          <g className="torso">
            <path d="M56 88 L132 88 L124 146 L64 146 Z" fill="#3d4f96" stroke="#1c2240" strokeWidth="3" />
            <ellipse cx="58" cy="96" rx="14" ry="12" fill="#4a5ca8" stroke="#1c2240" strokeWidth="2.6" />
            <ellipse cx="130" cy="96" rx="14" ry="12" fill="#4a5ca8" stroke="#1c2240" strokeWidth="2.6" />
            <rect x="70" y="94" width="48" height="20" rx="7" fill="#d7def4" />
            <rect x="76" y="118" width="36" height="11" rx="3" fill="#2f3b6c" />
            <rect x="84" y="132" width="22" height="8" rx="2" fill="#d4a24c" />
            <path d="M78 98 L110 98" stroke="#8ea0d8" strokeWidth="3" />
          </g>
          <g className="arm-l">
            <rect x="38" y="90" width="24" height="40" rx="11" fill="#3d4f96" stroke="#1c2240" strokeWidth="2.6" />
            <ellipse cx="50" cy="108" rx="11" ry="10" fill="#4a5ca8" />
            <rect x="36" y="124" width="28" height="22" rx="8" fill="#6d7fb8" stroke="#1c2240" strokeWidth="2.6" />
          </g>
          <g className="arm-sword">
            <rect x="114" y="88" width="26" height="36" rx="12" fill="#3d4f96" stroke="#1c2240" strokeWidth="2.6" />
            <ellipse cx="128" cy="104" rx="12" ry="10" fill="#4a5ca8" />
            <g className="gauntlet">
              <rect x="118" y="116" width="30" height="24" rx="8" fill="#6d7fb8" stroke="#1c2240" strokeWidth="2.6" />
              <rect x="122" y="120" width="22" height="6" rx="2" fill="#d4a24c" />
              <g className="sword">
                <polygon points="156,28 166,128 146,128" fill="#e9eef8" stroke="#1c2240" strokeWidth="2.6" />
                <polygon points="156,28 160,52 152,52" fill="#c5d2ea" />
                <path d="M156 40 L156 118" stroke="#b7c6e0" strokeWidth="2" />
                <rect x="140" y="122" width="32" height="10" rx="2" fill="#d4a24c" stroke="#1c2240" strokeWidth="2.4" />
                <rect x="151" y="132" width="10" height="18" rx="2" fill="#6b3a1f" stroke="#1c2240" strokeWidth="2.4" />
                <circle cx="156" cy="154" r="6" fill="#8b5a2b" stroke="#1c2240" strokeWidth="2.4" />
              </g>
              {showFlower ? <OfferedFlower /> : null}
            </g>
          </g>
          <g className="scarf">
            <path d="M68 88 Q94 108 122 88 Q112 116 94 112 Q76 116 68 88 Z" fill="#e07a4a" stroke="#1c2240" strokeWidth="2.6" />
          </g>
          <g className="head">
            <circle cx="92" cy="54" r="30" fill="#e8d5b5" stroke="#1c2240" strokeWidth="3" />
            <path d="M62 50 Q92 4 122 50 L122 66 Q92 50 62 66 Z" fill="#5b6db0" stroke="#1c2240" strokeWidth="3" />
            <path d="M92 8 L98 28 L86 28 Z" fill="#d4a24c" stroke="#1c2240" strokeWidth="2.4" />
            <path d="M68 44 Q92 26 116 44" fill="none" stroke="#8ea0d8" strokeWidth="5" />
            <path d="M74 48 Q82 42 90 48" fill="none" stroke="#1c2240" strokeWidth="2.5" />
            <path d="M94 48 Q102 42 110 48" fill="none" stroke="#1c2240" strokeWidth="2.5" />
            <g className="eye-l">
              <ellipse cx="82" cy="62" rx="8.5" ry="9" fill="#fffdf8" stroke="#1c2240" strokeWidth="2" />
              <circle className="pupil" cx="83" cy="63" r="3.4" fill="#1c2240" />
              <rect className="lid" x="73" y="53" width="18" height="9" rx="4" fill="#e8d5b5" />
            </g>
            <g className="eye-r">
              <ellipse cx="104" cy="62" rx="8.5" ry="9" fill="#fffdf8" stroke="#1c2240" strokeWidth="2" />
              <circle className="pupil" cx="105" cy="63" r="3.4" fill="#1c2240" />
              <rect className="lid" x="95" y="53" width="18" height="9" rx="4" fill="#e8d5b5" />
            </g>
            <path d="M86 76 Q92 82 98 76" fill="none" stroke="#1c2240" strokeWidth="2.4" />
          </g>
        </g>
        {planted ? (
          <g className="ground-sword">
            <rect x="136" y="126" width="8" height="76" rx="2" fill="#e9eef8" stroke="#1c2240" strokeWidth="2.4" />
            <path d="M140 126 L144 114 L136 114 Z" fill="#c5d2ea" stroke="#1c2240" strokeWidth="2" />
            <rect x="126" y="126" width="28" height="9" rx="2" fill="#d4a24c" stroke="#1c2240" strokeWidth="2.4" />
          </g>
        ) : null}
      </svg>
      {showVictoryHeart ? <VictoryHeart /> : null}
      {attacking ? <span className={`slash-trail trail-${attackVariant}`} /> : null}
      {blocking ? <span className="block-spark" /> : null}
      {ultimatePhase === "awaken" || ultimatePhase === "strike" ? (
        <div className="crimson-aura">
          <span />
          <span />
          <span />
        </div>
      ) : null}
      {ultimatePhase === "strike" ? <span className="crimson-arc" /> : null}
      {phase === "IMPACT" || jumpPhase === "land" ? <div className="ground-ripple" /> : null}
    </div>
  );
}

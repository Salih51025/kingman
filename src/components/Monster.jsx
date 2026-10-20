import { useI18n } from "../i18n/LanguageContext.jsx";

function HealthBar({ hp, maxHp }) {
  const ratio = Math.max(0, hp / maxHp);
  return (
    <div className="hp-bar" aria-hidden="true">
      <span style={{ width: `${ratio * 100}%` }} />
    </div>
  );
}

function Slime() {
  return (
    <svg viewBox="0 0 150 150" className="monster-svg">
      <ellipse cx="75" cy="138" rx="40" ry="6" fill="#141022" opacity="0.42" />
      <g className="monster-body">
        <g className="m-leg-l">
          <rect x="46" y="100" width="20" height="28" rx="9" fill="#148866" stroke="#0d3d36" strokeWidth="2.6" />
          <ellipse cx="54" cy="130" rx="14" ry="8" fill="#0f6d52" stroke="#0d3d36" strokeWidth="2.4" />
        </g>
        <g className="m-leg-r">
          <rect x="84" y="100" width="20" height="28" rx="9" fill="#1aa87c" stroke="#0d3d36" strokeWidth="2.6" />
          <ellipse cx="98" cy="130" rx="14" ry="8" fill="#0f6d52" stroke="#0d3d36" strokeWidth="2.4" />
        </g>
        <path d="M28 82 C26 34 124 30 122 82 C118 112 32 112 28 82 Z" fill="#1fb98a" stroke="#0d3d36" strokeWidth="3.6" />
        <path d="M40 76 C46 44 106 42 112 74 C104 52 48 54 40 76 Z" fill="#6aefc8" opacity="0.45" />
        <g className="m-arm-l">
          <rect x="10" y="72" width="28" height="14" rx="7" fill="#148866" stroke="#0d3d36" strokeWidth="2.4" />
          <circle cx="12" cy="79" r="11" fill="#7ff0d2" stroke="#0d3d36" strokeWidth="2.4" />
        </g>
        <g className="m-arm-r">
          <rect x="112" y="72" width="28" height="14" rx="7" fill="#148866" stroke="#0d3d36" strokeWidth="2.4" />
          <circle cx="138" cy="79" r="11" fill="#7ff0d2" stroke="#0d3d36" strokeWidth="2.4" />
        </g>
        <path d="M44 28 L54 8 L62 32" fill="#7ff0d2" stroke="#0d3d36" strokeWidth="2.3" />
        <path d="M90 26 L104 6 L110 32" fill="#7ff0d2" stroke="#0d3d36" strokeWidth="2.3" />
        <path d="M48 58 Q60 48 70 60" fill="none" stroke="#0d3d36" strokeWidth="3" />
        <path d="M82 58 Q96 46 108 60" fill="none" stroke="#0d3d36" strokeWidth="3" />
        <ellipse cx="60" cy="74" rx="12" ry="13" fill="#f7fffc" stroke="#0d3d36" strokeWidth="2.2" />
        <ellipse cx="92" cy="74" rx="12" ry="13" fill="#f7fffc" stroke="#0d3d36" strokeWidth="2.2" />
        <circle cx="64" cy="78" r="4.4" fill="#16332e" />
        <circle cx="96" cy="78" r="4.4" fill="#16332e" />
        <path d="M62 92 Q75 104 90 92" fill="none" stroke="#0d3d36" strokeWidth="3" />
        <path d="M68 96 L70 104 L76 96" fill="#0d3d36" />
        <path d="M80 96 L84 104 L88 96" fill="#0d3d36" />
        <circle cx="75" cy="50" r="5" fill="#ffe08a" stroke="#0d3d36" strokeWidth="1.6" />
      </g>
    </svg>
  );
}

function Flyer() {
  return (
    <svg viewBox="0 0 160 150" className="monster-svg flyer-svg">
      <ellipse cx="80" cy="140" rx="30" ry="5" fill="#141022" opacity="0.3" />
      <g className="monster-body">
        <ellipse className="m-wing-l wing-l" cx="24" cy="60" rx="28" ry="18" fill="#6a32b8" stroke="#2a1454" strokeWidth="3.2" />
        <ellipse className="m-wing-r wing-r" cx="136" cy="60" rx="28" ry="18" fill="#6a32b8" stroke="#2a1454" strokeWidth="3.2" />
        <path d="M24 60 Q6 34 22 14" fill="none" stroke="#f0d4ff" strokeWidth="2.3" />
        <path d="M136 60 Q154 34 138 14" fill="none" stroke="#f0d4ff" strokeWidth="2.3" />
        <g className="m-leg-l">
          <rect x="60" y="98" width="12" height="26" rx="6" fill="#5b2db0" stroke="#2a1454" strokeWidth="2.3" />
          <path d="M54 122 L62 132 L70 122" fill="#4a2098" stroke="#2a1454" strokeWidth="2" />
        </g>
        <g className="m-leg-r">
          <rect x="88" y="98" width="12" height="26" rx="6" fill="#5b2db0" stroke="#2a1454" strokeWidth="2.3" />
          <path d="M82 122 L90 132 L98 122" fill="#4a2098" stroke="#2a1454" strokeWidth="2" />
        </g>
        <ellipse cx="80" cy="76" rx="30" ry="28" fill="#8b4de0" stroke="#2a1454" strokeWidth="3.3" />
        <ellipse cx="72" cy="66" rx="14" ry="10" fill="#e2b6ff" opacity="0.4" />
        <g className="m-arm-l">
          <rect x="36" y="72" width="22" height="11" rx="5" fill="#5b2db0" stroke="#2a1454" strokeWidth="2.2" />
          <path d="M28 70 L20 80 L34 84 Z" fill="#c084fc" stroke="#2a1454" strokeWidth="2" />
        </g>
        <g className="m-arm-r">
          <rect x="102" y="72" width="22" height="11" rx="5" fill="#5b2db0" stroke="#2a1454" strokeWidth="2.2" />
          <path d="M132 70 L140 80 L126 84 Z" fill="#c084fc" stroke="#2a1454" strokeWidth="2" />
        </g>
        <circle cx="80" cy="42" r="20" fill="#9b6fe8" stroke="#2a1454" strokeWidth="3" />
        <polygon points="62,30 66,10 76,30" fill="#c084fc" stroke="#2a1454" strokeWidth="2" />
        <polygon points="98,30 94,10 84,30" fill="#c084fc" stroke="#2a1454" strokeWidth="2" />
        <path d="M66 34 Q74 24 80 36" fill="none" stroke="#2a1454" strokeWidth="2.4" />
        <path d="M84 34 Q92 22 100 36" fill="none" stroke="#2a1454" strokeWidth="2.4" />
        <ellipse cx="72" cy="46" rx="7" ry="8" fill="#fff6ff" stroke="#2a1454" strokeWidth="1.8" />
        <ellipse cx="90" cy="46" rx="7" ry="8" fill="#fff6ff" stroke="#2a1454" strokeWidth="1.8" />
        <circle cx="74" cy="49" r="3" fill="#1a0c32" />
        <circle cx="92" cy="49" r="3" fill="#1a0c32" />
        <path d="M72 56 Q80 64 88 56" fill="none" stroke="#2a1454" strokeWidth="2.4" />
        <circle cx="80" cy="24" r="5.5" fill="#f4d35e" stroke="#2a1454" strokeWidth="2" />
      </g>
    </svg>
  );
}

function Goblin() {
  return (
    <svg viewBox="0 0 150 150" className="monster-svg">
      <ellipse cx="75" cy="138" rx="38" ry="6" fill="#141022" opacity="0.42" />
      <g className="monster-body">
        <g className="m-leg-l">
          <rect x="46" y="96" width="20" height="30" rx="8" fill="#8a3214" stroke="#4a220c" strokeWidth="2.6" />
          <ellipse cx="54" cy="128" rx="14" ry="8" fill="#5c220e" stroke="#4a220c" strokeWidth="2.3" />
        </g>
        <g className="m-leg-r">
          <rect x="84" y="96" width="20" height="30" rx="8" fill="#8a3214" stroke="#4a220c" strokeWidth="2.6" />
          <ellipse cx="98" cy="128" rx="14" ry="8" fill="#5c220e" stroke="#4a220c" strokeWidth="2.3" />
        </g>
        <path d="M40 62 L112 56 L106 102 L44 104 Z" fill="#b8431c" stroke="#4a220c" strokeWidth="3.3" />
        <path d="M50 70 H102 V82 H50 Z" fill="#7a2c10" />
        <ellipse cx="44" cy="68" rx="12" ry="10" fill="#9a3b18" stroke="#4a220c" strokeWidth="2.4" />
        <ellipse cx="106" cy="66" rx="12" ry="10" fill="#9a3b18" stroke="#4a220c" strokeWidth="2.4" />
        <g className="m-arm-l">
          <rect x="16" y="68" width="28" height="13" rx="6" fill="#9a3b18" stroke="#4a220c" strokeWidth="2.3" />
          <circle cx="16" cy="74" r="10" fill="#c45a22" stroke="#4a220c" strokeWidth="2.3" />
        </g>
        <g className="m-arm-r">
          <rect x="106" y="64" width="28" height="13" rx="6" fill="#9a3b18" stroke="#4a220c" strokeWidth="2.3" />
          <circle cx="134" cy="70" r="10" fill="#c45a22" stroke="#4a220c" strokeWidth="2.3" />
          <g className="m-weapon">
            <path d="M136 52 L150 32 L146 76 L132 78 Z" fill="#c45a22" stroke="#4a220c" strokeWidth="2.2" />
            <path d="M148 32 L156 18" stroke="#e8c35a" strokeWidth="4.5" strokeLinecap="round" />
          </g>
        </g>
        <circle cx="75" cy="42" r="24" fill="#d97832" stroke="#4a220c" strokeWidth="3.3" />
        <polygon points="28,34 54,24 50,54" fill="#8f2414" stroke="#4a220c" strokeWidth="2.4" />
        <polygon points="122,34 96,24 100,54" fill="#8f2414" stroke="#4a220c" strokeWidth="2.4" />
        <path d="M58 30 Q68 18 76 32" fill="none" stroke="#4a220c" strokeWidth="2.8" />
        <path d="M78 30 Q90 16 100 32" fill="none" stroke="#4a220c" strokeWidth="2.8" />
        <ellipse cx="66" cy="44" rx="7" ry="8" fill="#2a1208" />
        <ellipse cx="88" cy="44" rx="7" ry="8" fill="#2a1208" />
        <circle cx="68" cy="42" r="2" fill="#f4efe4" />
        <circle cx="90" cy="42" r="2" fill="#f4efe4" />
        <path d="M60 56 Q75 74 92 56" fill="#4a220c" />
        <path d="M66 60 L64 68 M75 62 L75 70 M86 60 L88 68" stroke="#f4efe4" strokeWidth="2" />
        <circle cx="118" cy="94" r="8" fill="#e8c35a" stroke="#4a220c" strokeWidth="2.2" />
      </g>
    </svg>
  );
}

const ART = {
  slime: Slime,
  flyer: Flyer,
  goblin: Goblin,
};

export default function Monster({ monster, focused, hit, striking, variant }) {
  const { t } = useI18n();
  const Art = ART[monster.type] || Slime;
  const defeated = monster.hp <= 0;
  const name = t(`monsters.${monster.type}`);
  const tough = monster.maxHp >= 5;
  const isStriking = striking && !defeated;

  return (
    <div
      className={[
        "monster",
        focused ? "is-focused" : "",
        hit ? "is-hit" : "",
        isStriking ? "is-striking" : "",
        defeated ? "is-defeated" : "",
        tough ? "is-tough" : "",
        `kind-${monster.type}`,
      ].join(" ")}
      data-type={monster.type}
    >
      <p className="monster-name">{name}</p>
      <div className="monster-art">
        <Art />
        {hit ? <span className={`slash slash-${variant ?? 0}`} /> : null}
        {isStriking ? <span className="enemy-spark" /> : null}
      </div>
      <HealthBar hp={monster.hp} maxHp={monster.maxHp} />
      <span className="sr-only">{t("hud.health", { hp: monster.hp, max: monster.maxHp })}</span>
    </div>
  );
}

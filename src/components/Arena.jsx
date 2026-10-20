export default function Arena() {
  return (
    <div className="arena" aria-hidden="true">
      <svg className="arena-scene" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="skyWash" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0e0f1d" />
            <stop offset="28%" stopColor="#16142e" />
            <stop offset="58%" stopColor="#24183f" />
            <stop offset="82%" stopColor="#2a1d44" />
            <stop offset="100%" stopColor="#1c1630" />
          </linearGradient>
          <radialGradient id="moonCore" cx="50%" cy="46%" r="50%">
            <stop offset="0%" stopColor="#fff6df" />
            <stop offset="55%" stopColor="#e8d9b4" />
            <stop offset="100%" stopColor="#c9b48a" />
          </radialGradient>
          <radialGradient id="moonHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f3ead2" stopOpacity="0.35" />
            <stop offset="42%" stopColor="#d9c9a0" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#d9c9a0" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="farRange" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a2450" />
            <stop offset="100%" stopColor="#1a1634" />
          </linearGradient>
          <linearGradient id="midRange" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#32285a" />
            <stop offset="100%" stopColor="#211a3c" />
          </linearGradient>
          <linearGradient id="nearRange" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a2d62" />
            <stop offset="100%" stopColor="#261c40" />
          </linearGradient>
          <linearGradient id="stoneFace" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a334f" />
            <stop offset="55%" stopColor="#2c2640" />
            <stop offset="100%" stopColor="#221c34" />
          </linearGradient>
          <radialGradient id="arenaShade" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#3a334f" />
            <stop offset="70%" stopColor="#2a243c" />
            <stop offset="100%" stopColor="#161022" />
          </radialGradient>
          <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a2d68" stopOpacity="0" />
            <stop offset="100%" stopColor="#2a1d44" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <rect width="1200" height="800" fill="url(#skyWash)" />
        <circle cx="980" cy="96" r="130" fill="url(#moonHalo)" />
        <circle cx="980" cy="96" r="86" fill="url(#moonHalo)" opacity="0.55" />
        <circle className="moon" cx="980" cy="96" r="32" fill="url(#moonCore)" />
        <circle cx="968" cy="88" r="7" fill="#d8c9a4" opacity="0.28" />
        <circle cx="992" cy="104" r="4.5" fill="#d8c9a4" opacity="0.2" />
        <circle cx="976" cy="108" r="3" fill="#d8c9a4" opacity="0.16" />
        <path d="M0 368 C140 336 260 352 380 328 C520 300 640 334 780 314 C920 294 1060 322 1200 306 L1200 560 L0 560 Z" fill="url(#farRange)" />
        <path d="M0 428 C160 396 300 418 430 400 C580 378 720 412 860 392 C1000 372 1120 398 1200 386 L1200 600 L0 600 Z" fill="url(#midRange)" />
        <g className="castle">
          <path d="M792 392 L806 356 L822 356 L822 398 Z" fill="#1a1430" />
          <path d="M822 402 L836 344 L858 344 L858 406 Z" fill="#16102a" />
          <path d="M858 396 L870 364 L884 364 L884 404 Z" fill="#1c1632" />
          <path d="M806 356 L814 342 L822 356 Z" fill="#120e24" />
          <path d="M836 344 L847 326 L858 344 Z" fill="#100c20" />
          <rect x="842" y="362" width="6" height="9" fill="#4a3f72" opacity="0.7" />
          <rect x="850" y="378" width="5" height="8" fill="#3a2d68" opacity="0.65" />
        </g>
        <rect x="0" y="360" width="1200" height="160" fill="url(#mist)" />
        <path d="M0 508 C200 476 380 498 560 482 C760 464 960 504 1200 478 L1200 660 L0 660 Z" fill="url(#nearRange)" />
        <rect x="0" y="500" width="1200" height="150" fill="url(#mist)" opacity="0.7" />
        <ellipse cx="600" cy="708" rx="470" ry="54" fill="#0a0812" opacity="0.55" />
        <ellipse cx="600" cy="668" rx="438" ry="86" fill="#141022" />
        <ellipse cx="600" cy="656" rx="412" ry="74" fill="url(#arenaShade)" stroke="#6d6088" strokeWidth="6" />
        <ellipse cx="600" cy="652" rx="388" ry="62" fill="url(#stoneFace)" />
        <path d="M250 640 Q600 598 950 640 Q600 686 250 640 Z" fill="#322c46" opacity="0.35" />
        <path d="M300 628 Q600 604 900 628" fill="none" stroke="#463e5c" strokeWidth="2" />
        <path d="M240 652 Q600 652 960 652" fill="none" stroke="#4a425e" strokeWidth="2.2" />
        <path d="M300 676 Q600 698 900 676" fill="none" stroke="#463e5c" strokeWidth="2" />
        <path d="M360 616 Q600 598 840 616" fill="none" stroke="#3a3348" strokeWidth="1.4" opacity="0.7" />
        <path d="M360 688 Q600 708 840 688" fill="none" stroke="#3a3348" strokeWidth="1.4" opacity="0.7" />
        <path d="M600 592 L600 716" stroke="#3a3348" strokeWidth="1.8" opacity="0.4" />
        <path d="M470 604 L450 700" stroke="#3a3348" strokeWidth="1.3" opacity="0.32" />
        <path d="M730 604 L750 700" stroke="#3a3348" strokeWidth="1.3" opacity="0.32" />
        <path d="M380 618 L350 692" stroke="#3a3348" strokeWidth="1.1" opacity="0.24" />
        <path d="M820 618 L850 692" stroke="#3a3348" strokeWidth="1.1" opacity="0.24" />
        <path d="M600 608 L610 620 L590 620 Z" fill="none" stroke="#d4a24c" strokeWidth="1.8" opacity="0.5" />
        <circle cx="600" cy="652" r="14" fill="none" stroke="#d4a24c" strokeWidth="1.4" opacity="0.28" />
        <g className="torch-post">
          <rect x="196" y="590" width="8" height="72" rx="2" fill="#3a2a22" />
          <rect x="190" y="656" width="20" height="7" rx="2" fill="#2a1c16" />
          <circle className="torch-flame" cx="200" cy="582" r="8" fill="#f3c56b" />
        </g>
        <g className="torch-post">
          <rect x="996" y="590" width="8" height="72" rx="2" fill="#3a2a22" />
          <rect x="990" y="656" width="20" height="7" rx="2" fill="#2a1c16" />
          <circle className="torch-flame" cx="1000" cy="582" r="8" fill="#f3c56b" />
        </g>
      </svg>
    </div>
  );
}

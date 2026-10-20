import { useEffect, useState } from "react";
import Scene from "./components/Scene.jsx";
import DeveloperWishes from "./pages/DeveloperWishes.jsx";
import { useIntroSequence } from "./hooks/useIntroSequence.js";
import { useBattle } from "./hooks/useBattle.js";

function isDeveloperRoute() {
  const path = `${window.location.pathname}${window.location.hash}${window.location.search}`;
  return path.includes("developer/wishes");
}

function Game() {
  const phase = useIntroSequence();
  const battle = useBattle();
  const formVisible = phase === "REQUEST_READY";

  return (
    <Scene
      phase={formVisible && battle.status !== "idle" ? "REQUEST_READY" : phase}
      battle={battle}
      formVisible={formVisible}
    />
  );
}

export default function App() {
  const [developer, setDeveloper] = useState(isDeveloperRoute);

  useEffect(() => {
    function syncRoute() {
      setDeveloper(isDeveloperRoute());
    }
    window.addEventListener("hashchange", syncRoute);
    window.addEventListener("popstate", syncRoute);
    return () => {
      window.removeEventListener("hashchange", syncRoute);
      window.removeEventListener("popstate", syncRoute);
    };
  }, []);

  return developer ? <DeveloperWishes /> : <Game />;
}

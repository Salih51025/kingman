export function wishPanelCollapsed(battleStatus, userExpanded) {
  if (battleStatus === "idle") {
    return false;
  }
  return !userExpanded;
}

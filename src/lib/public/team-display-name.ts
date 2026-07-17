export function getPublicTeamDisplayName(name: string, isFirstTeam: boolean) {
  if (isFirstTeam) {
    return "Rising Raimon A";
  }

  const shortSeniorName = name.replace(/^Senior\s+/i, "");
  const clubSeniorName = shortSeniorName.replace(
    /^Rising\s+Raimon\s+Senior\s+/i,
    "",
  );

  if (clubSeniorName !== name || shortSeniorName !== name) {
    return `Rising Raimon ${clubSeniorName}`;
  }

  return name;
}

export function getTeamsDirectoryTeamName(name: string, isFirstTeam: boolean) {
  return isFirstTeam ? "Primer Equipo" : getPublicTeamDisplayName(name, isFirstTeam);
}

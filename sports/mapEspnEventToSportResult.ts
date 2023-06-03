import { Competitor, Event } from "./fetchEspnScoreboard.ts";

export interface SportResult {
  hasResult: boolean;
  home: SportResultPerTeam;
  away: SportResultPerTeam;
}

export interface SportResultPerTeam {
  metadata: {
    name: string;
    symbol: string;
    color: string;
    logo: string;
  };
  score: number;
  stats: {
    fieldGoalsMade: string | undefined;
    fieldGoalsPct: string | undefined;
    threePointMade: string | undefined;
    threePointPct: string | undefined;
    freeThrowsMade: string | undefined;
    freeThrowPct: string | undefined;
  };
}

export function mapEspnToSportResult(event: Event): SportResult {
  const home = event.competitions[0].competitors.find(
    (it) => it.homeAway === "home"
  )!;
  const away = event.competitions[0].competitors.find(
    (it) => it.homeAway === "away"
  )!;

  const [homeData, awayData] = [home, away].map((it) => ({
    metadata: {
      name: it.team.displayName,
      symbol: it.team.abbreviation,
      color: `#${it.team.color}`,
      logo: it.team.logo,
    },
    score: Number(it.score),
    stats: {
      fieldGoalsMade: getStats(it, "FGM"),
      fieldGoalsPct: getStats(it, "FG%"),
      threePointMade: getStats(it, "3PM"),
      threePointPct: getStats(it, "3P%"),
      freeThrowsMade: getStats(it, "FTM"),
      freeThrowPct: getStats(it, "FT%"),
    },
  }));

  return {
    hasResult: event.status.type.completed,
    home: homeData,
    away: awayData,
  };
}

const getStats = (competitor: Competitor, abb: string) => {
  const stat = competitor.statistics.find((it) => it.abbreviation === abb);
  if (!stat) {
    return;
  }
  return `${stat.displayValue}${abb.endsWith("%") ? "%" : ""}`;
};

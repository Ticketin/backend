import * as base64 from "https://deno.land/std/encoding/base64.ts";
import { AbiCoder } from "https://jspm.dev/npm:@ethersproject/abi@5.5.0";
import { Competitor, Event } from "./fetchEspnScoreboard.ts";

export interface SportResult {
  hasResult: boolean;
  oracleResultAbiData: string | null;
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

  const hasResult = event.status.type.completed;
  return {
    hasResult,
    oracleResultAbiData: hasResult
      ? encodeSolidityStruct(homeData, awayData)
      : null,
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

/*
  struct OracleResult {
    string homeScore;
    string homeFGM;
    string homeFGP;
    string homeTPM;
    string homeTPP;
    string homeFTM;
    string homeFTP;
    string awayScore;
    string awayFGM;
    string awayFGP;
    string awayTPM;
    string awayTPP;
    string awayFTM;
    string awayFTP;
  }
 */
const OracleResultStructABI = Array(14).fill("string");

export function encodeSolidityStruct(
  home: SportResultPerTeam,
  away: SportResultPerTeam
): string {
  if (!home.stats.fieldGoalsMade) throw new Error("no home result yet");
  if (!home.stats.fieldGoalsMade) throw new Error("no away result yet");

  const abi = AbiCoder.prototype.encode(
    OracleResultStructABI,
    [home, away].flatMap(({ score, stats }) => [
      score.toString(),
      stats.fieldGoalsMade ?? "",
      stats.fieldGoalsPct ?? "",
      stats.threePointMade ?? "",
      stats.threePointPct ?? "",
      stats.freeThrowsMade ?? "",
      stats.freeThrowPct ?? "",
    ])
  );
  return base64.encode(hexToUint8Array(abi));
}

function hexToUint8Array(hexString: string): Uint8Array {
  if (hexString.length % 2 !== 0) {
    throw new Error("Invalid hexString");
  }
  const bytes = new Uint8Array(hexString.length / 2);

  for (let i = 0; i < hexString.length; i += 2) {
    bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
  }

  return bytes;
}

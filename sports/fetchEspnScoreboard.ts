/**
 * Fetches the ESPN Scoreboard API for matches held on the given date.
 *
 * @param matchDate the match date. Format: YYYYMMDD
 * @param sport the sport name. Default: basketball
 * @param league the league name. Default: nba
 * @returns the event data
 */
export async function fetchEspnScoreboard(
  matchDate: string,
  sport = "basketball",
  league = "nba"
): Promise<Event | undefined> {
  const response = await fetch(
    `https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/scoreboard?dates=${matchDate}`
  );
  const { events }: EspnMatchResult = await response.json();
  if (!events?.length) {
    return;
  }
  return events[0];
}

export interface EspnMatchResult {
  league: unknown;
  events: Event[];
}

export interface Event {
  id: string;
  uid: string;
  date: string;
  name: string;
  shortName: string;
  season: Season2;
  competitions: Competition[];
  links: Link3[];
  status: Status2;
}

export interface Season2 {
  year: number;
  type: number;
  slug: string;
}

export interface Competition {
  id: string;
  uid: string;
  date: string;
  attendance: number;
  type: Type2;
  timeValid: boolean;
  neutralSite: boolean;
  conferenceCompetition: boolean;
  playByPlayAvailable: boolean;
  recent: boolean;
  venue: Venue;
  competitors: Competitor[];
  notes: Note[];
  status: Status;
  broadcasts: Broadcast[];
  format: Format;
  startDate: string;
  series: Series;
  geoBroadcasts: GeoBroadcast[];
  headlines: Headline[];
}

export interface Type2 {
  id: string;
  abbreviation: string;
}

export interface Venue {
  id: string;
  fullName: string;
  address: Address;
  capacity: number;
  indoor: boolean;
}

export interface Address {
  city: string;
  state: string;
}

export interface Competitor {
  id: string;
  uid: string;
  type: string;
  order: number;
  homeAway: string;
  winner: boolean;
  team: Team;
  score: string;
  linescores: Linescore[];
  statistics: Statistic[];
  leaders: Leader[];
  records: Record[];
}

export interface Team {
  id: string;
  uid: string;
  location: string;
  name: string;
  abbreviation: string;
  displayName: string;
  shortDisplayName: string;
  color: string;
  alternateColor: string;
  isActive: boolean;
  venue: Venue2;
  links: Link[];
  logo: string;
}

export interface Venue2 {
  id: string;
}

export interface Link {
  rel: string[];
  href: string;
  text: string;
  isExternal: boolean;
  isPremium: boolean;
}

export interface Linescore {
  value: number;
}

export interface Statistic {
  name: string;
  abbreviation: string;
  displayValue: string;
}

export interface Leader {
  name: string;
  displayName: string;
  shortDisplayName: string;
  abbreviation: string;
  leaders: Leader2[];
}

export interface Leader2 {
  displayValue: string;
  value: number;
  athlete: Athlete;
  team: Team3;
}

export interface Athlete {
  id: string;
  fullName: string;
  displayName: string;
  shortName: string;
  links: Link2[];
  headshot: string;
  jersey: string;
  position: Position;
  team: Team2;
  active: boolean;
}

export interface Link2 {
  rel: string[];
  href: string;
}

export interface Position {
  abbreviation: string;
}

export interface Team2 {
  id: string;
}

export interface Team3 {
  id: string;
}

export interface Record {
  name: string;
  abbreviation?: string;
  type: string;
  summary: string;
}

export interface Note {
  type: string;
  headline: string;
}

export interface Status {
  clock: number;
  displayClock: string;
  period: number;
  type: Type3;
}

export interface Type3 {
  id: string;
  name: string;
  state: string;
  completed: boolean;
  description: string;
  detail: string;
  shortDetail: string;
}

export interface Broadcast {
  market: string;
  names: string[];
}

export interface Format {
  regulation: Regulation;
}

export interface Regulation {
  periods: number;
}

export interface Series {
  type: string;
  title: string;
  summary: string;
  completed: boolean;
  totalCompetitions: number;
  competitors: Competitor2[];
}

export interface Competitor2 {
  id: string;
  uid: string;
  wins: number;
  ties: number;
  href: string;
}

export interface GeoBroadcast {
  type: Type4;
  market: Market;
  media: Media;
  lang: string;
  region: string;
}

export interface Type4 {
  id: string;
  shortName: string;
}

export interface Market {
  id: string;
  type: string;
}

export interface Media {
  shortName: string;
}

export interface Headline {
  description: string;
  type: string;
  shortLinkText: string;
  video: Video[];
}

export interface Video {
  id: number;
  source: string;
  headline: string;
  thumbnail: string;
  duration: number;
  tracking: Tracking;
  deviceRestrictions: DeviceRestrictions;
  geoRestrictions: GeoRestrictions;
  links: Links;
}

export interface Tracking {
  sportName: string;
  leagueName: string;
  coverageType: string;
  trackingName: string;
  trackingId: string;
}

export interface DeviceRestrictions {
  type: string;
  devices: string[];
}

export interface GeoRestrictions {
  type: string;
  countries: string[];
}

export interface Links {
  api: Api;
  web: Web;
  source: Source;
  mobile: Mobile;
}

export interface Api {
  self: Self;
  artwork: Artwork;
}

export interface Self {
  href: string;
}

export interface Artwork {
  href: string;
}

export interface Web {
  href: string;
  short: Short;
  self: Self2;
}

export interface Short {
  href: string;
}

export interface Self2 {
  href: string;
}

export interface Source {
  mezzanine: Mezzanine;
  flash: Flash;
  hds: Hds;
  HLS: Hls;
  HD: Hd2;
  full: Full;
  href: string;
}

export interface Mezzanine {
  href: string;
}

export interface Flash {
  href: string;
}

export interface Hds {
  href: string;
}

export interface Hls {
  href: string;
  HD: Hd;
}

export interface Hd {
  href: string;
}

export interface Hd2 {
  href: string;
}

export interface Full {
  href: string;
}

export interface Mobile {
  alert: Alert;
  source: Source2;
  href: string;
  streaming: Streaming;
  progressiveDownload: ProgressiveDownload;
}

export interface Alert {
  href: string;
}

export interface Source2 {
  href: string;
}

export interface Streaming {
  href: string;
}

export interface ProgressiveDownload {
  href: string;
}

export interface Link3 {
  language: string;
  rel: string[];
  href: string;
  text: string;
  shortText: string;
  isExternal: boolean;
  isPremium: boolean;
}

export interface Status2 {
  clock: number;
  displayClock: string;
  period: number;
  type: Type5;
}

export interface Type5 {
  id: string;
  name: string;
  state: string;
  completed: boolean;
  description: string;
  detail: string;
  shortDetail: string;
}

export interface CountryMarketSummary {
  iso3: string;
  countryName: string;
  flag: string;
  probability: number;
  volumeUsd: number;
  status: 'live' | 'upcoming' | 'resolved' | 'no-data';
  electionDate: string;
  electionType: string;
  leadCandidate: string;
  candidates: CandidateOdds[];
}

export interface CandidateOdds {
  name: string;
  probability: number;
  volumeUsd: number;
}

export interface MapTooltipData {
  x: number;
  y: number;
  country: CountryMarketSummary;
}

export interface GlobalMapProps {
  countries: CountryMarketSummary[];
}

// Numeric ISO 3166-1 → ISO Alpha-3 mapping for TopoJSON
export const NUMERIC_TO_ISO3: Record<string, string> = {
  '004': 'AFG', '008': 'ALB', '012': 'DZA', '024': 'AGO', '032': 'ARG',
  '036': 'AUS', '040': 'AUT', '050': 'BGD', '056': 'BEL', '068': 'BOL',
  '070': 'BIH', '072': 'BWA', '076': 'BRA', '100': 'BGR', '104': 'MMR',
  '116': 'KHM', '120': 'CMR', '124': 'CAN', '140': 'CAF', '144': 'LKA',
  '148': 'TCD', '152': 'CHL', '156': 'CHN', '170': 'COL', '178': 'COG',
  '180': 'COD', '188': 'CRI', '191': 'HRV', '192': 'CUB', '196': 'CYP',
  '203': 'CZE', '208': 'DNK', '214': 'DOM', '218': 'ECU', '818': 'EGY',
  '222': 'SLV', '231': 'ETH', '233': 'EST', '246': 'FIN', '250': 'FRA',
  '266': 'GAB', '268': 'GEO', '276': 'DEU', '288': 'GHA', '300': 'GRC',
  '320': 'GTM', '324': 'GIN', '328': 'GUY', '332': 'HTI', '340': 'HND',
  '348': 'HUN', '352': 'ISL', '356': 'IND', '360': 'IDN', '364': 'IRN',
  '368': 'IRQ', '372': 'IRL', '376': 'ISR', '380': 'ITA', '384': 'CIV',
  '388': 'JAM', '392': 'JPN', '398': 'KAZ', '400': 'JOR', '404': 'KEN',
  '408': 'PRK', '410': 'KOR', '414': 'KWT', '417': 'KGZ', '418': 'LAO',
  '422': 'LBN', '426': 'LSO', '428': 'LVA', '430': 'LBR', '434': 'LBY',
  '440': 'LTU', '442': 'LUX', '450': 'MDG', '454': 'MWI', '458': 'MYS',
  '466': 'MLI', '478': 'MRT', '484': 'MEX', '496': 'MNG', '498': 'MDA',
  '504': 'MAR', '508': 'MOZ', '512': 'OMN', '516': 'NAM', '524': 'NPL',
  '528': 'NLD', '540': 'NCL', '554': 'NZL', '558': 'NIC', '562': 'NER',
  '566': 'NGA', '578': 'NOR', '586': 'PAK', '591': 'PAN', '598': 'PNG',
  '600': 'PRY', '604': 'PER', '608': 'PHL', '616': 'POL', '620': 'PRT',
  '630': 'PRI', '634': 'QAT', '642': 'ROU', '643': 'RUS', '646': 'RWA',
  '682': 'SAU', '686': 'SEN', '688': 'SRB', '694': 'SLE', '702': 'SGP',
  '703': 'SVK', '704': 'VNM', '705': 'SVN', '706': 'SOM', '710': 'ZAF',
  '716': 'ZWE', '724': 'ESP', '728': 'SSD', '729': 'SDN', '740': 'SUR',
  '748': 'SWZ', '752': 'SWE', '756': 'CHE', '760': 'SYR', '762': 'TJK',
  '764': 'THA', '768': 'TGO', '780': 'TTO', '784': 'ARE', '788': 'TUN',
  '792': 'TUR', '795': 'TKM', '800': 'UGA', '804': 'UKR', '807': 'MKD',
  '826': 'GBR', '834': 'TZA', '840': 'USA', '854': 'BFA', '858': 'URY',
  '860': 'UZB', '862': 'VEN', '887': 'YEM', '894': 'ZMB',
};

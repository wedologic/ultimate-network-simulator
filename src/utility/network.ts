// TYPES

export type ConsultantRecord = {
  code: string;
  sponsorCode: string | null;
  salesPoints: number;
};

// CONSULTANT

type ConsultantProps = {
  code: string;
  salesPoints: number;
};

type SponsorshipMap = {
  [code: string]: {
    consultant: Consultant;
    sponsorCode: string | null;
  };
};

type RankData = {
  name: string;
  minPoints: number;
  bonusRatio: number;
};

type ConsultantData = {
  code: string;
  perosnalPoints: number;
  personalGroupPoints: number;
  totalPoints: number;
  rankPoints: number;
  splitoutPoints: number;
  rank: string;
  bonusRatio: number;
  bonus: number;
  totalNetwork: number;
  totalSplitouts: number;
  isActive: boolean;
  isQualified: boolean;
  isSplitout: boolean;
  subConsultants: ConsultantData[];
};

export class Consultant {
  protected _code: string;
  protected _salesPoints: number;
  protected _subConsultants: Consultant[];

  protected static _activationThreshold = 100;
  protected static _qualificationThreshold = 4000;
  protected static _splitoutThreshold = 10000;
  protected static _ranks: RankData[] = [
    {
      name: '22%',
      minPoints: 10000,
      bonusRatio: .22,
    },
    {
      name: '18%',
      minPoints: 6600,
      bonusRatio: .18,
    },
    {
      name: '15%',
      minPoints: 4000,
      bonusRatio: .15,
    },
    {
      name: '12%',
      minPoints: 2400,
      bonusRatio: .12,
    },
    {
      name: '9%',
      minPoints: 1200,
      bonusRatio: .09,
    },
    {
      name: '6%',
      minPoints: 600,
      bonusRatio: .06,
    },
    {
      name: '3%',
      minPoints: 200,
      bonusRatio: .03,
    },
  ];

  protected constructor(props: ConsultantProps) {
    this._code = props.code;
    this._salesPoints = props.salesPoints;
    this._subConsultants = [];
  }

  public static make(records: ConsultantRecord[]): Consultant {
    let rootConsultant: Consultant | null = null;
    const sponsorshipMap: SponsorshipMap = {};

    for (const record of records) {
      const consultant = new Consultant({
        code: record.code,
        salesPoints: record.salesPoints,
      });

      sponsorshipMap[record.code] = {
        consultant,
        sponsorCode: record.sponsorCode,
      };

      if (record.sponsorCode === null) {
        rootConsultant = consultant;
      }
    }

    if (rootConsultant === null) {
      throw new Error('Root consultant not found in records.');
    }

    for (const code of Object.keys(sponsorshipMap)) {
      const sponsorCode = sponsorshipMap[code].sponsorCode;
      if (sponsorCode === null) {
        continue;
      }

      if (typeof sponsorshipMap[sponsorCode] === 'undefined') {
        throw new Error(`Sponsor not found in records: ${sponsorCode}`);
      }

      const sponsor = sponsorshipMap[sponsorCode].consultant;
      const consultant = sponsorshipMap[code].consultant;
      sponsor.addSubConsultant(consultant);
    }

    return rootConsultant;
  }

  public addSubConsultant(consultant: Consultant): Consultant {
    this._subConsultants.push(consultant);
    return this;
  }

  protected static _getRankDada(points: number): RankData {
    for (const rank of Consultant._ranks) {
      if (points >= rank.minPoints) {
        return rank;
      }
    }
    return {
      name: '0%',
      minPoints: 0,
      bonusRatio: 0,
    };
  }

  public getData(): ConsultantData {
    const perosnalPoints = this._salesPoints;
    let rankPoints = perosnalPoints;
    let splitoutPoints = 0;
    let totalNetwork = this._subConsultants.length;
    let totalSplitouts = 0;
    const isActive = perosnalPoints >= Consultant._activationThreshold;
    const subConsultantsData: ConsultantData[] = [];

    for (const subConsultant of this._subConsultants) {
      const subConsultantData = subConsultant.getData();
      rankPoints += subConsultantData.rankPoints;
      if (subConsultantData.rankPoints >= Consultant._splitoutThreshold) {
        splitoutPoints += subConsultantData.rankPoints;
      }
      totalNetwork += subConsultantData.totalNetwork;
      if (subConsultantData.isSplitout) {
        totalSplitouts++;
      }
      totalSplitouts += subConsultantData.totalSplitouts;

      subConsultantsData.push(subConsultantData);
    }

    const personalGroupPoints = rankPoints - perosnalPoints - splitoutPoints;
    const totalPoints = perosnalPoints + personalGroupPoints;
    const rank = Consultant._getRankDada(rankPoints);
    let bonus = 0;
    if (isActive) {
      bonus += perosnalPoints * rank.bonusRatio;
      for (const subConsultantData of subConsultantsData) {
        const deltaBonusRatio = rank.bonusRatio - subConsultantData.bonusRatio;
        bonus += subConsultantData.totalPoints * deltaBonusRatio;
      }
    }

    const consultantData = {
      code: this._code,
      perosnalPoints,
      personalGroupPoints,
      totalPoints,
      rankPoints,
      splitoutPoints,
      rank: rank.name,
      bonusRatio: rank.bonusRatio,
      bonus,
      totalNetwork,
      totalSplitouts,
      isActive,
      isQualified: totalPoints >= Consultant._qualificationThreshold,
      isSplitout: rankPoints >= Consultant._splitoutThreshold,
      subConsultants: subConsultantsData,
    };

    let directorPoints = Consultant._getDirectorPoints(consultantData);
    if (directorPoints !== 0) {
      let lostDirectorPoints = 0;
      if (consultantData.totalPoints < 10000) {
        lostDirectorPoints = 10000 - consultantData.totalPoints;
      }
      if (directorPoints < 10000) {
        directorPoints = 10000;
      }
      directorPoints -= lostDirectorPoints;
      if (
        consultantData.perosnalPoints >= 200 &&
        consultantData.totalPoints >= 4000
      ) {
        consultantData.bonus += directorPoints * .04;
      }
    }

    return consultantData;
  }

  private static _getDirectorPoints(consultantData: ConsultantData): number {
    if (!consultantData.isSplitout) {
      return 0;
    }


    let result = 0;
    for (const subConsultantData of consultantData.subConsultants) {
      if (!subConsultantData.isSplitout) {
        continue;
      }
      result += subConsultantData.totalPoints;
      if (subConsultantData.totalPoints >= 4000) {
        continue;
      }
      result += Consultant._getDirectorPoints(subConsultantData);
    }
    return result;
  }
}

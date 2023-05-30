import {ConsultantRecord} from '@/types/consultant';

import {Sales} from '@/utility/sales';
import {Performance} from '@/utility/performance';

type ConsultantProps = {
  code: string;
  fullName: string;
};

type CodeMap = {
  [code: string]: Consultant;
};

type SponsorshipRecord = {
  code: string;
  sponsorCode: string;
};

export class Consultant {
  protected _code: string;
  protected _fullName: string;
  protected _sales: Sales;
  protected _consultants: Consultant[];
  protected _codeMap: CodeMap;

  protected constructor(props: ConsultantProps) {
    this._code = props.code;
    this._fullName = props.fullName;
    this._sales = Sales.make();
    this._consultants = [];
    this._codeMap = {};
  }

  public static make(props: ConsultantProps): Consultant {
    const consultant = new Consultant(props);
    return consultant;
  }

  public static makeFromRecords(records: ConsultantRecord[]): Consultant {
    let root: Consultant | null = null;
    const codeMap: CodeMap = {};
    const sponsorship: SponsorshipRecord[] = [];

    for (const record of records) {
      const consultant = Consultant.make({
        code: record.code,
        fullName: record.fullName,
      });

      codeMap[record.code] = consultant;

      if (record.sponsorCode === null) {
        root = consultant;
      } else {
        sponsorship.push({
          code: record.code,
          sponsorCode: record.sponsorCode,
        });
      }
    }

    if (root === null) {
      throw new Error('Root consultant not found in records.');
    }

    for (const {code, sponsorCode} of sponsorship) {
      if (typeof codeMap[sponsorCode] === 'undefined') {
        throw new Error(`Sponsor not found in records: ${sponsorCode}`);
      }
      codeMap[sponsorCode].addConsultant(codeMap[code]);
    }
    root._codeMap = codeMap;

    return root;
  }

  public addConsultant(consultant: Consultant): Consultant {
    this._consultants.push(consultant);
    this._codeMap[consultant._code] = consultant;
    return this;
  }

  public getPerformance(): Performance {
    let splitoutPoints = 0;

    const getGroupPoints = (consultant: Consultant, depth: number): number => {
      let result = 0;
      if (depth !== 0) {
        result += consultant.getSales().getPoints();
      }
      for (const subConsultant of consultant.getConsultants()) {
        const subGroupPoints = getGroupPoints(subConsultant, depth + 1);
        result += subGroupPoints;
        if (depth === 0 && subGroupPoints >= Performance.splitoutThreshold) {
          splitoutPoints += subGroupPoints;
        }
      }
      return result;
    };

    const personalPoints = this.getSales().getPoints();
    const groupPoints = getGroupPoints(this, 0);

    return Performance.make({
      personalPoints,
      groupPoints,
      splitoutPoints,
    });
  }

  public getConsultantByCode(code: string): Consultant | undefined {
    return this._codeMap[code];
  }

  public getCode(): string {
    return this._code;
  }

  public getFullName(): string {
    return this._fullName;
  }

  public getSales(): Sales {
    return this._sales;
  }

  public getConsultants(): Consultant[] {
    return this._consultants;
  }

  public present(): unknown {
    const performance = this.getPerformance();
    return {
      code: this.getCode(),
      fullName: this.getFullName(),
      salesHistory: this.getSales().getHistory(),
      personalPoints: performance.getPersonalPoints(),
      personalGroupPoints: performance.getPersonalGroupPoints(),
      totalPoints: performance.getTotalPoints(),
      rank: performance.getRank(),
      isActive: performance.isActive(),
      isQualified: performance.isQualified(),
      isSplitout: performance.isSplitout(),
      consultants: this.getConsultants().map((consultant) => {
        return consultant.present();
      }),
    };
  }
}

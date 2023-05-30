type PerformanceProps = {
  personalPoints: number;
  groupPoints: number;
  splitoutPoints: number;
};

type RankPointsRecord = {
  minPoints: number;
  rank: string;
};

export class Performance {
  protected _personalPoints: number;
  protected _groupPoints: number;
  protected _splitoutPoints: number;

  public static activationThreshold = 100;
  public static qualificationThreshold = 4000;
  public static splitoutThreshold = 10000;

  protected static _rankPoints: RankPointsRecord[] = [
    {
      minPoints: 10000,
      rank: '22%',
    },
    {
      minPoints: 6600,
      rank: '18%',
    },
    {
      minPoints: 4000,
      rank: '15%',
    },
    {
      minPoints: 2400,
      rank: '12%',
    },
    {
      minPoints: 1200,
      rank: '9%',
    },
    {
      minPoints: 600,
      rank: '6%',
    },
    {
      minPoints: 200,
      rank: '3%',
    },
  ];

  protected constructor(props: PerformanceProps) {
    this._personalPoints = props.personalPoints;
    this._groupPoints = props.groupPoints;
    this._splitoutPoints = props.splitoutPoints;
  }

  public static make(props: PerformanceProps): Performance {
    const performance = new Performance(props);
    return performance;
  }

  public getPersonalPoints(): number {
    return this._personalPoints;
  }

  public getPersonalGroupPoints(): number {
    return this._groupPoints - this._splitoutPoints;
  }

  public getTotalPoints(): number {
    return this._personalPoints + this.getPersonalGroupPoints();
  }

  public getRankPoints(): number {
    return this._personalPoints + this._groupPoints;
  }

  public isActive(): boolean {
    return this.getTotalPoints() >= Performance.activationThreshold;
  }

  public isQualified(): boolean {
    return this.getTotalPoints() >= Performance.qualificationThreshold;
  }

  public isSplitout(): boolean {
    return this.getTotalPoints() >= Performance.splitoutThreshold;
  }

  public getRank(): string {
    const totalPoints = this.getTotalPoints();

    for (const {minPoints, rank} of Performance._rankPoints) {
      if (totalPoints >= minPoints) {
        return rank;
      }
    }

    return '0%';
  }
}

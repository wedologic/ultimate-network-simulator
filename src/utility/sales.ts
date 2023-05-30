type SaleHistoryRecord = {
  points: number;
  order: number;
};

export class Sales {
  protected _history: SaleHistoryRecord[];
  protected _order: number;

  protected constructor() {
    this._history = [];
    this._order = 1;
  }

  public static make(): Sales {
    const sales = new Sales();
    return sales;
  }

  public add(points: number): Sales {
    this._history.push({
      points: points,
      order: this._order,
    });
    this._order++;
    return this;
  }

  public getPoints(): number {
    let result = 0;
    for (const {points} of this._history) {
      result += points;
    }
    return result;
  }

  public getHistory(): SaleHistoryRecord[] {
    return this._history;
  }
}

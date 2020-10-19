export class ItemId {
  static readonly INDEX_LENGTH = 3;

  public index: number;
  public type: string;

  constructor(type: string, index: number) {
    this.type = type;
    this.index = index;
  }

  public static fromString(id: string): ItemId {
    if (!id) throw new Error('No id string');
    const idRegex = new RegExp('^[A-Z]+_\\d{' + this.INDEX_LENGTH + '}$');

    if (!id.match(idRegex)) throw new Error('Invalid id string');

    const idParts = id.split('_');
    const type = idParts[0];
    const index = Number(idParts[1]);

    return new ItemId(type, index);
  }

  public toString(): string {
    const indexString = this.index
      .toString()
      .padStart(ItemId.INDEX_LENGTH, '0'); // Add leading zeros
    return `${this.type}_${indexString}`;
  }
}

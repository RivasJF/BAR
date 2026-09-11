const INITIAL_NUMBER_COPIES:number = 1;

export class NewBook {
  private constructor(
    public readonly publicId: string,
    public readonly cardNumber: number | null,
    public readonly callNumber: string | null,
    public readonly deweyCategory: DeweyCategory,
    public readonly copies: number = INITIAL_NUMBER_COPIES,
    public readonly volume: number | null,
    public readonly title: string | null,
    public readonly titleNormalized: string | null,
    public readonly observations: string | null,
  ) { }

  static create(
    cardNumber: number | null,
    callNumber: string | null,
    deweyCategory: DeweyCategory,
    copies: number,
    volume: number | null,
    title: string | null,
    observations: string | null,
  ) {
    if (callNumber) callNumber = callNumber.trim();
    if (title) title = title.trim();
    if (observations) observations = observations.trim();
    const publicId = crypto.randomUUID();
    if (!callNumber && !cardNumber) {
      throw new Error('Either callNumber or cardNumber must be provided.');
    }
    let titleNormalized = null;
    if (title) {
      titleNormalized = title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    return new NewBook(
      publicId,
      cardNumber,
      callNumber,
      deweyCategory,
      copies,
      volume,
      title,
      titleNormalized,
      observations,
    );
  }
}

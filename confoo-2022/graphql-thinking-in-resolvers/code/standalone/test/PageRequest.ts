export class PageRequest {


  get first(): number | null {
    return 10;
  }

  get after(): string | null {
    return null;
  }

  get last(): number | null {
    return null;
  }

  get before(): number | null {
    return null;
  }
}

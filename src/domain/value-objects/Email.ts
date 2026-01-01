export class Email {
  private constructor(private readonly value: string) {}

  public static create(email: string): Email {
    if (!email.includes("@")) {
      throw new Error("Invalid email format")
    }
    return new Email(email)
  }

  public getValue(): string {
    return this.value
  }
}

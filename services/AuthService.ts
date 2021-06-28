export class AuthService {
  contructor() {}

  usernameValidated(username: string) {
    // username can only contain word and digit without space
    return /^(\w|\d)+$/.test(username);
  }

  passwordValidated = this.usernameValidated;

  displaynameValidated(displayname: string) {
    // displayname con contain word, digit, space, - and ., but weird expression like
    // -., -_, -"space" are forbiddend.
    // For example, we allow: Addison–Wesley, Alfred A. Knopf,
    return (
      /(?<!\s)$/.test(displayname) &&
      /^(\w+-{0,1}\.{0,1}\s{0,1})+$/.test(displayname) &&
      !/-\.|-\s|-_/.test(displayname)
    );
  }

  lengthValidated(number: number, string: string) {
    const length = string.split("").length;
    if (length <= number) {
      return true;
    } else {
      return false;
    }
  }
}

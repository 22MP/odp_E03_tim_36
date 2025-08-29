// Validacija za registraciju korisnika na serveru
export function validacijaPodatakaRegistracija(
  korisnickoIme?: string,
  lozinka?: string,
  imePrezime?: string,
  telefon?: string,
  slika?: any // Buffer, string, File, zavisi od backend parsiranja
): { uspesno: boolean; poruka?: string } {
  if (!korisnickoIme || !lozinka || !imePrezime || !telefon ) {
    return { uspesno: false, poruka: "Sva polja su obavezna." };
  }
  if (korisnickoIme.length < 3) {
    return { uspesno: false, poruka: "Korisničko ime mora imati najmanje 3 karaktera." };
  }
  if (!/^[a-zA-Z0-9._-]+$/.test(korisnickoIme)) {
    return { uspesno: false, poruka: "Korisničko ime može sadržati samo slova, brojeve i ._- znakove." };
  }
  if (lozinka.length < 6) {
    return { uspesno: false, poruka: "Lozinka mora imati najmanje 6 karaktera." };
  }
  if (lozinka.length > 20) {
    return { uspesno: false, poruka: "Lozinka može imati najviše 20 karaktera." };
  }
  if (imePrezime.length < 3) {
    return { uspesno: false, poruka: "Ime i prezime mora imati najmanje 3 karaktera." };
  }
  if (!/^([A-Za-zčćžšđČĆŽŠĐ\s\-]+)$/.test(imePrezime)) {
    return { uspesno: false, poruka: "Ime i prezime može sadržati samo slova i razmake." };
  }
  if (!/^[0-9]{8,12}$/.test(telefon)) {
    return { uspesno: false, poruka: "Telefon može sadržati samo brojeve (8-12 cifara)." };
  }
   if (slika) {
    const size = (slika.size ?? slika.length ?? 0) as number; // Multer File.size ili Buffer.length
    if (size > 2 * 1024 * 1024) {
      return { uspesno: false, poruka: "Slika mora biti manja od 2MB." };
    }
    const mimetype = slika.mimetype ?? slika.type;
    if (mimetype && !/^image\//.test(mimetype)) {
      return { uspesno: false, poruka: "Dozvoljene su samo slike (image/*)." };
    }
  }
  return { uspesno: true };
}
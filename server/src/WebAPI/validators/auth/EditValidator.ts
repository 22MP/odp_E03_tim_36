// Validacija za izmjenu profila na serveru
export function validacijaPodatakaIzmjene(
  imePrezime?: string,
  telefon?: string,
  slika?: any // Multer File / Buffer / string (zavisi od backend parsiranja)
): { uspesno: boolean; poruka?: string } {
  // Ime i prezime (OBAVEZNO)
  if (!imePrezime || imePrezime.trim().length === 0) {
    return { uspesno: false, poruka: "Ime i prezime je obavezno." };
  }
  const v = imePrezime.trim();
  if (v.length < 3) {
    return { uspesno: false, poruka: "Ime i prezime mora imati najmanje 3 karaktera." };
  }
  if (!/^([A-Za-zčćžšđČĆŽŠĐ\s\-]+)$/.test(v)) {
    return { uspesno: false, poruka: "Ime i prezime može sadržati samo slova i razmake." };
  }

  // Telefon (opciono)
  if (typeof telefon !== "undefined") {
    const t = (telefon ?? "").trim();
    if (t.length === 0) {
      return { uspesno: false, poruka: "Telefon ne može biti prazan." };
    }
    if (!/^[0-9]{8,12}$/.test(t)) {
      return { uspesno: false, poruka: "Telefon može sadržati samo brojeve (8-12 cifara)." };
    }
  }

  // Slika (opciono) — dozvoljena max 2MB; ako imaš mimetype, provjeri da je image/*
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

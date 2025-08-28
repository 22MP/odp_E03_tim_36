// client/src/utils/validation/EditValidator.ts
import type { RezultatValidacije } from "../../../types/validation/ValidationResult";

/**
 * Validacija podataka pri izmjeni profila.
 * Ime i prezime je obavezno polje.
 * Telefon i slika su opciona, ali ako se šalju – moraju biti ispravni.
 */
export function validacijaPodatakaIzmjene(
  imePrezime?: string,
  telefon?: string | null,
  slika?: File | null
): RezultatValidacije {
  // Ime i prezime (OBAVEZNO)
  if (!imePrezime || imePrezime.trim().length === 0) {
    return { uspesno: false, poruka: "Ime i prezime je obavezno." };
  }
  const v = imePrezime.trim();
  if (v.length < 3) {
    return { uspesno: false, poruka: "Ime i prezime mora imati najmanje 3 karaktera." };
  }
  if (!/^([A-Za-zčćžšđČĆŽŠĐ\s\-]+)$/.test(v)) {
    return { uspesno: false, poruka: "Ime i prezime može sadržati samo slova, razmake i '-'." };
  }

  // Telefon (opciono)
  if (typeof telefon !== "undefined" && telefon !== null) {
    const t = telefon.trim();
    if (t.length === 0) {
      return { uspesno: false, poruka: "Telefon ne može biti prazan." };
    }
    if (!/^[0-9]{8,12}$/.test(t)) {
      return { uspesno: false, poruka: "Telefon može sadržati samo brojeve (8–12 cifara)." };
    }
  }

  // Slika (opciono)
  if (slika) {
    if (!/^image\//.test(slika.type)) {
      return { uspesno: false, poruka: "Dozvoljene su samo slike (image/*)." };
    }
    if (slika.size > 2 * 1024 * 1024) {
      return { uspesno: false, poruka: "Slika mora biti manja od 2MB." };
    }
  }

  return { uspesno: true };
}

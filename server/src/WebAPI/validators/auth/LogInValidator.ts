import { RezultatValidacije } from '../../../Domain/types/ValidationResult';

export function validacijaPodatakaAuth(korisnickoIme?: string, lozinka?: string): RezultatValidacije {
  if (!korisnickoIme || !lozinka) {
    return { uspesno: false, poruka: 'Korisnicko ime i lozinka su obavezni.' };
  }

  if (korisnickoIme.length < 3) {
    return { uspesno: false, poruka: 'Кorisnicko ime mora da ima najmanje 3 karaktera' };
  }

  if (lozinka.length < 6) {
    return { uspesno: false, poruka: 'Lozinka mora da ima najmanje 6 karaktera' };
  }

  if (lozinka.length > 20) {
    return { uspesno: false, poruka: 'Lozinka moze imati najvise 20 karaktera' };
  }

  return { uspesno: true };
}


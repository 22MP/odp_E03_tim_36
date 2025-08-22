-- Kreiranje baze podataka
CREATE DATABASE IF NOT EXISTS DEFAULT_DB;

USE DEFAULT_DB;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    korisnickoIme VARCHAR(50) UNIQUE NOT NULL,
    lozinka VARCHAR(500) NOT NULL,
    brojTelefona VARCHAR(20),
    ImePrezime VARCHAR(100),
    slika VARCHAR(255),
    uloga VARCHAR(15) NOT NULL
);
-- Kreiranje tabele za poruke
CREATE TABLE IF NOT EXISTS messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    posiljalacID INT NOT NULL,
    primalacID INT NOT NULL,
    stanje VARCHAR(20) NOT NULL,
    vrijeme DATETIME NOT NULL,
    tekstPoruke TEXT NOT NULL,
    FOREIGN KEY (posiljalacID) REFERENCES users(id),
    FOREIGN KEY (primalacID) REFERENCES users(id)
);
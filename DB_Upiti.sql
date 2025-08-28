-- Kreiranje baze podataka
CREATE DATABASE IF NOT EXISTS DEFAULT_DB;

USE DEFAULT_DB;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    korisnickoIme VARCHAR(50) UNIQUE NOT NULL,
    lozinka VARCHAR(500) NOT NULL,
    brojTelefona VARCHAR(20) UNIQUE,
    imePrezime VARCHAR(100) NOT NULL,
    slika VARCHAR(255),
    uloga VARCHAR(15) NOT NULL
);
-- Kreiranje tabele za poruke
-- VAN PDF-a: praktična šema poruka za MySQL 8.x
CREATE TABLE IF NOT EXISTS messages (
    id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
    posiljalacID    INT UNSIGNED NOT NULL,
    primalacID      INT UNSIGNED NOT NULL,
    stanje          ENUM('sent','read') NOT NULL DEFAULT 'sent',
    vrijemeSlanja   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    vrijemeCitanja  DATETIME NULL,
    tekstPoruke     TEXT NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_conv_time (posiljalacID, primalacID, vrijemeSlanja),
    INDEX idx_unread    (primalacID, stanje, vrijemeCitanja)
);

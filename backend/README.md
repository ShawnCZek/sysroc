# Backend systému na ročníkové práce

## Požadavky

### Služby

- Běžící [server s prostředníkem pro komunikaci se službou ActiveDirectory](https://github.com/jblxo/ActiveDirectoryJWTAuthServer).

## Konfigurace

Konfigurace systému se tahá z `.env` souborů dle typu prostředí, kdy konečný název souboru je
typ prostředí + `.env` (tj. např. `development.env`).  
Pro správný běh systému je vždy potřeba takový soubor vytvořit pro každý možný typ prostředí,
pro vývoj na lokálním prostředí stačí pouze soubor `development.env`.

### Hodnoty

|                   | Možnosti  | Popis                                                                               |
|-------------------|-----------|-------------------------------------------------------------------------------------|
| `AD_ENDPOINT`     | `string`  | Adresa na server s běžícím prostředníkem pro komunikaci se službou ActiveDirectory. |
| `DB_HOST`         | `string`  | Adresa na databázový server (PostgreSQL).                                           |
| `DB_PORT`         | `number`  | Port databázového serveru.                                                          |
| `DB_USER`         | `string`  | Uživatelské jméno databázového uživatele.                                           |
| `DB_PASSWORD`     | `string`  | Heslo databázového uživatele.                                                       |
| `DB_DATABASE`     | `string`  | Název databáze projektu.                                                            |
| `MAILER_FROM`     | `string`  | Odesílatel emailových zpráv.                                                        |
| `MAILER_HOST`     | `string`  | Adresa na mailový server.                                                           |
| `MAILER_PORT`     | `number`  | Port mailového serveru.                                                             |
| `MAILER_TLS`      | `boolean` | Zdali se používá TLS pro mailový server.                                            |
| `MAILER_SECURE`   | `boolean` | Zdali mají být emailové zprávy zabezpečeny.                                         |
| `MAILER_USER`     | `string`  | Uživatelské jméno mailového poskytovatele.                                          |
| `MAILER_PASSWORD` | `string`  | Heslo účtu mailového poskytovatele.                                                 |

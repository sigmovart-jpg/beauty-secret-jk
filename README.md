# Beauty Secret JK — strona www

Statyczna strona salonu fryzjersko-kosmetycznego Beauty Secret JK w Łodzi.

## Struktura
- `index.html` — strona główna
- `rezerwacja.html` — formularz rezerwacji wizyty
- `styles.css`, `script.js` — style i logika
- `_headers`, `_redirects`, `wrangler.toml` — konfiguracja Cloudflare Pages

## Lokalny podgląd
```bash
cd beauty-secret-jk
python -m http.server 8765
# otwórz http://127.0.0.1:8765
```

## Deploy na Cloudflare Pages

### Opcja 1 — przez panel Cloudflare (najprostsza)
1. Wejdź na https://dash.cloudflare.com → Workers & Pages → Create application → Pages → Upload assets.
2. Przeciągnij folder `beauty-secret-jk` (lub zrób zip).
3. Po deployu podłącz własną domenę `beautysecretjk.pl` w zakładce Custom domains.

### Opcja 2 — przez Wrangler CLI
```bash
npm install -g wrangler
cd beauty-secret-jk
wrangler login
wrangler pages deploy . --project-name=beauty-secret-jk
```

### Opcja 3 — przez Git (automatyczne deploye)
1. Wypchnij folder do repozytorium Git (GitHub/GitLab).
2. W Cloudflare Pages: Create → Connect to Git → wybierz repo.
3. Build command: (puste), Build output directory: `/`.
4. Podłącz domenę `beautysecretjk.pl`.

## Formularz rezerwacji
Formularz w `rezerwacja.html` używa `mailto:` — otwiera program pocztowy klienta.
Aby przejść na Formspree / własny backend, zmień atrybut `action` w formularzu.

## Kontakt
- Telefon: +48 502 755 887
- Adres: ul. Rąbieńska 1, 94-227 Łódź
- E-mail: kontakt@beautysecretjk.pl
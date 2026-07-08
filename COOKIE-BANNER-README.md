# Cookie Banner - Instrukcja Implementacji

## Przegląd
Cookie banner blokuje uruchomienie skryptów Google Analytics i Meta Pixel do momentu, aż użytkownik zaakceptuje cookies. Decyzja jest zapisywana w localStorage i zapamiętywana na kolejne wizyty.

## Pliki

1. **css/cookies.css** - Stylizacja bannera (responsywna, pasująca do kolorystyki strony)
2. **js/cookies.js** - Logika obsługi bannera i blokowania/odblokowywania skryptów

## Kroki wdrożenia

### Krok 1: Dodaj link do CSS w `<head>` każdej strony

```html
<link rel="stylesheet" href="./css/cookies.css">
```

### Krok 2: Zmodyfikuj tag Google Analytics

Zamień zwykły tag GA:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-S4M422D44C"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-S4M422D44C');
</script>
```

Na tag BLOKOWANY:
```html
<!-- Google tag (gtag.js) - BLOCKED UNTIL CONSENT -->
<script 
    data-tracking="google-analytics" 
    data-src="https://www.googletagmanager.com/gtag/js?id=G-S4M422D44C"
    type="text/plain"
    async>
</script>
<script type="text/plain" data-tracking="google-analytics">
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-S4M422D44C');
</script>
```

**Ważne zmiany:**
- Dodaj atrybut `data-tracking="google-analytics"`
- Zmień `src` na `data-src` w pierwszym skrypcie
- Zmień `type="text/javascript"` na `type="text/plain"` (aby se nie uruchomił)
- Drugi skrypt również będzie miał `type="text/plain"`

### Krok 3: (Opcjonalnie) Meta Pixel

Jeśli używasz Meta Pixel:
```html
<!-- Meta Pixel Code - BLOCKED UNTIL CONSENT -->
<script type="text/plain" data-tracking="meta-pixel">
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    // ... reszta kodu ...
    fbq('init', 'YOUR_PIXEL_ID');
    fbq('track', 'PageView');
</script>
```

### Krok 4: Dodaj HTML bannera

Umieść to tuż przed zamykającym tagiem `</body>`:

```html
<!-- Cookie Banner -->
<div id="cookie-banner">
    <div class="cookie-content">
        <p>
            🍪 Dbamy o Twoją prywatność. Za Twoją zgodą chcemy używać plików cookies,
            aby analizować ruch na stronie i ulepszać nasze treści.
            <a href="./polityka-prywatnosci/">Dowiedz się więcej</a>
        </p>
    </div>
    <div class="cookie-buttons">
        <button class="cookie-btn cookie-btn-reject" onclick="rejectCookies()">Odrzuć</button>
        <button class="cookie-btn cookie-btn-accept" onclick="acceptCookies()">Akceptuję</button>
    </div>
</div>
```

### Krok 5: Dodaj skrypt JavaScript

Dodaj w `<head>` każdej strony (PRZED tagami GA/Meta Pixel):

```html
<link rel="stylesheet" href="./css/cookies.css">
<script src="./js/cookies.js"></script>
```

## Jak to działa

1. **Na pierwszą wizytę:** 
   - Banner się pokazuje
   - Skrypty GA/Meta Pixel są blokowane (type="text/plain")
   - Użytkownik widzi przyciski "Akceptuję" / "Odrzuć"

2. **Po kliknięciu "Akceptuję":**
   - Decyzja zapisywana jest w `localStorage` (klucz: `cookieConsent`)
   - Skrypty są "odblokowane" - zmienia się ich `type` i `src`/`data-src`
   - Skrypty się uruchamiają
   - Banner znika

3. **Na kolejne wizyty:**
   - JavaScript sprawdza `localStorage`
   - Jeśli cookies zaakceptowane → skrypty się uruchamiają automatycznie, baner nie pokazuje się
   - Jeśli nie → banner się pokazuje

## Customizacja

### Zmiana tekstu bannera
Zmodyfikuj zawartość div `cookie-content` w HTML

### Zmiana kolorów
CSS używa zmiennych CSS (`--primary-color`, `--text-color`, itp.), które są już zdefiniowane w `css/index.css`. Wygląd automatycznie dostosowuje się do Twojej kolorystyki.

### Zmiana wersji cookies
Jeśli chcesz ponownie pokazać banner wszystkim użytkownikom, zmień wartość `COOKIE_CONSENT_VERSION` w `js/cookies.js` z `'1.0'` na `'2.0'`.

## Struktura dla wszystkich stron

Każda strona powinna mieć:

```html
<!DOCTYPE html>
<html>
<head>
    <!-- ... inne meta tagi ... -->
    
    <!-- CSS bannera -->
    <link rel="stylesheet" href="./css/cookies.css">
    
    <!-- Skrypt bannera - NAJPIERW -->
    <script src="./js/cookies.js"></script>
    
    <!-- Google Analytics - ZBLOKOWANY -->
    <script 
        data-tracking="google-analytics" 
        data-src="https://www.googletagmanager.com/gtag/js?id=G-S4M422D44C"
        type="text/plain"
        async>
    </script>
    <script type="text/plain" data-tracking="google-analytics">
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-S4M422D44C');
    </script>
</head>
<body>
    <!-- ... zawartość strony ... -->
    
    <!-- Cookie Banner HTML -->
    <div id="cookie-banner">
        <div class="cookie-content">
            <p>
                🍪 Dbamy o Twoją prywatność. Za Twoją zgodą chcemy używać plików cookies,
                aby analizować ruch na stronie i ulepszać nasze treści.
                <a href="./polityka-prywatnosci/">Dowiedz się więcej</a>
            </p>
        </div>
        <div class="cookie-buttons">
            <button class="cookie-btn cookie-btn-reject" onclick="rejectCookies()">Odrzuć</button>
            <button class="cookie-btn cookie-btn-accept" onclick="acceptCookies()">Akceptuję</button>
        </div>
    </div>
</body>
</html>
```

## Obsługa wielu ID GA

Jeśli masz różne ID GA dla różnych stron, w `js/cookies.js` zmień linię:

```javascript
gtag('config', 'G-S4M422D44C', {
    'anonymize_ip': false
});
```

Na:
```javascript
const gaId = document.querySelector('script[data-tracking="google-analytics"][data-id]')?.dataset.id || 'G-S4M422D44C';
gtag('config', gaId, {
    'anonymize_ip': false
});
```

A w HTML dodaj atrybut:
```html
<script 
    data-tracking="google-analytics" 
    data-id="G-S4M422D44C"
    data-src="https://www.googletagmanager.com/gtag/js?id=G-S4M422D44C"
    type="text/plain"
    async>
</script>
```

## RODO / GDPR compliance

Ten cookie banner zapewnia RODO-compliant flow:
✓ Baner widoczny na pierwszą wizytę
✓ Wymagana aktywna akceptacja ("Akceptuję")
✓ Opcja do odrzucenia cookies
✓ Przechowywanie preferencji w localStorage
✓ Skrypty śledzące nie działają bez zgody

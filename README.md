## Instalacja  📥

[Pobierz Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)

### Zainstaluj yarn

```bash
npm install --global yarn
```

##  Zmienne środowiskowe 🚀

Do poprawnego działania aplikacji potrzebujesz następujących zmiennych w pliku .env.

`PORT`

`DATABASE_URL`

`AZURE_CLIENT_ID`

`AZURE_CLIENT_SECRET`

`AZURE_TENANT_ID`

`CLIENT_URL`

`JWT_SECRET`

## Implementacja  🛠️

Użyj komendy:

```bash
yarn
```

aby zainstalować wszystkie pakiety.

## Baza danych  🤔

Aplikacja wykorzystuje Mysql.

### Generowanie struktury bazy dancych ◭

```bash
yarn prisma db generate
yarn prisma db push
```

## Uruchamianie projektu 📡

### Tryb dev

```bash
yarn dev
```

const readline = require('readline-sync');
const fragen = require('./questions');

// Ansi Color
const ROT = '\x1b[31m';
const GRUEN = '\x1b[32m';
const ORANGE = '\x1b[38;5;208m';
const GELB = '\x1b[33m';
const BLAU = '\x1b[34m';
const MAGENTA = '\x1b[35m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';

function spielerRegistrieren() {
  let spielerAnzahl;
  let eingabe = readline.question(`Willkommen beim Quizspiel! Wie viele Spieler nehmen teil? ${BLAU}(1–4):${RESET} `);
  spielerAnzahl = parseInt(eingabe);

  while (isNaN(spielerAnzahl) || spielerAnzahl < 1 || spielerAnzahl > 4) {
    console.log(`${ROT}Bitte gib eine gültige Zahl zwischen 1 und 4 ein.${RESET}`);
    eingabe = readline.question(`Wie viele Spieler nehmen teil? ${BLAU}(1–4):${RESET} `);
    spielerAnzahl = parseInt(eingabe);
  }

  const spielerListe = [];

  let i = 0;
  while (i < spielerAnzahl) {
    let spielerName = readline.question(`${BLAU}Spieler ${i + 1}${RESET}, wie ist dein Name? `);
    spielerListe.push({
      name: spielerName,
      punkte: 0,
    });
    i++;
  }

  return spielerListe;
}

function kategorieAuswaehlen() {
  const kategorien = ['Geschichte', 'Mathematik', 'Geographie', 'Mix'];

  let eingabeKategorie = readline.question(`Wähle eine Kategorie:\n ${GELB}Geschichte${RESET},\n ${CYAN}Mathematik${RESET},\n ${MAGENTA}Geographie${RESET},\n ${GRUEN}Mix${RESET}\n `);

  const kategorienInKlein = [];
  kategorien.forEach(kategorie => {
    kategorienInKlein.push(kategorie.toLowerCase());
  });

  const eingabeIstGueltig = (eingabe) => {
    return kategorienInKlein.includes(eingabe.toLowerCase());
  }

  while (!eingabeIstGueltig(eingabeKategorie)) {
    eingabeKategorie = readline.question(`${ROT}Ungültige Kategorie. Bitte erneut wählen: ${RESET}`);
  }

  return eingabeKategorie;
}

function frageAnSpielerStellen(spieler, frage) {
  console.log(`\n${BLAU}${spieler.name}${RESET} ist dran:`);
  console.log(frage.frage);

  const optionFarben = { A: GELB, B: CYAN, C: MAGENTA, D: GRUEN };

  function optionenAnzeigen(optionen) {
    optionen.forEach(option => {
      const buchstabe = option.charAt(0);
      const farbe = optionFarben[buchstabe];
      console.log(`${farbe}${option}${RESET}`);
    });
  }

optionenAnzeigen(frage.optionen);


const gueltigeAntworten = frage.optionen.map(opt => opt.charAt(0).toUpperCase());
let spielerAntwort = readline.question('Antwort (A/B/C/D): ').toUpperCase();

while (!gueltigeAntworten.includes(spielerAntwort)) {
  console.log(`${ROT}Ungültige Eingabe! Bitte nur ${gueltigeAntworten.join('/')} eingeben.${RESET}`);
  spielerAntwort = readline.question('Antwort (A/B/C/D): ').toUpperCase();
}

if (spielerAntwort === frage.antwort) {
  console.log(`${GRUEN}✅ Richtig!${RESET}`);
  spieler.punkte++;
} else {
  console.log(`${ROT}❌ Falsch! Die richtige Antwort war: ${frage.antwort}${RESET}`);
}
}


function fragenAuswaehlen(kategorie, anzahl) {
  if (kategorie.toLowerCase() === 'mix') {
    const mixFragen = [
      ...fragen.Geschichte,
      ...fragen.Mathematik,
      ...fragen.Geographie
    ];
    return mixFragen.sort(() => Math.random() - 0.5).slice(0, anzahl);
  }
  const formatierteKategorie = kategorie.charAt(0).toUpperCase() + kategorie.slice(1).toLowerCase();
  return fragen[formatierteKategorie].sort(() => Math.random() - 0.5).slice(0, anzahl);
}


function spielstandAnzeigen(spielerListe, fragenProSpieler) {
  console.log(`\n${BLAU}ERGEBNISSE\n${RESET}`);

  let maxPunkte = 0;
  for (const spieler of spielerListe) {
    console.log(`${spieler.name}: ${spieler.punkte} von ${fragenProSpieler} Punkten`);
    if (spieler.punkte > maxPunkte) {
      maxPunkte = spieler.punkte;
    }
  }

  let gewinnerListe = [];
  for (const spieler of spielerListe) {
    if (spieler.punkte === maxPunkte) {
      gewinnerListe.push(spieler);
    }
  }

  if (gewinnerListe.length === 1) {
    const gewinner = gewinnerListe[0];
    console.log(`\n${GRUEN}🏆 ${gewinner.name} hat das Spiel mit ${maxPunkte} von ${fragenProSpieler} Punkten gewonnen!\n Herzlichen Glückwunsch! 🎊${RESET}`);
  } else {
let unentschieden = '';
for (let i = 0; i < gewinnerListe.length; i++) {
  unentschieden += gewinnerListe[i].name + ', ';
}
unentschieden = unentschieden.trim().slice(0, -1);

    console.log(`\n${GRUEN}🤝 Unentschieden! ${unentschiedenListe} haben mit je ${maxPunkte} von ${fragenProSpieler} Punkten gewonnen!${RESET}`);
  }
}


function spielWiederholenAbfragen() {
  let antwort = readline.question('Nochmal spielen? (J/N): ').toUpperCase();
  if (antwort === 'J') return true;
  console.log(`${MAGENTA}Danke fürs Spielen. Bis zum nächsten Mal!${RESET}`);
  return false;
}


function quizSpielStarten() {
  const spielerListe = spielerRegistrieren();
  const ausgewaehlteKategorie = kategorieAuswaehlen();
  const fragenProSpieler = 3;
  const gesamtFragen = fragenProSpieler * spielerListe.length;

  const fragenListe = fragenAuswaehlen(ausgewaehlteKategorie, gesamtFragen);
  for (let i = 0; i < gesamtFragen; i++) {
    const aktuellerSpieler = spielerListe[i % spielerListe.length];
    const aktuelleFrage = fragenListe[i];
    frageAnSpielerStellen(aktuellerSpieler, aktuelleFrage);
  }

  spielstandAnzeigen(spielerListe, fragenProSpieler);

  if (spielWiederholenAbfragen())
    quizSpielStarten();
}

quizSpielStarten();

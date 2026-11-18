# Projekt-Statusbericht

## Projektinformationen

Projekt: Task-Scheduler  
Projektleiter: Boris  
Sprint: Sprint 1 (02.09.2026 – 14.10.2026)  
Berichtsdatum: 14.10.2026  

---

## Management Summary

Sprint 1 wurde erfolgreich und termingerecht abgeschlossen. Im Frontend wurden das vollstaendige Anwendungs-Layout, das Dashboard mit Kennzahlen, die Ansicht aller Aufgaben mit Tabellen- und Kachelmodus, der wiederverwendbare Task-Detail-Drawer sowie die Label- und Teamverwaltung gemaess Pflichtenheft umgesetzt. Im Backend stehen das Express-Grundgeruest, die Docker-basierte MariaDB-Entwicklungsumgebung und das relationale Datenbankschema bereit; die Verbindung zur Datenbank ist hergestellt. Die Zusammenarbeit im Team funktioniert sehr zuverlaessig, und alle Kernanforderungen fuer den ersten Meilenstein wurden erreicht. Das Projekt befindet sich vollstaendig im Zeitplan fuer den Start von Sprint 2.

**Gesamtstatus:** 🟢 Grün

---

## Projektfortschritt

### Erreichte Meilensteine

| Meilenstein | Geplant | Erreicht | Status |
|-------------|---------|----------|--------|
| Projektteam und GitHub eingerichtet | 25.08.2026 | 25.08.2026 | ✅ |
| Pflichtenheft mit Projektbeschreibung und Mockups eingereicht | 02.09.2026 | 02.09.2026 | ✅ |
| Sprint 1 Basisfunktionalitaeten abgeschlossen | 14.10.2026 | 14.10.2026 | ✅ |
| Projektstatusbericht Sprint 1 abgegeben | 14.10.2026 | 14.10.2026 | ✅ |

### Aktuelle Arbeiten

- Frontend: Entwicklung der Team- und Gruppenverwaltung mit Absicherung der Administrator-Rollen gemaess Pflichtenheft F013 und F014.
- Frontend: Bereitstellung der Labelverwaltung und des Modals zur Erfassung neuer Tasks.
- Backend: Anbindung der MariaDB-Datenbank an Express und Bereitstellung der ersten API-Endpunkte.
- Integration: Behebung von Schnittstellen- und Darstellungsunstimmigkeiten im Gesamtsystem.

### Geplante Arbeiten bis zum nächsten Bericht (Sprint 2: 21.10.2026 – 18.11.2026)

- Implementierung der Logik fuer wiederkehrende Tasks und deren Instanzenverwaltung (Pflichtenheft F003 & F009).
- Umsetzung der Zeitachsen-Ansicht (Timeline View) im Frontend gemaess Pflichtenheft F010.
- Entwicklung des Erinnerungssystems (Reminder) inklusive E-Mail-Benachrichtigungsdienst (Pflichtenheft F006 & F007).
- Vollstaendige End-to-End-Anbindung saemtlicher Frontend-Komponenten an die Backend-REST-API.

---

## Risiken

| Risiko | Auswirkung | Wahrscheinlichkeit | Massnahmen | Status |
|--------|------------|--------------------|------------|--------|
| Komplexitaet der Berechnung von flexiblen Fälligkeiten (z.B. bestimmter Wochentag im Monat) | Mittel | Mittel | Fruehzeitige Implementierung robuster Datumshelfer und automatisierter Tests in Sprint 2 | In Arbeit |
| Zuverlaessiger Versand von Reminder-E-Mails in Test- und Schulumgebungen | Mittel | Tief | Einsatz eines lokalen SMTP-Testservers (z.B. Mailtrap) vor dem Produktiv-Rollout | Offen |
| Verzoegerungen bei der API-Integration zwischen Frontend und Backend | Mittel | Tief | Klare Definition der JSON-Schnittstellen und Mock-Daten im Pinia-Store als Rueckfallebene | Geschlossen |

---

## Probleme und Eskalationen

| Thema | Beschreibung | Verantwortlich | Termin |
|-------|--------------|----------------|--------|
| Keine aktuellen Eskalationen | Alle Aufgaben in Sprint 1 wurden ohne blockierende Probleme geloest | Boris | 14.10.2026 |

---

## Entscheidungen

| Datum | Entscheidung | Verantwortlich |
|--------|--------------|-----------------|
| 09.09.2026 | Einsatz von Pinia als einheitliches State-Management im Vue-Frontend | Boris, Dmytro |
| 16.09.2026 | Auslagerung der Task-Detailansicht in eine wiederverwendbare Drawer-Komponente fuer Dashboard und Taskliste | Boris |
| 23.09.2026 | Nutzung einer Docker-Umgebung fuer MariaDB zur Gewaehrleistung identischer Entwicklungsumgebungen | Fabio, Liam |
| 30.09.2026 | Strikte clientseitige und serverseitige Validierung der Gruppenadministrator-Rollen (mindestens ein Admin pro Team) | Boris, Liam |

---

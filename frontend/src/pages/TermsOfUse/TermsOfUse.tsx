import { useEffect } from "react"
import styles from "./TermsOfUse.module.css"
import { Link } from "react-router-dom";
const TermsOfUse = () => {

    return (
        <div className={styles.page}>
            <h1>Termini e Condizioni</h1>
            <div className={styles.content}>
                
            <section>
            <p>In questa pagina troverai le informazioni riguardanti il rapporto tra l'Utente e i nostri Servizi.</p>
            <p>E' importante leggerla con attenzione e controllarla periodicamente, dato che puo' essere soggetta a modifiche.</p>
            </section>
            <section id="dati-personali">
            <h3 className={styles.title}>Regitrazione</h3>
            <p>Dal momento che l'Utente crea un account presso i nostri Servizi, acconsente che i suoi dati vengano raccolti e utilizzati come definito nella nostra <a href="./privacy-policiy">Privacy Policy</a></p>
            <p>L'Utente puo' richiedere l'eliminazione dell'account, insieme a tutti i dati, in qualunque momento.</p>
            </section>
            <section>
            <h3 className={styles.title}>Acquisto dei corsi</h3>
            <p>I corsi acquistati sono visibili nell'area utente, online, presso il presente sito.</p>
            <p>E' vietata la condivisione o la rivendita dei video o di altro materiale fornito.</p>
            <p>E' inoltre vietato la condivisione dell'account con altri Utenti.</p>
            <p>Al momento dell'eliminazione dell'account tutti i corsi acquistati verrano persi, senza possibilta di recupero.</p>
            <p>In nessun caso i corsi acquistati possono essere rimborsati.</p>
            </section>
            <section>
            <h3 className={styles.title}>Accesso al sito</h3>
            <p>Il presente sito, in caso di guasti al server, manutenzione o altre motivazioni eccezionali, potrebbe non essere disponibile.</p>
            <p>Lo staff si riserva il diritto di sospendere, interamente o in parte i contenuti del sito, senza preavviso.</p>
            </section>
            <section>
            <h3 className={styles.title}>Dati e Sicurezza</h3>
            <p>Ci impegniamo a fornire misure di sicurezza adeguate, in modo da prevenire, per quanto possibile, l'accesso e l'utilizzo non autorizzato dei dati degli Utenti.</p>
            <p>Tuttavia l'Utente deve essere consapevole che non vi e' la certezza che non possano avvenire violazioni dei dati.</p>
            </section>
            </div>
        </div>
    )
}
export default TermsOfUse
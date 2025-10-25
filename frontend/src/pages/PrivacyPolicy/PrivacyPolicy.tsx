import { useEffect } from "react"
import styles from "./PrivacyPolicy.module.css"
import { Link } from "react-router-dom";
const PrivacyPolicy = () => {

    return (
        <div className={styles.page}>
            <h1>Privacy Policy</h1>
            <section id="dati-personali">
            <h3 className={styles.title}>Dati personali</h3>
            <p>Raccogliamo e salviamo i seguenti dati personali:</p>
            <ul>
                <li>Nome</li>
                <li>Email</li>
                <li>Password</li>
            </ul>
            <p>Tali dati sono necessari per fornire il nostro servizio e verranno conservati fintanto che l'account non sara' eliminato.</p>
            <p>Lo staff del presente sito ha il diritto di visionare e eliminare i tuoi dati nel caso lo ritenesse opportuno.</p>
            <p>L'utente puo' richiedere una copia dei propri dati presenti nel nostro sistema.</p>
            <p>I dati salvati nel nostro sistema non verrano condivisi o venduti a nessuna altro soggetto.</p>
            <p>L'unica eccezione vale per il sistema di pagamento Stripe, con il quale condividiamo solamente le informazioni utili al tracciamento del pagamento.</p>
            </section>
            <section>
            <h3 className={styles.title}>Dati di Utilizzo</h3>
            <p>Oltre ai dati personali raccogliamo altri dati utili a fornire una migliore esperienza dell'utente, (ad esempioo il progresso di ciascun corso, l'immagine di profilo etc..)</p>
            <p>Anche di tali dati e' possibile richiedere una copia, e verranno interamente ed definitivamente eliminati nel caso di eleminazione dell'account.</p>
            </section>
            <section>
            <h3 className={styles.title}>Servizi di terze parti</h3>
            <p>Il pagamento viene effettuato tramite servizi di terze parti, Stripe e Paypal.</p>
            <p>Le immagini e i documenti forniti dall'Utente vengono salvate su Cloudinary.</p>
            <p>Per maggiori informazioni riferirsi alle relative privacy policy: </p>
            <div className={styles.links}>
                <div>
                     <a href="https://stripe.com/it/privacy">stripe policy</a>
                </div>
                 <div>
                    <a href="https://www.paypal.com/it/legalhub/paypal/privacy-full">paypal policy</a>
                 </div>
                 <div>
                    <a href="https://cloudinary.com/privacy">cloudinary policy</a>
                 </div>
            </div>
           
            <p>Alcuni contenuti mostrati provengono da altri siti web (ad esempio i video), questi si comportano come se l'Utente avesse visitato direttamente il sito web il cui contenuto e' mostrato.</p>
            </section>
        </div>
    )
}
export default PrivacyPolicy
const translation = {
    translation: {
        common: {
            hi: 'Ciao',
            myAccount: 'Il mio account',
            logout: 'Logout',
            login: 'Login',
            products: 'Prodotti',
            apply: 'Applica',
            optionSelect: 'Seleziona un opzione',
            emailAddress: 'Indirizzo email',
            loading: 'Solo un momento...',
        },
        error: {
            generic: 'Ops, qualcosa è andato storto!',
            orderNotFound: 'Purtroppo non troviamo un ordine con questo riferimento. Se pensate che sia un errore, contattateci!',
            discountNotApplicable: 'Purtroppo lo sconto non è valido.',
            paypalNotWorking: 'Purtroppo Paypal sembra non funzionare al momento. Si prega di contattarci o provare con un altro metodo.',
            addProductToCart: 'Purtroppo non possiamo aggiungere il prodotto al carrello. Si prega di riprovare o di contattarci se il problema persiste.',
        },
        routes: {
            home: 'Home',
            shop: 'Negozio',
            about: 'Chi siamo',
            checkout: 'Checkout',
            account: 'Profilo',
            order: 'Ordine',
            orderReceipt: 'Ricevuta dell\'ordine',
        },
        login: {
            getLink: 'Ricevi il link',
            helper: 'Indica l\'email con cui hai già effettuato un ordine e ti invieremo un link per accedere al tuo account.',
            loggingIn: 'Login in corso...',
            linkConfirmation: 'Controlla la tua posta: se hai già effettuato un ordine con noi, dovresti aver ricevuto il link per continuare col login!',
            linkExpired: 'Purtroppo il link è scaduto, richiedine uno nuovo',
        },
        logout: {
            successful: 'Logout eseguito correttamente.',
            next: 'Torna al negozio.',
        },
        shop: {
            specifics: 'Specifiche',
            shipping: 'Spedizione',
            receipt: 'Fattura',
            assistence: 'Assistenza',
            addToCart: 'Aggiungi al carrello',
            soldOut: 'Sold out',
            suggestedProducts: {
                title: 'Prodotti suggeriti',
                body: 'Potrebbero interessarti anche questi prodotti',
            },
            latestProducts: {
                title: 'Nuovi prodotti',
                body: 'Dai uno sguardo agli ultimi prodotti in vendita',
                more: 'Vedi di più',
            },
            left: 'Ultimo disponibile!',
            left_plural: '{{count}} disponibili',
            inCart: '{{count}} nel carrello',
            shippingDetails: 'Spedizione gratuita in Italia. Generalmente spedito entro le {{hours}} ore.',
            receiptDetails: `
            Emettiamo sempre <u>fattura elettronica</u> a fronte di ogni acquisto.
            <br />
            <i>PRIVATI:</i> se acquistate come privato dovete comunicarci il vostro codice fiscale e indirizzo di residenza.
            <br />
            <i>AZIENDE:</i> in caso di aziende abbiamo bisogno anche del codice univoco e della partita iva.
            `,
            assistenceDetails: `
            Vi informiamo che in caso di guasto dell’utensile potete rivolgervi al centro assistenza più vicino.
            <br />
            In alternativa siamo in grado di fornire il servizio di “pick up and delivery” 
            con il quale vi ripariamo l’utensile in garanzia, al solo costo di spedizione.
            <br />
            Contattateci per maggiori informazioni sulle modalità del servizio.
            `,
        },
        account: {
            title: 'Il mio account',
            history: 'Storico ordini',
            shippingAddress: 'Indirizzo di spedizione',
            customerSince: 'Cliente dal',
            noOrdersYet: 'Non hai ancora effettuato alcun ordine',
            orders: {
                states: {
                    processing: 'In corso',
                    fulfilled: 'Completato',
                    notPaid: 'Non pagato',
                    paid: 'Pagato',
                    pending: 'In lavorazione',
                    refunded: 'Rimborsato',
                },
                columns: {
                    order: 'Ordine',
                    payment: 'Pagamento',
                    fulfillment: 'Stato',
                    total: 'Totale',
                    actions: 'Azioni',
                    viewOrder: 'Vedi ordine',
                },
            },
        },
        hero: {
            title: 'Massi105',
            subtitle: 'Vendiamo utensili per edilizia, giardinaggio e di vario genere',
            cta: 'Vai al negozio',
        },
        cart: {
            title: 'Carrello',
            total: 'Totale',
            continue: 'Continua a comprare',
            checkout: 'Vai al pagamento',
            remove: 'Rimuovi',
            empty: 'Il carrello è vuoto!',
        },
        checkout: {
            customer: {
                title: 'Cliente',
                firstName: 'Nome',
                lastName: 'Cognome',
                phone: 'Telefono',
                emailAddress: 'Indirizzo email',
            },
            shipping: {
                title: 'Indirizzo di spedizione',
                method: 'Metodo di spedizione',
                selectPlaceholder: 'Seleziona il tuo metodo di spedizione',
                fullName: 'Nome e cognome',
                country: 'Paese',
                countryPlaceholder: 'Seleziona un paese',
                city: 'Città',
                street: 'Indirizzo',
                streetPlaceholder: 'Via/piazza e numero civico',
                streetSecondary: 'Indirizzo secondario (opzionale)',
                streetSecondaryPlaceholder: 'Appartamento, piano, ecc..',
                region: 'Provincia',
                regionPlaceholder: 'Seleziona una provincia',
                zipCode: 'Codice postale',
                selectError: 'Seleziona un metodo di spedizione!',
            },
            subscribeToNewsletter: 'Ricevi le nostre novità su nuovi prodotti o offerte via email 🙂',
            orderNotes: 'Note aggiuntive (opzionale)',
            billing: {
                title: 'Indirizzo di fatturazione',
                options: {
                    same: 'Lo stesso dell\'indirizzo di spedizione',
                    different: 'Usa un diverso indirizzo di fatturazione',
                },
            },
            payment: {
                title: 'Metodo di pagamento',
                cta: 'Effettua il pagamento',
                cardNumber: 'Numero di carta',
                cvc: 'CVC (CVV)',
                expireMonth: 'Mese di scadenza',
                expireYear: 'Anno di scadenza',
                testGateway: 'Carta di test',
                manual: 'Bonifico bancario',
                stripe: 'Carta di credito/debito',
                paypal: 'Paypal',
                paypalDetails: 'Una volta confermato, verrai reindirizzato al sito di Paypal per continuare col pagamento.',
                manualDetails: 'Ulteriori dettagli per effettuare il bonifico verranno comunicati privatamente.',
            },
            order: {
                title: 'Il tuo ordine',
                quantity: 'Quantità',
                subtotal: 'Subtotale',
                tax: 'Tasse',
                shipping: 'Spedizione',
                shippingNotSelected: 'Nessuna spedizione selezionata',
                discount: 'Sconto',
                discountNotSelected: 'Nessuno sconto applicato',
                discountSaved: 'Stai risparmiando',
                discountPlaceholder: 'Codice promozionale',
                totalAmount: 'Totale',
            },
            processingOrder: 'Stiamo completando l\'ordine...',
        },
        confirm: {
            thanks: {
                title: 'Grazie per il tuo acquisto!',
                subtitle: 'L\'ordine è stato completato con successo',
            },
            orderReference: 'Ecco il riferimento per il tuo ordine',
            backHome: 'Torna alla home',
            continue: 'Continua a comprare',
            receiptNumber: 'Riferimento ordine',
            printReceipt: 'Stampa ricevuta',
            orderDetails: 'Dettagli dell\'ordine',
            shipsTo: 'Spedizione verso',
            subtotal: 'Subtotale',
            shipping: 'Spedizione',
            orderTotal: 'Totale ordine',
        },
        order: {
            placedOn: 'Ordine del',
            billingAddress: 'Indirizzo di fatturazione',
            shippingAddress: 'Indirizzo di spedizione',
            order: 'Ordine',
            items: 'Oggetti',
            product: 'Prodotto',
            price: 'Prezzo',
            quantity: 'Quantità',
            total: 'Totale',
            subtotal: 'Subtotale',
            shipping: 'Spedizione',
            taxes: 'Tasse',
        },
        footer: {
            warning: 'Vietata la riproduzione anche parziale',
        },
        about: {
            title: 'Chi siamo',
            text: `
            La nostra è una piccola realtà della provincia di Ancona nelle Marche, 
            nata negli anni 60 grazie a Vaccarini Emilio, che aveva intuito che le imprese edili 
            avevano bisogno di un servizio direttamente sui cantieri e a domicilio.
            <br/>
            Negli anni 80 inizia la collaborazione con Makita: sono stati anni difficili, 
            il marchio giapponese non era ancora conosciuto e predominava esclusivamente il marchio tedesco.
            <br/>
            Con il tempo, la tenacia e grazie al mio ingresso in attività, le cose sono cambiate.
            Da anni Vaccarini Massimiliano è rivenditore autorizzato Makita e riusciamo a garantire 
            un buon equilibrio tra qualità, prezzo e servizio su misura, con consigli prevendita 
            ai nostri clienti.
            <br/>
            Al nostro staff interessa che chi acquista da noi sia sempre soddisfatto.
            <br/>
            Non ci basiamo su prezzi fuori luogo o sottocosto. Il nostro obiettivo sono la cura e
            l'assistenza al cliente o utilizzatore professionale, nel periodo pre, durante e post garanzia, 
            con il nostro servizio pick and delivery. Crediamo che essere un buon commerciante 
            non voglia dire svendere, ma attuare un commercio serio ed affidabile.
            `,
            secondTitle: 'Spedizioni e assistenza',
            secondText: `
            
            `,
            contacts: {
                title: 'Contatti',
                text: 'Il nostro telefono è attivo tutti i giorni, tranne i festivi e la domenica.',
                phoneNumber: 'Cellulare',
                whatsappNumber: 'Whatsapp',
                emailAddress: 'Email',
            },
        },
    },
};

export default translation;

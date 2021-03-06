function GlobalStyle() {
    return (
        <style global jsx>{`
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            list-style: none;
            // Barra Rolagem: Firefox 
            scrollbar-width: thin;
            scrollbar-color: #5cbbc1 #34677b;
        }

        // Barra Rolagem: Chrome, Edge e Safari 
        *::-webkit-scrollbar {
            width: 12px;
        }

        *::-webkit-scrollbar-track {
            background: #233138;
            border-radius: 20px;
        }

        *::-webkit-scrollbar-thumb {
            background-color: #1d5b72;
            border-radius: 20px;
            border: 3px solid #233138;
        }
        
        
        body {
            font-family: 'Open Sans', sans-serif;
        }
        /* App fit Height */ 
        html, body, #__next {
            min-height: 100vh;
            display: flex;
            flex: 1;
        }
        #__next {
            flex: 1;
        }
        #__next > * {
            flex: 1;
        }
        /* ./App fit Height */ 

        * #buttonEfeitoApertar :active {
            transform: translateY(2px);
        }

        /* Estilo do SweetAlert */
       
        .swal-modal {
            background-color: #2b3b46;
        }

        .swal-title {
            color: white;
        }  

        .swal-text {
            color: white;
        }  

        .swal-button {
            color: #313D49;
            width: 100px;
            padding: 7px 19px;
            border-radius: 5px;
            background-color: #5cbbc1;
            font-size: 12px;
        }

        .swal-button:hover {
            color: #313D49;
            background-color: black;
        }

    `}</style>
    );
}

export default function MyApp({ Component, pageProps }) {
    console.log('Roda em todas as páginas')

    return (
        <>
            <GlobalStyle />
            <Component {...pageProps} />
        </>
    )
}
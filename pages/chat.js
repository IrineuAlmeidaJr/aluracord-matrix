import { Box, Text, TextField, Icon, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import swal from 'sweetalert';
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router';
import { ButtonSendSticker } from '../src/componentes/ButtonSendSticker'
import { MensagemList } from '../src/componentes/MensagemList'
import { Header } from '../src/componentes/Header'
// import imgBackground from '../src/images/background.jpeg'

// Como fazer AJAX: https://medium.com/@omariosouto/entendendo-como-fazer-ajax-com-a-fetchapi-977ff20da3c6
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzI4NjA1OCwiZXhwIjoxOTU4ODYyMDU4fQ.eAMsoDvguB-_GBpBERnOx0Fa3GVNOUwqOnIXRRdSZr8'
const SUPABASE_URL = 'https://vvgqvqwhqjxpduwapjzq.supabase.co'
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function escutaMensagensEmTempoReal(adicionaMensagem) {
    return supabaseClient
        .from('mensagens')
        // A mensagem vem dentro de 'new', ser quiser
        // ver melhor exibir elemento no cosole, para
        // visualizar o que veio.
        .on('INSERT', (respostaLive) => {
            adicionaMensagem(respostaLive.new)
        })
        .subscribe();
}

export default function ChatPage() {
    const roteamento = useRouter();
    const usuarioLogado = roteamento.query.username

    const [mensagem, setMensagem] = React.useState(''); // *** Importante passar um valor inicial
    const [listaMensagens, setListaMensagens] = React.useState([]);
    const [carregando, setCarregando] = React.useState('0.3');
    const [imgCarregando, setImgCarregando] = React.useState('block')
    const [estado, setEstado] = React.useState(true)

    React.useEffect(() => {
        supabaseClient
            .from('mensagens')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => {
                setListaMensagens(data)
                setInterval(() => {
                    // setListaMensagens(data)
                    setCarregando('1')
                    setImgCarregando('none')
                    setEstado(false)
                }, 1000)
            })
        escutaMensagensEmTempoReal((novaMensagem) => {
            // setListaMensagens([
            //     data[0],
            //     ...listaMensagens // Espalhamento
            // ])
            // Quando quero reusar um valor de referência (objeto/array)
            // Passar uma função pro setState
            /*
                Passamos por função, tiramos o array,
                pois, no React ia só aparecer a última
                mensagem que escrevi ou recebi.
                Ai dentro da função retornamos um array.
                Desta forma ele irá sempre passar o valor
                atual da lista.
            */
            setListaMensagens((valorAtualDaLista) => {
                return [
                    novaMensagem,
                    ...valorAtualDaLista
                ]
            })
        });
    }, []);

    function handleNovaMensagem(novaMensagem) {
        if(novaMensagem.length) {
            const mensagem = {
                // ID gerando no banco de dados (autocomplete) 
                // id: listaMensagens.length + 1,
                de: usuarioLogado,
                texto: novaMensagem
            }
            // Depois é só colocar aqui a Chamada de um backend
            supabaseClient
                .from('mensagens')
                // No isert tem que ser objetos com os mesmos campos
                .insert([mensagem])
                .then(({ data }) => {
                    // setListaMensagens([
                    //     data[0],
                    //     ...listaMensagens // Espalhamento
                    // ])
                    // console.log('Criando mensagem', data)
                })
            setMensagem('')
        } else {
            swal({
                title:'Digite algo!',
                text: 'Mensagem vazia, escreva algo ou envie um sticker...',
                icon: 'info',
            })
        }
    }

    const handleChange = (event) => {
        const valor = event.target.value
        event.preventDefault
        setMensagem(valor)
    }

    return (
        <Box
            styleSheet={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(/images/background.jpeg)`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000'],
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[1200],
                    height: '100vh',
                    width: '100vw',
                    maxWidth: {
                        lg: '95%',
                        md: '95%',
                        sm: '95%',
                        xl: '1100px',
                        xs: '95%'
                    },
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header
                    usuarioLogado = {usuarioLogado}
                />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        width: '100%',
                        backgroundColor: appConfig.theme.colors.neutrals[500],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    
                    <MensagemList
                        mensagens={listaMensagens} setListaMensagens={setListaMensagens}
                        img={imgCarregando} setImg={setImgCarregando}
                        carregando={carregando} setCarregando={setCarregando}
                        estado={estado} setEstado={estado}
                        usuarioLogado = {usuarioLogado}
                        supabaseClient = {supabaseClient}
                    />
                    {/* {listaMensagens.map((msgAtual) => 
                        <li key={msgAtual.id}> 
                            {msgAtual.de}: {msgAtual.texto}
                        </li> 
                    )} */}

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            tag='input'
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMensagem(valor)
                            }}
                            onKeyPress={ handleChange }
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        {/* CalBack */}
                        <ButtonSendSticker
                            // Recebe o sticker do componente ButtonSendSticker.js
                            onsStickerClick={(sticker) => {
                                // console.log('[USANDO UM COMPONENTE] Salvar esse sticker no banco', sticker)
                                handleNovaMensagem(`:sticker:${sticker}`)
                            }}
                        />
                        <Button
                            id='buttonEfeitoApertar'
                            label="⏎"
                            onClick={() => handleNovaMensagem(mensagem)}
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["500"],
                                mainColor: appConfig.theme.colors.primary[500],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.primary[600],
                            }}
                            styleSheet={{
                                marginRight: '12px',
                                marginBottom: '7px',
                                borderRadius: '5px',
                                padding: '13px 13px',
                                "hover": {
                                    transition: '500ms',
                                    "color": appConfig.theme.colors.neutrals["000"]
                                },
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
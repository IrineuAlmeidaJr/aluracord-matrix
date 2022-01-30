import { Box, Text, TextField, Icon, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import swal from 'sweetalert';
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router';
import { ButtonSendSticker } from '../src/componentes/ButtonSendSticker'
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
    }

    return (
        <Box
            styleSheet={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://github.com/IrineuAlmeidaJr/aluracord-matrix/blob/main/imagens/background.jpeg?raw=true)`,
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
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMensagem(valor)
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleNovaMensagem(mensagem);
                                }
                            }}
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

function Header(props) {
    return (
        <>
            <Box 
                styleSheet={{
                    width: '100%',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    // justifyContent: 'space-between'
                }} 
            >
                <Image
                   styleSheet={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    marginRight: '8px',
                }}
                src={`https://github.com/${props.usuarioLogado}.png`}
                />
                <Text 
                    variant='heading4'
                    styleSheet={{
                        'flex-grow': '1',
                        fontSize: '1em'
                    }}
                >
                    Bem-vindo {props.usuarioLogado} 
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    size='lg'
                    href="/"
                    buttonColors={{
                        contrastColor: appConfig.theme.colors.neutrals["500"],
                        mainColor: appConfig.theme.colors.primary[500],
                        mainColorLight: appConfig.theme.colors.primary[600]
                    }}
                    styleSheet={{
                        hover: {
                            transition: '500ms',
                            "color": appConfig.theme.colors.neutrals["000"]
                        },
                    }}
                />
            </Box>
        </>
    )
}

function MensagemList(props) {

    async function deleteMensagemBanco(idExcluir) {
        await supabaseClient
            .from('mensagens')
            .delete()
            .eq('id', idExcluir);
    }

    async function retornaMensagemBanco(idExcluir, nomeUsuario) {
        await supabaseClient
            .from('mensagens')
            .select('de')
            .eq('id', idExcluir)  
            .then(({ data }) => {
                // console.log(data)
                if(data.length > 0) {
                    if(data[0].de === nomeUsuario) {
                        deleteMensagemBanco(idExcluir)
                        const novaListaMensagem = props.mensagens.filter((msg) => {
                            return msg.id !== idExcluir
                        })
                        props.setListaMensagens(novaListaMensagem)
                    } else {
                        swal({
                            title:'Não pode deletar!',
                            text: 'Essa mensagem não é sua...',
                            icon: 'error',
                            button: false
                        })
                    }
                } 
            })          
    }

    function removerMensagem(idExcluir, nomeUsuario) {
        retornaMensagemBanco(idExcluir, nomeUsuario)
    }

    return (
        <Box
            tag="ul"
            styleSheet={{
                'overflow-y': 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            <Image
                src='https://github.com/IrineuAlmeidaJr/aluracord-matrix/blob/main/imagens/wait.gif?raw=true'
                styleSheet={{
                    display: props.img,
                    position: 'relative',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: '-20vh'
                }}
            />
            {props.mensagens.map((mensagem) => {
                const date = new Date(mensagem.created_at)
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            marginRight: '12px',
                            opacity: props.carregando,
                            'word-wrap': 'break-word',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                    // hover: {
                                    //     width: '35px',
                                    //     height:'35px',
                                    // }

                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Text
                                tag="a"
                                href={`https://github.com/${mensagem.de}`}
                                styleSheet={{
                                    // fontSize: '1em',
                                    textDecoration: 'none',
                                    color: appConfig.theme.colors.neutrals["000"],
                                    'font-weight': 'bold'
                                }}
                            >
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '11px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(date.toLocaleDateString())}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '11px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {date.getHours().toString().padStart(2, '0')}:{date.getMinutes().toString().padStart(2, '0')}
                            </Text>
                        </Box>
                        <Box
                            styleSheet={{
                                marginRight: '80px',
                                color: appConfig.theme.colors.neutrals[300],

                            }}
                        >
                            <Text
                                styleSheet={{
                                    fontSize: '1em',
                                    marginRight: '25%',
                                    color: appConfig.theme.colors.neutrals[300],

                                }}
                            >
                                {mensagem.texto.startsWith(':sticker:')
                                    ? (
                                        <Image
                                            src={mensagem.texto.replace(':sticker:', '')}
                                            styleSheet={{
                                                maxWidth: {
                                                    md: '400px',
                                                    sm: '300px',
                                                    xs: '238px'
                                                },
                                                marginLeft: {
                                                    sm: '25px',
                                                    xs: '0px'
                                                }
                                            }}
                                        />
                                    )
                                    : (
                                        mensagem.texto
                                    )}

                            </Text>
                        </Box>

                        <Button
                            key={mensagem.id}
                            disabled={props.estado}
                            iconName="FaTrashAlt"
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["500"],
                                mainColor: appConfig.theme.colors.primary[500],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.primary[600],
                            }}
                            styleSheet={{
                                position: "relative",
                                top: "-15px", // *** Ver uma solução melhor
                                margin: "0 10px",
                                float: "right",
                                "hover": {
                                    transition: '500ms',
                                    "color": appConfig.theme.colors.neutrals["000"]
                                },
                            }}
                            onClick={(e) => {
                                // console.log('Clicou Excluir', mensagem.id)
                                removerMensagem(mensagem.id, props.usuarioLogado)
                            }}
                        />
                    </Text>
                )
            })}

        </Box>
    )
}
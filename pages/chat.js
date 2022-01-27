import { Box, Text, TextField, Icon, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';

export default function ChatPage() {
    const [mensagem, setMensagem] = React.useState(''); // *** Importante passar um valor inicial
    const [listaMensagens, setListaMensagens] = React.useState([]);

    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            id: listaMensagens.length + 1,
            de: 'irineualmeidajr',
            texto: novaMensagem
        }
        // Depois é só colocar aqui a Chamada de um backend
        setListaMensagens([
            mensagem,
            ...listaMensagens // Espalhamento
        ])
        setMensagem('')
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
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
                    height: '100%',
                    width: '100%',
                    maxWidth: '1300px',
                    maxHeight: '95vh',
                    padding: '32px',
                    margin: '16px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[500],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MensagemList mensagens={listaMensagens} setListaMensagens = {setListaMensagens} />
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
                                console.log(event)
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
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MensagemList(props) {
    function removerMensagem (idExcluir) {
        
        const novaListaMensagem = props.mensagens.filter((msg) => {
            return msg.id !== idExcluir
        })
        props.setListaMensagens(novaListaMensagem)
        
        
    }
    
    return (
        <Box
            tag="ul"
            styleSheet={{
                // overflowY: 'scroll',
                'overflow-y': 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
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
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        {mensagem.texto}
                                
                        <Button
                            key={mensagem.id}
                            iconName="FaTrashAlt"
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["500"],
                                mainColor: appConfig.theme.colors.primary[500],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.primary[600],
                            }}
                            styleSheet={{
                                position: "relative",
                                top: "-17px",
                                margin: "0 10px",
                                float: "right",
                                "hover": {                                    
                                    "color": appConfig.theme.colors.neutrals["000"]
                                },
                            }}
                            onClick={ (e) => {
                                
                                console.log('Clicou Excluir', mensagem.id)
                                removerMensagem(mensagem.id)
                            }}
                        />

                    </Text>
                )
            })}
        </Box>
    )
}
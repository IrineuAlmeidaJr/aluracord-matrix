import { Box, Button, Text, TextField, Image } from '@skynexui/components'
import React from 'react';
import appConfig from '../config.json'
import { useRouter } from 'next/router'

function Titulo(props) {
    const Tag = props.tag || 'h1';
    /*
        Se não tiver nenhuma tag pega o h1.
    */
    return (
        /* 
            Passar a tag vazia <> </>, pois,
            precisa estar envolvido por alguma
            tag, melhor do que criar um div
            apenas para isso, serve para
            agrupar os elementos.
        */
        <>
            <Tag>{props.children}</Tag>
            <style jsx>{`
                    ${Tag}{
                        color: ${appConfig.theme.colors.neutrals['000']};
                        font-size: 24px;
                        font-weight: 600;
                    }                
            `}</style>
        </>
    );
}

export default function PaginaInicial() {
    // const username = 'IrineuAlmeidaJr';
    const [username, setUsername] = React.useState('IrineuAlmeidaJr')
    const roteamento = useRouter();

    console.log(roteamento)

    return (
        <>
            <Box
                styleSheet={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: appConfig.theme.colors.primary[500],
                    backgroundImage: 'url(https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260)',
                    backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                }}
            >
                <Box
                    styleSheet={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: {
                            xs: 'column',
                            sm: 'row',
                        },
                        width: '100%', maxWidth: '700px',
                        borderRadius: '5px', padding: '32px', margin: '16px',
                        boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                        backgroundColor: appConfig.theme.colors.neutrals[700],
            
                    }}
                >
                    {/* Formulário */}
                    <Box
                        as="form"
                        onSubmit={ function (infosDoEvento) {
                            // Abaixo vou impedir o comportamento padrão
                            // de recarregar a página.
                            infosDoEvento.preventDefault() 
                            console.log('Alguem submeteu o form')
                            roteamento.push('/chat')
                            // Forma de Chamar a Página (no caso chat)
                            // window.location.href = '/chat'

                        }}
                        styleSheet={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            width: { xs: '100%', sm: '50%' }, textAlign: 'center', marginBottom: '32px',
                        }}
                    >
                        <Titulo tag="h2">Boas vindas de volta!</Titulo>
                        <Text variant="body3" styleSheet={{ marginBottom: '32px', color: appConfig.theme.colors.neutrals[300] }}>
                            {appConfig.name}
                        </Text>

                        <TextField
                            value={username}
                            onChange={function handler(event) {
                                console.log('Usuario digitou', event.target.value)
                                // O valor está dentro de event
                                const valor = event.target.value
                                // Troca o valor da variável abaixo como set
                                setUsername(valor)
                            }}
                            fullWidth
                            textFieldColors={{
                                neutral: {
                                    textColor: appConfig.theme.colors.neutrals[200],
                                    mainColor: appConfig.theme.colors.neutrals[900],
                                    mainColorHighlight: appConfig.theme.colors.primary[500],
                                    backgroundColor: appConfig.theme.colors.neutrals[800],
                                },
                            }}
                        />
                        <Button
                            type='submit'
                            label='Entrar'
                            fullWidth
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["500"],
                                mainColor: appConfig.theme.colors.primary[500],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.primary[600],
                            }}
                            styleSheet={{
                                "hover": {
                                    "color": appConfig.theme.colors.neutrals["000"]
                                },
                            }}
                        />
                    </Box>
                    {/* Formulário */}


                    {/* Photo Area */}
                    <Box
                        styleSheet={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            maxWidth: '200px',
                            padding: '16px',
                            backgroundColor: appConfig.theme.colors.neutrals[800],
                            border: '1px solid',
                            borderColor: appConfig.theme.colors.neutrals[999],
                            borderRadius: '10px',
                            flex: 1,
                            minHeight: '240px',
                        }}
                    >
                        <Image
                            styleSheet={{
                                borderRadius: '50%',
                                marginBottom: '16px',
                            }}
                            src={`https://github.com/${username}.png`}
                        />
                        <Text
                            variant="body4"
                            styleSheet={{
                                color: appConfig.theme.colors.neutrals[200],
                                backgroundColor: appConfig.theme.colors.neutrals[900],
                                padding: '3px 10px',
                                borderRadius: '1000px'
                            }}
                        >
                            {username}
                        </Text>
                    </Box>
                    {/* Photo Area */}
                </Box>
            </Box>
        </>
    );
}
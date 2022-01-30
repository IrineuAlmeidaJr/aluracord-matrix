import React from 'react';
import { Box, Button, Text, Image } from '@skynexui/components';
import swal from 'sweetalert';
import appConfig from '../../config.json';

export function MensagemList(props) {
    const supabaseClient = props.supabaseClient

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

    async function ataulizar(idMesagem, valorLike) {
        await supabaseClient
            .from('mensagens')
            .update({ like: valorLike })
            .match({ id: idMesagem })
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
                            backgroundColor: props.usuarioLogado === mensagem.de ? 
                                appConfig.theme.colors.neutrals[600] : 'none' ,
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
                            iconName='FaHeart'
                            label= {mensagem.like > 99 ? '> 99' : '' + mensagem.like } // Se maior de 99 mudar exibir >99
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["500"],
                                mainColor: appConfig.theme.colors.primary[500],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.primary[600],
                            }}
                            styleSheet={{
                                width: '82px',
                                marginTop: '10px',
                                "hover": {
                                    transition: '500ms',
                                    "color": appConfig.theme.colors.neutrals["000"]
                                },
                            }}
                            onClick={(e) => {
                                console.log('Clicou Like', ++mensagem.like)
                                const novaMsg = props.mensagens.map(msgTemp => {
                                    return msgTemp
                                })
                                props.setListaMensagens(novaMsg) 
                                ataulizar(mensagem.id, mensagem.like) 
                            }}                          
                        />
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
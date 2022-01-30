import React from 'react';
import { Box, Button, Text, Image } from '@skynexui/components';
import appConfig from '../../config.json';

export function Header(props) {
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
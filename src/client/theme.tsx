import {PaletteType, Theme} from "@material-ui/core";
import {createMuiTheme, darken} from "@material-ui/core";
import {blue, pink} from '@material-ui/core/colors';
import createSpacing from "@material-ui/core/styles/createSpacing";
import {TypeBackground, Palette} from "@material-ui/core/styles/createPalette";

const paletteType: PaletteType = 'light';
const spacing = createSpacing(8);

type TMyMuiBackground = TypeBackground & {
    level1: string
    level2: string
}

type TMyMuiPalette = Palette & {
    background: TMyMuiBackground
}

export type TTheme = Theme & {
    palette: TMyMuiPalette,
    nprogress: {
        color: string
    }
}

const defaultMuiTheme: Theme = createMuiTheme({
    direction: 'ltr',
    palette: {
        primary: {
            main: paletteType === 'light' ? blue[700] : blue[200],
        },
        secondary: {
            main: paletteType === 'light' ? darken(pink.A400, 0.1) : pink[200],
        },
        type: paletteType,
        background: {
            default: paletteType === 'light' ? '#fff' : '#121212',
        }
    },
    spacing
});

export const theme: TTheme = {
    ...defaultMuiTheme,
    nprogress: {
        color: paletteType === 'light' ? '#000' : '#fff',
    },
    palette: {
        ...defaultMuiTheme.palette,
        background: {
            ...defaultMuiTheme.palette.background,
            level1: paletteType === 'light' ? '#fff' : defaultMuiTheme.palette.grey[900],
            level2: paletteType === 'light' ? defaultMuiTheme.palette.grey[100] : '#333'
        }
    }
};


import {createMuiTheme} from '@material-ui/core'
import { blue } from '@material-ui/core/colors';

import { Link } from 'react-router-dom';
const theme = createMuiTheme({
    palette: {
        type: "light",
        primary: {
            main: '#333333'
        },
        secondary: {
            main: blue[500]
        }
    }
});
export default theme;
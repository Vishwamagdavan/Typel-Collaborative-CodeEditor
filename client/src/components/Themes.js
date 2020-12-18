import {createMuiTheme} from '@material-ui/core'
import { blue } from '@material-ui/core/colors';

const theme = createMuiTheme({
    palette: {
        type: "dark",
        primary: {
            main: '#333333'
        },
        secondary: {
            main: blue[500]
        }
    }
});
export default theme;
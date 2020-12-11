import { Grid, AppBar, Toolbar, Typography, createMuiTheme, ThemeProvider, Paper, makeStyles,Button,IconButton } from "@material-ui/core";
import { Link } from 'react-router-dom';


const useStyles = makeStyles({
    
    title: {
        padding: 10
    }
})

function Navbar() {
    const classes = useStyles();
    return (
        <AppBar position="static">
            <Toolbar>
                <Link to={"/"} style={{ textDecoration: 'none',color:'#fff' }}>
                <Typography variant="h5" className={classes.title}>
                    Typel.io
                    <Typography variant="body2">Create Room - Invite - Code Together</Typography>
                </Typography>
                </Link>
            </Toolbar>
        </AppBar>
    )
}
export default Navbar;

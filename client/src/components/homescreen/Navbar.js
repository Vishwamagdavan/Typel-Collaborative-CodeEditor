import { AppBar, Toolbar, Typography, makeStyles, Button } from "@material-ui/core";
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
      },
    title: {
        padding: 10,
    },
    roomDetails:{
        marginLeft:1300
    }
})

function Navbar({ room, name }) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
        <AppBar position="static">
            <Toolbar>
                <Link to={"/"} style={{ textDecoration: 'none', color: '#fff' }}>
                    <Typography variant="h5" className={classes.title}>
                        Typel.io
                    <Typography variant="body2">Create Room - Invite - Code Together</Typography>
                    </Typography>
                </Link>
                <div className={classes.roomDetails}>

                    <Typography>
                        <strong>Room:</strong>
                        &nbsp;
                         {room}
                         &emsp;
                         <strong>Name:</strong>
                         {name}
                        &nbsp;
                    </Typography>
                    <Link to={`/`} style={{ textDecoration: 'none' }}>
                        <Button color="secondary" variant="outlined">Leave Room</Button>
                    </Link>
                </div>
            </Toolbar>
        </AppBar>
        </div>
    )
}
export default Navbar;

import { React, useState, useEffect } from "react";
import { ThemeProvider, Paper, makeStyles, Grid, Typography, Box } from "@material-ui/core";
import queryString from 'query-string';
import { ControlledEditor } from "@monaco-editor/react";
import { io } from 'socket.io-client';
import theme from './Themes';
import Navbar from "./homescreen/Navbar";

let socket;

const useStyles = makeStyles({
    editor__papper: {
        marginTop: 8
    }
})
function Mainscreen({location}) {
    const classes = useStyles();
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [code, setCode] = useState('//Write your Code');
    const [codeupdate, setCodeupdate] = useState('')
    const ENDPOINT = 'localhost:5000';


    const options = {
        fontSize: 20
    }
    function onchangeHandler(ev, event) {
        setCodeupdate(event);
    }
    // Socket for Joining Room

    useEffect(()=>{
        const {name,room}=queryString.parse(location.search);
        setName(name);
        setRoom(room);
        socket=io(ENDPOINT,{ transport : ['websocket'] });
        socket.emit('join',{name,room});

        return ()=>{
            socket.disconnect(true);
        }
    },[ENDPOINT,location.search]);


    // Send to Socket 
    useEffect(() => {
        
        socket = io(ENDPOINT, {
            transports: ['websocket']
        });

        socket.emit('code-change', codeupdate);
    }, [ENDPOINT, codeupdate])



    // Recive from the socket
    useEffect(() => {
        socket.on('code-update', (data) => {
            setCode(data);
            console.log('CLIENT ' + data);
        })
        return () => {
            socket.disconnect(true);
        }
    }, []);
    return (
        <ThemeProvider theme={theme}>
            <Paper style={{ height: "100vh" }} >
                <Navbar />
                <Paper className={classes.editor__papper}>

                    <Grid container justify="flex-start">
                        <Grid>
                            <ControlledEditor
                                width="80vh"
                                height="90vh"
                                language="cpp"
                                theme="dark"
                                value={code}
                                options={options}
                                onChange={onchangeHandler}
                            />
                        </Grid>
                        <Grid>
                            <ControlledEditor
                                width="80vh"
                                height="90vh"
                                language="cpp"
                                theme="dark"
                                options={options}
                            />
                        </Grid>
                        <Grid>
                            <Box>
                                <Typography variant="h4">Room:{room}</Typography>
                                <Typography variant="h4">Your Name:{name}</Typography>
                            </Box>
                        </Grid>
                    </Grid>

                </Paper>

            </Paper>

        </ThemeProvider>
    )
};
export default Mainscreen;
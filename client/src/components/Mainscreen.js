import { React, useState, useEffect } from "react";
import { ThemeProvider, Paper, makeStyles, Grid, Typography, Box} from "@material-ui/core";
import queryString from 'query-string';
import { ControlledEditor } from "@monaco-editor/react";
import { io } from 'socket.io-client';
import theme from './Themes';
import Navbar from "./homescreen/Navbar";
let socket;

const useStyles = makeStyles({
    editor__papper: {
        marginTop: 8
    },
    

})
function Mainscreen({ location }) {
    const classes = useStyles();
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState('');
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

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);
        socket = io(ENDPOINT);
        setRoom(room);
        setName(name)
    
        socket.emit('join', { name, room }, (error) => {
          if(error) {
            alert(error);
          }
        });
      }, [ENDPOINT, location.search]);

    // chatMessages
    useEffect(() => {
        socket.on('message', message => {
          setMessages(messages => [ ...messages, message ]);
        });
    }, []);

    // Send to Socket 
    useEffect(() => {
        socket.emit('code-change', codeupdate);
    }, [codeupdate])



    // Recive from the socket
    useEffect(() => {
        socket.on('code-update', (data) => {
            setCode(data);
            console.log('CLIENT ' + data);
        })
    }, []);

    const sendMessage=(e)=>{
        e.preventDefault();
        if(message){
            socket.emit('chatMessage',message,()=>setMessage(''));
        }
    }
    console.log(message,messages);
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
                                width="70vh"
                                height="90vh"
                                language="cpp"
                                theme="dark"
                                options={options}
                            />
                        </Grid>
                        <Grid>
                            <Box>
                                <Typography variant="p">Room:{room}</Typography><br/>
                                <Typography variant="p">Your Name:{name}</Typography>
                                <form className={classes.form}>
                                    <input 
                                    value={message}
                                    onChange={(e)=>setMessage(e.target.value)}
                                    onKeyPress={e=>e.key==='Enter'?sendMessage(e):null}/>
                                </form>
                            </Box>
                        </Grid>
                    </Grid>

                </Paper>

            </Paper>

        </ThemeProvider>
    )
};
export default Mainscreen;
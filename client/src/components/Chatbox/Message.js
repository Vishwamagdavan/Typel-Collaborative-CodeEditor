import { Typography} from "@material-ui/core";
const Message=({name,message:{user,text}})=>{
    let sentByCurrentUser=false;
    const trimmedname=name.trim().toLowerCase();
    if(name===trimmedname){
        sentByCurrentUser=true;
    }
    return(
        <div>
            <p><strong>{user}</strong>:{text}</p>
        </div>
    )
}
export default Message;

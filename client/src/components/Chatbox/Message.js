import './Message.css'
const Message=({name,message:{user,text}})=>{
    return(
        <div className="message">
            <p className="message__text"><strong>{user}</strong>:{text}</p>
        </div>
    )
}
export default Message;

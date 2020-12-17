import './Artboard.css';
import  Board  from "../Board/Board";
function Artboard({room,name}){
    return(
        <div className="container">
            <div className="container__colorpicker">
                <input type="color"/>
            </div>
            <div className="container__board">
                <Board room={room} name={name} ></Board>
            </div>
        </div>
    )
}

export default Artboard;
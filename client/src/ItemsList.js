import React from 'react';
import './ItemsList.css';
import Trash from './trash.svg';
import Check from './check.svg';


function ItemsList(props){
    const items = props.items;
    if(items === null){
        console.log("its empty");
        return;
    }
    //contains a list of all the items
    const itemsList = items.map(i =>{

        let p = i.pos;
        let d = i.desc;

        const posUpdate = (e) =>{
            p = e.target.value;
            props.updatedPos(i.date, e.target.value, i.desc, false);
            document.getElementById(i.date).style.opacity = "1";

        }

        const descUpdate = (e)=>{
            d = e.target.value;
            props.updatedPos(i.date, i.pos, e.target.value, false);
            document.getElementById(i.date).style.opacity = "1";
        }

        const updateaAll= () =>{
            props.updatedPos(i.date,p, d, true);
            document.getElementById(i.date).style.opacity = "0.2";

        }


        return <div className="itemContainer">
            <div className="holder">
                <p className="pp"> Position:</p>
                <input className="posi" type="text" key={props.date} onChange={async(e) => posUpdate(e)} value={p} ></input>
            </div>
            <div className="holder">
                <p className="dp"> description:</p>
                <textarea type="text" className="desci" key={props.date} onChange={async(e) => descUpdate(e)} value={d} ></textarea>
            </div>
            <img className="trash" src={Trash} alt="trash" width="40" height="40" onClick={async() => props.deleteItem(i.pos)} />
            <img id={i.date} className="check" src={Check} alt="check" width="40" height="40" onClick={async() => updateaAll()} />

           

        </div>
    });

    
    return(itemsList);
}

export default ItemsList;


import React from 'react';
import './App.css';
import ItemsList from './ItemsList';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      items:[],
      item:{
        pos:'',
        desc:'',
        date:''
      }
    }

    this.updateItems = this.updateItems.bind(this);
    this.addpos = this.addpos.bind(this);
    this.updatedPos = this.updatedPos.bind(this);
    this.deleteItem = this.deleteItem.bind(this);


  }
  
  //send a POST  request to the server 
  //if status = success then continue
  async addpos(e) {
    //sotp the page from refreching everything we click a button
    e.preventDefault();

    const pos = document.getElementById("posid").value;
    const desc = document.getElementById("desc").value;

    if( pos ==="" || desc ===""){
      console.log("empty string!!");
      return;
    }

    for(const i of this.state.items){
      if(i.pos === pos){
        console.log("invalid data");
        return;

      }
    }

    const data = {
      pos: pos,
      desc: desc,
      date: Date.now()
    }

    const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)

    };
    const url = "http://localhost:9000/api/mine";
    const request = await fetch(url, options);
    const response = await request.json();
    
    //update the items list from server
    if(response.status ==="success"){
      this.updateItems();
    }

    document.getElementById("posid").value = "";
    document.getElementById("desc").value = "";

  }

  async updateItems(){
    const url = "http://localhost:9000/api/mine";
    const resp = await fetch( url, {method:'GET'});

    const result = await resp.json();
    this.setState({
      items: result
    });


  }

  
  async updatedPos(date, pos, desc, ver){

    const data = {
      date:date,
      pos: pos,
      desc: desc
    }

    // TODO: check what the used modified "pos" or "desc"
    if(! ver) {
      // just update the state.items without a put request.
      const item = this.state.items.find(e => e.date === date);
      const p = this.state.items.indexOf(item);
      this.state.items[p].pos = pos;
      this.state.items[p].desc = desc;
      this.setState({items:this.state.items});


      return;
    }

    const options = {
      method: 'put',
      headers: {
          'Content-Type': 'application/json'
        },
      body: JSON.stringify(data)

    };
    const url = "http://localhost:9000/api/mine";
    const request = await fetch(url, options);
    const response = await request.json();
    

    //update the items list from server
    if(response.status ==="success"){
      this.updateItems();
    }

  }


  //remove item from db and reload state.items
  async deleteItem(pos){
    //check if the pos exist in the state.items
    let exist = false;
    let data = null;


    const holder = this.state.items;
    for(const i of holder){
      if(i.pos === pos){
        exist = true;
        data = i;
        break;
      }
    }

    if(!exist){
      return;
    }
    const options = {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)

    };

    const url = "http://localhost:9000/api/mine";
    const request = await fetch(url, options);
    const resp = await request.json();

    if(resp.status === "deleted"){
      this.updateItems();
    }

  }

    //this will be called just after the constructor is created
    componentDidMount(){
      this.updateItems();
    }
  

  render(){
    return(
      <div className="container">
        <form id="add-form" onSubmit={this.addpos}>
          <div id="header">
            <input id="posid" placeholder="enter the position"></input>
            <button id="sub" type="submit">Add</button>
          </div>
          <textarea id="desc" placeholder="description"></textarea>
        </form>

        <ItemsList items={this.state.items}
          updatedPos={this.updatedPos}
          deleteItem={this.deleteItem}
        ></ItemsList>

      </div>

    );
  }
}


export default App;

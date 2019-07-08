import React from 'react';
import logo from './logo.svg';
import D3Component from './D3Component'
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { csvData: "", data: "", config: "" }
  }

  componentDidMount() {
    fetch("http://localhost:8000/")
      .then(res => res.json())
      .then(res => this.setState({ csvData: res }))
  }

  onChangeHandler = event => {
    var reader = new FileReader();
    reader.readAsText(event.target.files[0]);
    reader.onload = event => {
      this.setState({
        config: JSON.parse(event.target.result)
      })
    };
  }

  sendConfig = async () => {
    const { config } = this.state;
    if (!config) return;

    const response = await fetch('http://localhost:8000/config', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(config)
    });

    const content = await response.json();



    console.log(content);
    this.setState({
      data: await this.makeItTree(content.response)
    }, () => { console.log(this.state) });
  }

  makeItTree = arr => {
      console.log(arr);  
      let tree = [], mappedArr = {}, arrElem, mappedElem;

      for (var i = 0, len = arr.length; i < len; i++) {
        arrElem = arr[i];
        mappedArr[arrElem.children_circle] = arrElem; 
        mappedArr[arrElem.children_circle]['children'] = [];                
      }

      console.log(mappedArr);

      for (var children_circle in mappedArr) {
        if (mappedArr.hasOwnProperty(children_circle)) {
          mappedElem = mappedArr[children_circle];          
          if (mappedElem.parent_circle && mappedElem.parent_circle !== mappedElem.children_circle) {
            mappedArr[mappedElem['parent_circle']]['children'].push(mappedElem);
          }          
          else {
            tree.push(mappedElem);
          }
        }
      }
      return tree;
    }

  render() {
   const {data} = this.state;

   let root = {
    children_circle: "Root",
    children_size: 25000,    
    children: data
   }

    return (
      <div className="App">
        <header className="App-header">
          <div>
            <input type="file" style={{padding: 20,fontSize: 16}} name="file" onChange={this.onChangeHandler} />
            <button style={{width: 100, display: "inline-block", fontSize: 13}} onClick={this.sendConfig}>Upload</button>
          </div>          
          <D3Component data={root} width={932} height={932} svgId={"svg"} canvasId={"plot"}/>
        </header>
      </div>
    );
  }
}

export default App;

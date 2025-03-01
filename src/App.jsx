import './App.css'
import { useState } from 'react'; 

export default function App() {
  const [userMoney, setUserMoney] = useState(100);
  const [userMoneyPerYear, setMoneyPerYear] = useState(10);
  const [year, setYear] = useState(2000); 
  const [powerLoad, setPowerLoad] = useState(0);
  const [fossilFuelLoad, setFuelLoad] = useState(0);
  const [cleanEnergyLoad, setCleanEnergyLoad] = useState(0);
  const [fossilFuelReserves, setFossilFuelReserves] = useState(0);
  const [population, setPopulation] = useState(300000000);
  const [atWar, setAtWar] = useState(false);

  return (
    <div>
      <div className='header'>
        <p className='year'>Year: {year}</p>
        <button className='move-on' onClick={() => setYear(year + 1)}>Move on!</button>
      </div>
      <div className='body'><p>Body</p></div>
      <div className='footer'>
        <div className='footer-box'><p>Footer box 1</p></div>
        <div className='footer-box'><p>Footer box 1</p></div>
      </div>
    </div>
  )
}

// <>
    //   <div>
    //     <a href="https://vite.dev" target="_blank">
    //       <img src={viteLogo} className="logo" alt="Vite logo" />
    //     </a>
    //     <a href="https://react.dev" target="_blank">
    //       <img src={reactLogo} className="logo react" alt="React logo" />
    //     </a>
    //   </div>
    //   <h1>Vite + React</h1>
    //   <div className="card">
    //     <button onClick={() => setCount((count) => count + 1)}>
    //       count is {count}
    //     </button>
    //     <p>
    //       Edit <code>src/App.jsx</code> and save to test HMR
    //     </p>
    //   </div>
    //   <p className="read-the-docs">
    //     Click on the Vite and React logos to learn more
    //   </p>
    // </>
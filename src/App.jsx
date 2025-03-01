import './App.css'
import { useState, useEffect } from 'react'; 
import KurtTest from "./kurtTest.jsx";

export default function App() {
  // WHAT WE'RE TRACKING:
  // MONEY
  // FOSSIL FUELS 
  // ENERGY DEMAND MET
  
  const [money, setMoney] = useState(10000);
  const [userMoneyPerYear, setMoneyPerYear] = useState(10);
  const [year, setYear] = useState(2000); 
  const [powerDemand, setPowerDemand] = useState(132);
  const [fossilFuelLoad, setFuelLoad] = useState(0);
  const [cleanEnergyLoad, setCleanEnergyLoad] = useState(0);
  const [fossilFuelReserves, setFossilFuelReserves] = useState(100);
  const [population, setPopulation] = useState(330);
  const [atWar, setAtWar] = useState(false);
  const [totalEmissions, setTotalEmissions] = useState(0);

  const [facilities, setFacilities] = useState({
    coalPlant: { 
      count: 0, 
      cost: 1000,        
      sellPrice: 800,
      multiplier: 1, 
      power: 6,      
      fossilUse: 1,
      emissions: 1
    },
    oilPlant: { 
      count: 0, 
      cost: 500, 
      sellPrice: 400, 
      multiplier: 1, 
      power: 5,
      fossilUse: 0.8,
      emissions: 0.8
    },
    nuclearPlant: { 
      count: 0, 
      cost: 6000,
      sellPrice: 5000,
      multiplier: 1, 
      power: 10,
      emissions: 0
    }, 
    solarFarm: { 
      count: 0, 
      cost: 50,
      sellPrice: 40,
      multiplier: 1, 
      power: 0.5,
      emissions: 0
    },
    windFarm: { 
      count: 0, 
      cost: 150,
      sellPrice: 120,
      multiplier: 1, 
      power: 1,
      emissions: 0
    },
  });

  useEffect(() => {
    const fossilLoad = 
      facilities.coalPlant.count * facilities.coalPlant.power +
      facilities.oilPlant.count * facilities.oilPlant.power;
    setFuelLoad(fossilLoad);
      
    const cleanLoad = 
      (facilities.nuclearPlant.count * facilities.nuclearPlant.power) +
      (facilities.solarFarm.count * facilities.solarFarm.power) +
      (facilities.windFarm.count * facilities.windFarm.power);
    setCleanEnergyLoad(cleanLoad);

    const demand = population * 0.4;
    setPowerDemand(demand);

    const totalFossilConsumption = 
      (facilities.coalPlant.count * facilities.coalPlant.fossilUse) +
      (facilities.oilPlant.count * facilities.oilPlant.fossilUse);
    
    const maxReserves = 100;

    const remainingReserves = Math.max(0, maxReserves - totalFossilConsumption);
    setFossilFuelReserves(remainingReserves);
  }, [facilities, population]);

  function yearlyUpdates() {
    const emissions =
      (facilities.coalPlant.count * facilities.coalPlant.emissions) +
      (facilities.oilPlant.count * facilities.oilPlant.emissions);

    setTotalEmissions(totalEmissions + emissions);
    setMoney(money + userMoneyPerYear);
    setYear(year + 1);
  }

  function buyFacility(type) {
    setFacilities(prev => {
      const facility = prev[type];
      if (money >= facility.cost * facility.multiplier) {
        const updatedMoney = money - facility.cost * facility.multiplier;
        setMoney(updatedMoney);
        return {
          ...prev,
          [type]: {
            ...facility,
            count: facility.count + 1,
            multiplier: facility.multiplier + 0.1
          }
        };
      }
      return prev;
    });
    updatePowerLoad(); 
    updatePowerStats();
  }
  
  function sellFacility(type) {
    setFacilities(prev => {
      const facility = prev[type];
      if (facility.count > 0) {
        const updatedMoney = money + facility.sellPrice * facility.multiplier;
        setMoney(updatedMoney);
        return {
          ...prev,
          [type]: {
            ...facility,
            count: facility.count - 1,
            multiplier: facility.multiplier - 0.1
          }
        };
      }
      return prev;
    });
    updatePowerLoad();
    updatePowerStats();
  }
  
  return (
    <div>
      <div className='header'>
      <KurtTest />
        <p className='year'>Year: {year}</p>
        <p className='money'>Money: ${new Intl.NumberFormat("en-US").format(money)}</p>
        <div className='ff-reserves-container'>
          <p>Fossil Fuel Reserves:</p>
          <div className='ff-reserves-bar'>
            <div style={{flexBasis: `${fossilFuelReserves}%`}} className='ff-reserves-bar-sections ff-reserves-bar-section1'></div>
            <div style={{flexBasis: `${100 - fossilFuelReserves}%`}} className='ff-reserves-bar-sections ff-reserves-bar-section2'></div>
          </div>
        </div>
        <div className='demand-container'>
          <p>Demand Met:</p>
          <div className='demand-bar'>
            <div style={{flexBasis: `${Math.floor((fossilFuelLoad + cleanEnergyLoad) / powerDemand * 100)}%`}} className='demand-bar-sections demand-bar-section1'></div>
            <div style={{flexBasis: `${100 - Math.floor(((fossilFuelLoad + cleanEnergyLoad) / powerDemand) * 100)}%`}} className='demand-bar-sections demand-bar-section2'></div>
          </div>
        </div>
        <button className='move-on' onClick={() => yearlyUpdates()}>Go To Next Year</button>
      </div>
      <div className='body'><p>Body</p></div>
      <div className='footer'>
      <div className="buy-sell-facilities">
          <div>
            <p>Coal Plants: {facilities.coalPlant.count}</p>
            <button onClick={() => buyFacility('coalPlant')} className='buy-facility-button'>
              Buy Coal Plant ($
              {new Intl.NumberFormat("en-US").format(
                facilities.coalPlant.cost * facilities.coalPlant.multiplier
              )})
            </button>
            <button onClick={() => sellFacility('coalPlant')}>
              Sell Coal Plant ($
              {new Intl.NumberFormat("en-US").format(
                facilities.coalPlant.sellPrice * facilities.coalPlant.multiplier
              )})
            </button>

            <p>Oil Plants: {facilities.oilPlant.count}</p>
            <button onClick={() => buyFacility('oilPlant')}>
              Buy Oil Plant ($
              {new Intl.NumberFormat("en-US").format(
                facilities.oilPlant.cost * facilities.oilPlant.multiplier
              )})
            </button>
            <button onClick={() => sellFacility('oilPlant')}>
              Sell Oil Plant ($
              {new Intl.NumberFormat("en-US").format(
                facilities.oilPlant.sellPrice * facilities.oilPlant.multiplier
              )})
            </button>
          </div>
          
          <div>
            <p>Solar Farms: {facilities.solarFarm.count}</p>
            <button onClick={() => buyFacility('solarFarm')}>
              Buy Solar Farm ($
              {new Intl.NumberFormat("en-US").format(
                facilities.solarFarm.cost * facilities.solarFarm.multiplier
              )})
            </button>
            <button onClick={() => sellFacility('solarFarm')}>
              Sell Solar Farm ($
              {new Intl.NumberFormat("en-US").format(
                facilities.solarFarm.sellPrice * facilities.solarFarm.multiplier
              )})
            </button>

            <p>Wind Farms: {facilities.windFarm.count}</p>
            <button onClick={() => buyFacility('windFarm')}>
              Buy Wind Farm ($
              {new Intl.NumberFormat("en-US").format(
                facilities.windFarm.cost * facilities.windFarm.multiplier
              )})
            </button>
            <button onClick={() => sellFacility('windFarm')}>
              Sell Wind Farm ($
              {new Intl.NumberFormat("en-US").format(
                facilities.windFarm.sellPrice * facilities.windFarm.multiplier
              )})
            </button>
          </div>

          <div>
            <p>Nuclear Plants: {facilities.nuclearPlant.count}</p>
            <button onClick={() => buyFacility('nuclearPlant')}>
              Buy Nuclear Plant ($
              {new Intl.NumberFormat("en-US").format(
                facilities.nuclearPlant.cost * facilities.nuclearPlant.multiplier
              )})
            </button>
            
            
            <button onClick={() => sellFacility('nuclearPlant')}>
              Sell Nuclear Plant ($
              {new Intl.NumberFormat("en-US").format(
                facilities.nuclearPlant.sellPrice * facilities.nuclearPlant.multiplier
              )})
            </button>
          </div>
        </div>
        <div className='research'><p>Research Area</p></div>
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


    // OLD BUY/SELL FACILITY 

    // <div className='transaction'>
    //   <p>Number of factories: {numFactories}</p>
    //   <button onClick={() => buyFactory()}>  <img src="./src/UI_Elements/buttonGreen"></img>Buy Factory</button>
    //   <button onClick={() => sellFactory()}>Sell Factory</button>
    // </div>
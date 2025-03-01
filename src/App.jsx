import './App.css'
import { useState, useEffect } from 'react'; 
import DesignedButton from "./DesignedButton.jsx";

export default function App() {
  const PREVIOUS_BUY_MULTIPLIER = 1.05;
  const PREVIOUS_SELL_MULTIPLIER = 1.05;
  const RESEARCH_COST_MULTIPLIER = 1.10;
  const FACILITY_DISCOUNT = 0.90;

  const [powerDemand, setPowerDemand] = useState(132);
  const [fossilFuelLoad, setFuelLoad] = useState(0);
  const [cleanEnergyLoad, setCleanEnergyLoad] = useState(0);
  const [fossilFuelReserves, setFossilFuelReserves] = useState(100);
  const [population, setPopulation] = useState(330);
  const [totalEmissions, setTotalEmissions] = useState(0);

  const [facilities, setFacilities] = useState({
    coalPlant: { count: 0, cost: 1000, sellPrice: 800, multiplier: 1, power: 6,fossilUse: 1, emissions: 1 },
    oilPlant: { count: 0, cost: 500, sellPrice: 400, multiplier: 1, power: 5, fossilUse: 0.8, emissions: 0.8 },
    nuclearPlant: { count: 0, cost: 6000, sellPrice: 5000, multiplier: 1, power: 10, emissions: 0 }, 
    solarFarm: { count: 0, cost: 50, sellPrice: 40, multiplier: 1, power: 0.5, emissions: 0 },
    windFarm: { count: 0, cost: 150, sellPrice: 120, multiplier: 1, power: 1, emissions: 0 },
  });

  const [money, setMoney] = useState(10000);
  const [userMoneyPerYear, setMoneyPerYear] = useState(10);
  const [year, setYear] = useState(2000);
  const [atWar, setAtWar] = useState(false);

  /*
  ++++ RESEARCH ++++
  */
  const [research, setResearch] = useState({
    solarFarm: { count: 0, cost: 10, researchCostMultiplier: 1 },
    windFarm: { count: 0, cost: 20, researchCostMultiplier: 1 },
    fission: { count: 0, cost: 50, researchCostMultiplier: 1 },
    fusion: { count: 0, cost: 100, researchCostMultiplier: 1 }
  });

  function buyResearch(type) {
    const researchItem = research[type];
    const effectiveResearchCost = researchItem.cost * Math.pow(RESEARCH_COST_MULTIPLIER, researchItem.count);

    if (money < effectiveResearchCost) return;

    setMoney(money - effectiveResearchCost);
    setResearch(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        count: prev[type].count + 1
      }
    }));

    const researchToFacilityMap = {
      solarFarm: "solarFarm",
      windFarm: "windFarm",
      fission: "nuclearPlant"
      // fusion research will go here
    };

    const facilityType = researchToFacilityMap[type];
    if (facilityType) {
      setFacilities(prev => ({
        ...prev,
        [facilityType]: {
          ...prev[facilityType],
          cost: prev[facilityType].cost * FACILITY_DISCOUNT
        }
      }));
    }
  }

  /*
  ++++ FACILITIES ++++
  */
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
      const effectiveBuyCost = facility.cost * Math.pow(PREVIOUS_BUY_MULTIPLIER, facility.count);
      if (money < effectiveBuyCost) return prev;

      setMoney(money - effectiveBuyCost);
      const newCount = facility.count + 1;
      return {
        ...prev,
        [type]: {
          ...facility,
          count: newCount,
          multiplier: Math.pow(PREVIOUS_BUY_MULTIPLIER, newCount)
        }
      };
    });
  }

  function sellFacility(type) {
    setFacilities(prev => {
      const facility = prev[type];
      if (facility.count <= 0) return prev;

      const effectiveSellPrice = facility.sellPrice * (facility.count === 1 ? 1 : Math.pow(PREVIOUS_SELL_MULTIPLIER, facility.count - 1));
      setMoney(money + effectiveSellPrice);
      const newCount = facility.count - 1;
      return {
        ...prev,
        [type]: {
          ...facility,
          count: newCount,
          multiplier: newCount === 0 ? 1 : Math.pow(PREVIOUS_SELL_MULTIPLIER, newCount)
        }
      };
    });
  }

    const handleButtonClick = () => {
      console.log('Button clicked!');
    };
    
    return (
      <div>
        <div className='header'>
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
        <div className='body'><img src='/uiElements/baseCity.png' width="100%" height="100%" /></div>
        <div className='footer'>
        <div className="buy-sell-facilities">
            <div>
              <p>Coal Plants: {facilities.coalPlant.count}</p>
              <DesignedButton 
                clickFunction={() => buyFacility('coalPlant')} 
                text={`Buy Coal Plant ($${new Intl.NumberFormat("en-US").format(facilities.coalPlant.cost * facilities.coalPlant.multiplier)})`}
                type={"Green"}
              />
              <DesignedButton 
                clickFunction={() => sellFacility('coalPlant')} 
                text={`Sell Coal Plant ($${new Intl.NumberFormat("en-US").format(facilities.coalPlant.sellPrice * facilities.coalPlant.multiplier)})`}
                type={"Orange"}
              />

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
          <div className='research'>
            <button onClick={() => buyResearch('solarFarm')}>Solar Farms</button>
            <button onClick={() => buyResearch('windFarm')}>Wind Farms</button>
            <button onClick={() => buyResearch('fission')}>Fission</button>
            <button onClick={() => buyResearch('fusion')}>Fusion</button>
          </div>
        </div>
      </div>
    ) 
}
import './App.css'
import { useState, useEffect, useRef } from 'react'; 
import DesignedButton from "./DesignedButton.jsx";
import DesignedLabel from "./DesignedLabel.jsx";
import KurtTest from "./kurtTest.jsx";

export default function App() {
  const dialogRef = useRef(null);
  
  const events = [
    ["Tech Boom: Widespread AI & automation increase industrial energy use. (+ power demand)", "power demand"], 
    ["Heatwave Crisis: Extreme temperatures drive up AC use. (+ power demand)", "power demand"], 
    ["Electric Vehicle Surge: Governments push for EV adoption, increasing grid demand. (+ power demand)", "power demand"], 
    ["Smart Cities Expansion: Urban areas adopt high-energy smart systems. (+ power demand)", "power demand"], 
    ["Space Industry Growth: Space exploration & satellite networks need massive energy. (+ power demand)", "power demand"], 
    ["Advanced Computing Revolution: Quantum computing & data centers spike demand. (+ power demand)", "power demand"], 
    ["Population Surge: Medical breakthroughs extend lifespan, increasing long-term energy needs. (+ power demand)", "power demand"], 
    ["Water Desalination Boom: Freshwater shortages lead to massive desalination projects. (+ power demand)", "power demand"], 
    ["Cybernetic Implants Trend: Human augmentation tech requires constant power. (+ power demand)", "power demand"], 
    ["Interplanetary Internet: Global networks expand to space colonies. (+ power demand)", "power demand"], 
    
    ["War in Ukraine Escalation: Further instability causes global fuel shortages. (+ fossil fuel prices)", "fossil fuel prices"], 
    ["Middle East Conflict: Tensions disrupt oil exports, raising costs. (+ fossil fuel prices)", "fossil fuel prices"], 
    ["OPEC Supply Cut: Major oil-producing nations reduce output. (+ fossil fuel prices)", "fossil fuel prices"], 
    ["Carbon Tax Expansion: Governments enforce harsher climate policies. (+ fossil fuel prices)", "fossil fuel prices"], 
    ["Major Oil Spill Disaster: New environmental restrictions increase refining costs. (+ fossil fuel prices)", "fossil fuel prices"], 
    ["Coal Mining Regulations: Stricter labor & pollution laws slow coal extraction. (+ fossil fuel prices)", "fossil fuel prices"], 
    ["Renewable Lobby Pressure: Global policies discourage fossil fuel investment. (+ fossil fuel prices)", "fossil fuel prices"], 
    ["Peak Oil Crisis: Fossil fuel reserves hit critical depletion levels. (+ fossil fuel prices)", "fossil fuel prices"], 
    ["Pipeline Cyberattack: Hackers disrupt oil supply chains. (+ fossil fuel prices)", "fossil fuel prices"], 
    ["Extreme Drilling Costs: Deeper, harder-to-reach oil fields drive up extraction costs. (+ fossil fuel prices)", "fossil fuel prices"]
  ];
  
  const [event, setEvent] = useState("");

  const PREVIOUS_BUY_MULTIPLIER = 1.05;
  const RESEARCH_COST_MULTIPLIER = 1.10;
  const FACILITY_DISCOUNT = 0.90;
  const FUSION_THRESHOLD = 3;
  const SELL_FRACTION = 0.8;
  const NEW_POPULATION_PER_YEAR = 0.36;
  const EVENT_POWER_DEMAND_INCREASE = 20;
  const EVENT_COAL_PRICE_INCREASE = 200;
  const EVENT_OIL_PRICE_INCREASE = 50;
  const FACILITY_FIRST_IMAGE_THRESHOLD = 3;
  const FACILITY_SECOND_IMAGE_THRESHOLD = 6;
  const FACILITY_THIRD_IMAGE_THRESHOLD = 9;
  const TOWN_FIRST_IMAGE_THRESHOLD = 2025;
  const TOWN_SECOND_IMAGE_THRESHOLD = 2050;
  const TOWN_THIRD_IMAGE_THRESHOLD = 2075;
  const POPULATION_POWER_DEMAND_MULTIPLIER = 0.4;
  const MAX_RESERVES = 90;
  const EVENT_FREQUENCY = 5;

  const [money, setMoney] = useState(100000);
  const [userMoneyPerYear, setMoneyPerYear] = useState(10);
  const [year, setYear] = useState(2000);
  const [atWar, setAtWar] = useState(false);

  const [powerDemand, setPowerDemand] = useState(133.2);
  const [fossilFuelLoad, setFuelLoad] = useState(0);
  const [cleanEnergyLoad, setCleanEnergyLoad] = useState(0);
  const [fossilFuelReserves, setFossilFuelReserves] = useState(MAX_RESERVES);
  const [population, setPopulation] = useState(330);
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [fusionUnlocked, setFusionUnlocked] = useState(false);

  const [facilities, setFacilities] = useState({
    coalPlant: { count: 10, cost: 1000, multiplier: 1, power: 6, fossilUse: 1, emissions: 1 },
    oilPlant: { count: 8, cost: 500, multiplier: 1, power: 5, fossilUse: 0.8, emissions: 0.8 },
    nuclearPlant: { count: 3, cost: 6000, multiplier: 1, power: 10, emissions: 0 },
    solarFarm: { count: 2, cost: 50, multiplier: 1, power: 0.5, emissions: 0 },
    windFarm: { count: 2, cost: 150, multiplier: 1, power: 1, emissions: 0 },
    fusion: { count: 0, cost: 10000, multiplier: 1, power: 100, emissions: 0 }
  });

  const [research, setResearch] = useState({
    solarFarm: { count: 0, cost: 10, researchCostMultiplier: 1 },
    windFarm: { count: 0, cost: 20, researchCostMultiplier: 1 },
    fission: { count: 0, cost: 50, researchCostMultiplier: 1 },
    fusion: { count: 0, cost: 100, researchCostMultiplier: 1 }
  });

  const actualPercentage = Math.round((fossilFuelLoad + cleanEnergyLoad) / powerDemand * 100);
  const displayPercentage = Math.min(actualPercentage, 100);
  
  /*
  ++++ RESEARCH ++++
  */
  function buyResearch(type) {
    const researchItem = research[type];
    const effectiveResearchCost = researchItem.cost * Math.pow(RESEARCH_COST_MULTIPLIER, researchItem.count);
  
    if (money < effectiveResearchCost) return;
  
    setMoney(money - effectiveResearchCost);
  
    setResearch(prev => {
      const newCount = prev[type].count + 1;
      
      if (type === 'fusion' && newCount >= FUSION_THRESHOLD && !fusionUnlocked) {
        setFusionUnlocked(true);
        console.log("Fusion technology unlocked!");
      }
      
      return {
        ...prev,
        [type]: {
          ...prev[type],
          count: newCount
        }
      };
    });
  
    const researchToFacilityMap = {
      solarFarm: "solarFarm",
      windFarm: "windFarm",
      fission: "nuclearPlant",
      fusion: "fusion"
    };
  
    const facilityType = researchToFacilityMap[type];
    if (facilityType && facilityType !== 'fusion') {
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
      (facilities.windFarm.count * facilities.windFarm.power) +
      (facilities.fusion.count * facilities.fusion.power);
    setCleanEnergyLoad(cleanLoad);

    const demand = population * POPULATION_POWER_DEMAND_MULTIPLIER;
    setPowerDemand(demand);

    const totalFossilConsumption = 
      (facilities.coalPlant.count * facilities.coalPlant.fossilUse) +
      (facilities.oilPlant.count * facilities.oilPlant.fossilUse);
    
    const maxReserves = MAX_RESERVES;
    const remainingReserves = Math.max(0, maxReserves - totalFossilConsumption);
    setFossilFuelReserves(remainingReserves);
  }, [facilities, population]);

  function yearlyUpdates() {
    const emissions =
      (facilities.coalPlant.count * facilities.coalPlant.emissions) +
      (facilities.oilPlant.count * facilities.oilPlant.emissions);

    setTotalEmissions(totalEmissions + emissions);
    setMoney(money + userMoneyPerYear);
    setPopulation(population + NEW_POPULATION_PER_YEAR);
    setYear(year + 1);
  }

  useEffect(() => {
    if (year % EVENT_FREQUENCY == 0 && year != 2000) {
      chooseEvent();
      dialogRef.current.showModal(); 
    }
  }, [year]);

  function buyFacility(type) {
    setFacilities(prev => {
      const facility = prev[type];
      const effectiveBuyCost = facility.cost * Math.pow(PREVIOUS_BUY_MULTIPLIER, facility.count - 1);
      if (money < effectiveBuyCost) return prev;

      setMoney(money - effectiveBuyCost);
      const newCount = facility.count + 1;
      return {
        ...prev,
        [type]: {
          ...facility,
          count: newCount,
          multiplier: newCount === 0 ? 1 : Math.pow(PREVIOUS_BUY_MULTIPLIER, newCount)
        }
      };
    });
  }

  function sellFacility(type) {
    setFacilities(prev => {
      const facility = prev[type];
      if (facility.count <= 0) return prev;

      const effectiveSellPrice = facility.cost * Math.pow(PREVIOUS_BUY_MULTIPLIER, facility.count - 1) * SELL_FRACTION;
      setMoney(prevMoney => prevMoney + effectiveSellPrice);
      const newCount = facility.count - 1;
      return {
        ...prev,
        [type]: {
          ...facility,
          count: newCount,
          multiplier: newCount === 0 ? 1 : Math.pow(PREVIOUS_BUY_MULTIPLIER, newCount)
        }
      };
    });
  }

  function determineImage(facility) {
    if (facility === 'oil') {
      if (facilities.oilPlant.count < FACILITY_FIRST_IMAGE_THRESHOLD) {
        return 'Zero';
      }
      if (facilities.oilPlant.count < FACILITY_SECOND_IMAGE_THRESHOLD) {
        return 'One'; 
      }
      if (facilities.oilPlant.count < FACILITY_THIRD_IMAGE_THRESHOLD) {
        return 'Two'; 
      }
      return 'Three'; 
    }

    if (facility === 'coal') {
      if (facilities.coalPlant.count < FACILITY_FIRST_IMAGE_THRESHOLD) {
        return 'Zero';
      }
      if (facilities.coalPlant.count < FACILITY_SECOND_IMAGE_THRESHOLD) {
        return 'One'; 
      }
      if (facilities.coalPlant.count < FACILITY_THIRD_IMAGE_THRESHOLD) {
        return 'Two'; 
      }
      return 'Three'; 
    }

    if (facility === 'solar') {
      if (facilities.solarFarm.count < FACILITY_FIRST_IMAGE_THRESHOLD) {
        return 'Zero';
      }
      if (facilities.solarFarm.count < FACILITY_SECOND_IMAGE_THRESHOLD) {
        return 'One'; 
      }
      if (facilities.solarFarm.count < FACILITY_THIRD_IMAGE_THRESHOLD) {
        return 'Two'; 
      }
      return 'Three'; 
    }

    if (facility === 'wind') {
      if (facilities.windFarm.count < FACILITY_FIRST_IMAGE_THRESHOLD) {
        return 'Zero';
      }
      if (facilities.windFarm.count < FACILITY_SECOND_IMAGE_THRESHOLD) {
        return 'One'; 
      }
      if (facilities.windFarm.count < FACILITY_THIRD_IMAGE_THRESHOLD) {
        return 'Two'; 
      }
      return 'Three'; 
    }

    if (facility === 'nuclear') {
      if (facilities.nuclearPlant.count < FACILITY_FIRST_IMAGE_THRESHOLD) {
        return 'Zero.png';
      }
      return 'One.gif'; 
    }

    if (facility === 'year') {
      if (year < TOWN_FIRST_IMAGE_THRESHOLD) {
        return 'One';
      }
      if (year < TOWN_SECOND_IMAGE_THRESHOLD) {
        return 'One'; 
      }
      if (year < TOWN_THIRD_IMAGE_THRESHOLD) {
        return 'Two'; 
      }
      return 'Three'; 
    }
  }

  function chooseEvent() {
    const randomIndex = Math.floor(Math.random() * events.length);
    const chosenEvent = events[randomIndex];
    setEvent(chosenEvent[0]); 
    events.splice(randomIndex, 1);

    if (chosenEvent[0] == "power demand") {
      setPowerDemand(powerDemand + EVENT_POWER_DEMAND_INCREASE); 
    } else {
      setFacilities(prevFacilities => ({
        ...prevFacilities,
        coalPlant: {
          ...prevFacilities.coalPlant,
          cost: prevFacilities.coalPlant.cost + EVENT_COAL_PRICE_INCREASE
        },
        oilPlant: {
          ...prevFacilities.oilPlant,
          cost: prevFacilities.oilPlant.cost + EVENT_OIL_PRICE_INCREASE
        }
      }));
    }
  }
    
  return (
    <div>
      <div className='header'>
        <DesignedLabel
        type={"Yellow"}
        text={`Year: ${year}`}
        
        />
        <DesignedButton 
          clickFunction={() => yearlyUpdates()} 
          text={"Go To Next Year"}
          type={"Blue"}
        />
        <p className='money'>
          Money: ${new Intl.NumberFormat("en-US").format(Math.round(money))}
        </p>
        <div className='ff-reserves-container'>
          <p>Fossil Fuel Reserves:</p>
          <div className='ff-reserves-bar'>
            <div style={{flexBasis: `${Math.round(fossilFuelReserves)}%`}} className='ff-reserves-bar-sections ff-reserves-bar-section1'></div>
            <div style={{flexBasis: `${100 - Math.round(fossilFuelReserves)}%`}} className='ff-reserves-bar-sections ff-reserves-bar-section2'></div>
          </div>
        </div>
        <div className='demand-container'>
          <p>Demand Met:</p>
          <div className='demand-bar'>
            <div 
              style={{flexBasis: `${displayPercentage}%`}} 
              className='demand-bar-sections demand-bar-section1'
            ></div>
            <div 
              style={{flexBasis: `${100 - displayPercentage}%`}} 
              className='demand-bar-sections demand-bar-section2'
            ></div>
          </div>
        </div>
      </div>

      {/* <button onClick={() => dialogRef.current.showModal()}>Open Modal</button> */}
      <dialog ref={dialogRef} className='modal'>
        {/* <p>This is a modal using the HTML dialog element.</p> */}
        <img src={'/public/uiElements/newspaper.png'} width="100%" height="50%"></img>
        <p className='modal-text'>{event}</p>
        <button onClick={() => dialogRef.current.close()}>Close</button>
      </dialog>

      {/* <div className='body'><img src='/uiElements/baseCity.png' width="100%" height="100%" /></div> */}
      <div className='body'>
        <img src={`/fossilFuelBackgroundImages/oil${determineImage("oil")}.png`} width="16%" height="100%" />
        <img src={`/fossilFuelBackgroundImages/coal${determineImage("coal")}.gif`} width="13%" height="100%" />
        <img src={`/renewableBackgroundImages/town${determineImage("year")}.png`} width="37%" height="100%" />
        <img src={`/renewableBackgroundImages/solar${determineImage("solar")}.png`} width="12%" height="100%" />
        <img src={`/renewableBackgroundImages/nuke${determineImage("nuclear")}`} width="5%" height="100%" />
        <img src={`/renewableBackgroundImages/wind${determineImage("wind")}.png`} width="17%" height="100%" />
      </div>

      <div className='footer'>
      <div className="buy-sell-facilities">
        <div>
        <p>Coal Plants: {facilities.coalPlant.count}</p>
          <DesignedButton 
            clickFunction={() => buyFacility('coalPlant')} 
            text={`Buy (-$${new Intl.NumberFormat("en-US").format(Math.round(facilities.coalPlant.cost * Math.pow(PREVIOUS_BUY_MULTIPLIER, facilities.coalPlant.count - 1)))})`}
            type={"Green"}
          />
          { facilities.coalPlant.count > 0 && (
            <DesignedButton 
              clickFunction={() => sellFacility('coalPlant')} 
              text={`Sell (+$${new Intl.NumberFormat("en-US").format(
                Math.round(facilities.coalPlant.cost * Math.pow(PREVIOUS_BUY_MULTIPLIER, facilities.coalPlant.count - 1) * SELL_FRACTION)
              )})`}
              type={"Orange"}
            />
        )}
        </div>

        <div>
          <p>Oil Plants: {facilities.oilPlant.count}</p>
            <DesignedButton 
              clickFunction={() => buyFacility('oilPlant')} 
              text={`Buy (-$${new Intl.NumberFormat("en-US").format(Math.round(facilities.oilPlant.cost * Math.pow(PREVIOUS_BUY_MULTIPLIER, facilities.oilPlant.count - 1)))})`}
              type={"Green"}
            />
            { facilities.oilPlant.count > 0 && (
              <DesignedButton 
                clickFunction={() => sellFacility('oilPlant')} 
                text={`Sell (+$${new Intl.NumberFormat("en-US").format(
                  Math.round(facilities.oilPlant.cost * Math.pow(PREVIOUS_BUY_MULTIPLIER, facilities.oilPlant.count - 1) * SELL_FRACTION)
                )})`}
                type={"Orange"}
              />
          )}
        </div>

        <div>
          <p>Solar Farms: {facilities.solarFarm.count}</p>
              <DesignedButton 
                clickFunction={() => buyFacility('solarFarm')} 
                text={`Buy (-$${new Intl.NumberFormat("en-US").format(Math.round(facilities.solarFarm.cost * Math.pow(PREVIOUS_BUY_MULTIPLIER, facilities.solarFarm.count - 1)))})`}
                type={"Green"}
              />
              { facilities.solarFarm.count > 0 && (
                <DesignedButton 
                  clickFunction={() => sellFacility('solarFarm')} 
                  text={`Sell (+$${new Intl.NumberFormat("en-US").format(
                    Math.round(facilities.solarFarm.cost * Math.pow(PREVIOUS_BUY_MULTIPLIER, facilities.solarFarm.count - 1) * SELL_FRACTION)
                  )})`}
                  type={"Orange"}
                />
            )}
        </div>
        
        <div>
          <p>Wind Farms: {facilities.windFarm.count}</p>
                <DesignedButton 
                  clickFunction={() => buyFacility('windFarm')} 
                  text={`Buy (-$${new Intl.NumberFormat("en-US").format(Math.round(facilities.windFarm.cost * Math.pow(PREVIOUS_BUY_MULTIPLIER, facilities.windFarm.count - 1)))})`}
                  type={"Green"}
                />
                { facilities.windFarm.count > 0 && (
                  <DesignedButton 
                    clickFunction={() => sellFacility('windFarm')} 
                    text={`Sell (+$${new Intl.NumberFormat("en-US").format(
                      Math.round(facilities.windFarm.cost * Math.pow(PREVIOUS_BUY_MULTIPLIER, facilities.windFarm.count - 1) * SELL_FRACTION)
                    )})`}
                    type={"Orange"}
                  />
              )}
        </div>

        <div>
          <p>Fission: {facilities.nuclearPlant.count}</p>
                  <DesignedButton 
                    clickFunction={() => buyFacility('nuclearPlant')} 
                    text={`Buy (-$${new Intl.NumberFormat("en-US").format(Math.round(facilities.nuclearPlant.cost * Math.pow(PREVIOUS_BUY_MULTIPLIER, facilities.nuclearPlant.count - 1)))})`}
                    type={"Green"}
                  />
                  { facilities.nuclearPlant.count > 0 && (
                    <DesignedButton 
                      clickFunction={() => sellFacility('nuclearPlant')} 
                      text={`Sell (+$${new Intl.NumberFormat("en-US").format(
                        Math.round(facilities.nuclearPlant.cost * Math.pow(PREVIOUS_BUY_MULTIPLIER, facilities.nuclearPlant.count - 1) * SELL_FRACTION)
                      )})`}
                      type={"Orange"}
                    />
                )}
        </div>

        {fusionUnlocked && (
          <div>
            <p>Fusion: {facilities.fusion.count}</p>
                  <DesignedButton 
                    clickFunction={() => buyFacility('fusion')} 
                    text={`Buy (-$${new Intl.NumberFormat("en-US").format(Math.round(facilities.fusion.cost * Math.pow(PREVIOUS_BUY_MULTIPLIER, facilities.fusion.count - 1)))})`}
                    type={"Green"}
                  />
                  { facilities.fusion.count > 0 && (
                    <DesignedButton 
                      clickFunction={() => sellFacility('fusion')} 
                      text={`Sell (+$${new Intl.NumberFormat("en-US").format(
                        Math.round(facilities.fusion.cost * Math.pow(PREVIOUS_BUY_MULTIPLIER, facilities.fusion.count - 1) * SELL_FRACTION)
                      )})`}
                      type={"Orange"}
                    />
                )}
          </div>
        )}
      </div>

        <div className='research'>
        <div className='research-button-group'>
          <DesignedButton 
            clickFunction={() => buyResearch('solarFarm')} 
            text={`Solar Farm (Lvl. ${new Intl.NumberFormat("en-US").format(research.solarFarm.count)})(-$${new Intl.NumberFormat("en-US").format(
              Math.round(research.solarFarm.cost * Math.pow(RESEARCH_COST_MULTIPLIER, research.solarFarm.count))
            )})`}
            type={"Green"}
            research={true}
          />
          <DesignedButton 
            clickFunction={() => buyResearch('windFarm')} 
            text={`Wind Farm (Lvl. ${new Intl.NumberFormat("en-US").format(research.windFarm.count)})(-$${new Intl.NumberFormat("en-US").format(
              Math.round(research.windFarm.cost * Math.pow(RESEARCH_COST_MULTIPLIER, research.windFarm.count))
            )})`}
            type={"Green"}
            research={true}
          /> 
        </div>
        <div className='research-button-group'>
          <DesignedButton 
            clickFunction={() => buyResearch('fission')} 
            text={`Fission (Lvl. ${new Intl.NumberFormat("en-US").format(research.fission.count)})(-$${new Intl.NumberFormat("en-US").format(
              Math.round(research.fission.cost * Math.pow(RESEARCH_COST_MULTIPLIER, research.fission.count))
            )})`}
            type={"Green"}
            research={true}
          /> 
          <DesignedButton 
            clickFunction={() => buyResearch('fusion')} 
            text={`Fusion (Lvl. ${new Intl.NumberFormat("en-US").format(research.fusion.count)})(-$${new Intl.NumberFormat("en-US").format(
              Math.round(research.fusion.cost * Math.pow(RESEARCH_COST_MULTIPLIER, research.fusion.count))
            )})`}
            type={"Green"}
            research={true}
          /> 
        </div>
        </div>
      </div>
    );
    </div>
  );
}

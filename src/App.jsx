import './App.css'
import { useState, useEffect, useRef } from 'react'; 
import DesignedButton from "./DesignedButton.jsx";
import DesignedLabel from "./DesignedLabel.jsx";


export default function App() {
  const dialogRef = useRef(null);

  const instructions = `
    Welcome to Race to 2100, the game that tests your strategy and your global awareness.

    You're goal is to get the largest population with the least amounts of deaths.

    Your people need energy to survive, and in order to meet this demand, you will
    have to invest in energy sources (coal, oil, solar, wind, fission, and fusion).

    You can buy and sell energy sources with the green and orange buttons or research
    in future energies with the blue buttons which decrease the cost of their respective
    energy source, however, you can only make one choice per year. You can also advance
    the year without taking action on the top left.

    If you do not meet at least 80% of your energy demand, people die.
    If you output too much pollution, people die.

    Good Luck!`; 
  
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
  const dumbEvents = [
    ["Florida man falls in love with alligator, \"He's so pretty\" - Kurt D."], 
    ["Man puts Chat GPT in his dominant arm to play tennis better"], 
    ["Woman in Texas builds a house entirely out of tortilla chips: \"Structural integrity is questionable, but delicious.\""], 
    ["Man sues mirror manufacturer after losing staring contest with his reflection"], 
    ["Woman claims she can talk to squirrels; local rodent population denies allegations."], 
    ["Man puts jetpack on his lawnmower; now has the fastest grass in town."], 
    ["Local dad banned from trivia night for \"knowing too much about ducks.\""], 
    ["Man arrested for trying to train pigeons to deliver pizzas instead of messages."], 
    ["Woman wins marathon after accidentally entering while running from a bee."], 
    ["Man builds a boat entirely out of empty soda cans; surprisingly, it floats... for five minutes."], 
    ["Man replaces all furniture in his house with trampolines, ceiling fans become a hazard."],
    ["Local man spends life savings trying to teach his cat to play poker."],
  ];
  const [event, setEvent] = useState("");
  const [dumbEvent, setDumbEvent] = useState("");
  
  // Action Limit System
  const ACTION_LIMIT_PER_YEAR = 1; 
  const [actionsTakenInYear, setActionsTakenInYear] = useState(0); 
  
  // Buy/Sell Constants
  const PREVIOUS_BUY_MULTIPLIER = 1.08; // Increased to make scaling costs more punishing //1.08
  const RESEARCH_COST_MULTIPLIER = 1.25; // Increased to make research progression more challenging
  const FACILITY_DISCOUNT = 0.80; // Increased discount to make research more valuable
  const FUSION_THRESHOLD = 3; // Increased to make fusion harder to unlock
  const SELL_FRACTION = 0.6; // Reduced to discourage facility selling
  
  // Population & Demand Constants
  const NEW_POPULATION_PER_YEAR = 1; // Increased for faster population growth
  const POPULATION_POWER_DEMAND_MULTIPLIER = 0.5; // Increased for higher demand pressure
  const MAX_RESERVES = 100; // Slightly increased initial reserves
  const DEMAND_THRESHOLD_PERCENTAGE = 80; // If demand met is below this percentage, population loss occurs.
  const EMISSIONS_THRESHOLD = 50;         // If last year's emissions exceed this, additional deaths occur.
  const DEMAND_DEATH_MULTIPLIER = 1 / 100;  // Each percentage point below the threshold causes this fraction of newPopulation to die.
  const EMISSIONS_DEATH_MULTIPLIER = 0.5;
  
  // Event Constants
  const EVENT_POWER_DEMAND_INCREASE = 35; // Increased for more impactful events
  const EVENT_COAL_PRICE_INCREASE = 500; // Significantly increased to punish fossil fuels later
  const EVENT_OIL_PRICE_INCREASE = 200; // Significantly increased to punish fossil fuels later
  const EVENT_FREQUENCY = 10; // More frequent events
  
  // Facility Image Thresholds
  const FACILITY_FIRST_IMAGE_THRESHOLD = 3;
  const FACILITY_SECOND_IMAGE_THRESHOLD = 6;
  const FACILITY_THIRD_IMAGE_THRESHOLD = 9;
  const TOWN_FIRST_IMAGE_THRESHOLD = 2025;
  const TOWN_SECOND_IMAGE_THRESHOLD = 2050;
  const TOWN_THIRD_IMAGE_THRESHOLD = 2075;

  // Initial Game State
  const [money, setMoney] = useState(10000); // Adjusted starting money
  const [userMoneyPerYear, setMoneyPerYear] = useState(1000); // Adjusted yearly income
  const [year, setYear] = useState(2000);
  
  // Energy System State
  const INITIAL_POPULATION = 330;
  const [powerDemand, setPowerDemand] = useState(165); // Increased initial demand
  const [fossilFuelLoad, setFuelLoad] = useState(0);
  const [cleanEnergyLoad, setCleanEnergyLoad] = useState(0);
  const [fossilFuelReserves, setFossilFuelReserves] = useState(MAX_RESERVES);
  const [population, setPopulation] = useState(INITIAL_POPULATION);
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [lastYearEmissions, setLastYearEmissions] = useState(0);
  const [fusionUnlocked, setFusionUnlocked] = useState(false);
  
  // Facility Properties
  const [facilities, setFacilities] = useState({
    // Fossil fuels - now significantly cheaper but with higher long-term costs
    coalPlant: { 
      count: 7, 
      cost: 600, // Much cheaper initial cost to make them very tempting
      multiplier: 1, 
      power: 12, // Greatly increased power to make them initially very attractive
      fossilUse: 1.5, // Increased fossil use to deplete reserves faster
      emissions: 2.5,
      sell: 1500 // Increased emissions for later consequences
    },
    oilPlant: { 
      count: 5, 
      cost: 350, // Much cheaper initial cost to make them very tempting
      multiplier: 1, 
      power: 9, // Greatly increased power to make them initially very attractive
      fossilUse: 1.2, // Increased fossil use to deplete reserves faster
      emissions: 1.8,
      sell: 500 // Increased emissions for later consequences
    },
    
    // Clean energy - now more expensive initially with lower initial power
    nuclearPlant: { 
      count: 2, 
      cost: 12000, // Significantly more expensive initially
      multiplier: 1, 
      power: 15, // Good power but expensive up front
      emissions: 0,
      sell: 7500
    },
    solarFarm: { 
      count: 2, 
      cost: 8000, // Much more expensive initially // 800
      multiplier: 1, 
      power: 0.5, // Lower initial power
      emissions: 0,
      sell: 5000
    },
    windFarm: { 
      count: 2, 
      cost: 10000, // Much more expensive initially // 1200
      multiplier: 1, 
      power: 0.8, // Lower initial power
      emissions: 0,
      sell: 7500
    },
    
    // Late-game superpower
    fusion: { 
      count: 0, 
      cost: 35000, // Extremely expensive as a late-game goal
      multiplier: 1, 
      power: 100, // Doubled power to make it extremely valuable when achieved
      emissions: 0,
      sell: 20000
    }
  });

  const [cumulativeCoalPlants, setCumulativeCoalPlants] = useState(facilities.coalPlant.count); // Starting with initial 10 coal plants
  const [cumulativeOilPlants, setCumulativeOilPlants] = useState(facilities.oilPlant.count);    // Starting with initial 8 oil plants

  
  // Research State - Now research provides better power improvements for renewables
  const [research, setResearch] = useState({
    solarFarm: { 
      count: 0, 
      cost: 7500, // More expensive initial research // 75
      researchCostMultiplier: 1 
    },
    windFarm: { 
      count: 0, 
      cost: 9000, // More expensive initial research // 125 
      researchCostMultiplier: 1 
    },
    fission: { 
      count: 0, 
      cost: 10000, // More expensive to make nuclear a mid-game option // 200
      researchCostMultiplier: 1 
    },
    fusion: { 
      count: 0, 
      cost: 20000, // Much more expensive to make fusion a significant late-game investment // 500 
      researchCostMultiplier: 1 
    }
  });

  const actualPercentage = Math.round((fossilFuelLoad + cleanEnergyLoad) / powerDemand * 100);
  const displayPercentage = Math.min(actualPercentage, 100);
  
  /*
  ++++ RESEARCH ++++
  */
  function buyResearch(type) {
    if (actionsTakenInYear >= ACTION_LIMIT_PER_YEAR) {
      return;
    }
    
    const researchItem = research[type];
    const effectiveResearchCost = researchItem.cost * Math.pow(RESEARCH_COST_MULTIPLIER, researchItem.count);
  
    // Use functional update so we get the latest money value
    setMoney(prevMoney => {
      if (prevMoney < effectiveResearchCost) return prevMoney; // Not enough money
      return prevMoney - effectiveResearchCost;
    });
    
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
  
    setActionsTakenInYear(prev => prev + 1);
    yearlyUpdates();
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
  
    setLastYearEmissions(emissions);
    setTotalEmissions(prevTotal => prevTotal + emissions);
  
    setMoney(prev => prev + userMoneyPerYear);
  
    const newPopulation = population + NEW_POPULATION_PER_YEAR;
    let deathAmount = 0;
  
    if (displayPercentage < DEMAND_THRESHOLD_PERCENTAGE) {
      deathAmount += Math.round(newPopulation * ((DEMAND_THRESHOLD_PERCENTAGE - displayPercentage) * DEMAND_DEATH_MULTIPLIER));
    }
  
    if (emissions > EMISSIONS_THRESHOLD) {
      deathAmount += Math.round((emissions - EMISSIONS_THRESHOLD) * EMISSIONS_DEATH_MULTIPLIER);
    }
  
    const updatedPopulation = Math.max(newPopulation - deathAmount, 0);
    setPopulation(updatedPopulation);
  
    setYear(prev => prev + 1);
    setActionsTakenInYear(0);
  }

  useEffect(() => {
    if (year % EVENT_FREQUENCY == 0 || population == 0) {
      chooseEvent();
      dialogRef.current.showModal(); 
    }
  }, [year]);

  function buyFacility(type) {
    if (actionsTakenInYear >= ACTION_LIMIT_PER_YEAR) {
      return;
    }
    
    // Prevent buying fossil fuel plants if reserves are 0
    if ((type === 'coalPlant' || type === 'oilPlant') && fossilFuelReserves === 0) {
      return;
    }

    if(money < facilities[type].cost * Math.pow(PREVIOUS_BUY_MULTIPLIER, facilities[type].count - 1)) {
      return;
    }
    
    // Update cumulative count for fossil fuel plants (if applicable)
    if (type === 'coalPlant') {
      setCumulativeCoalPlants(prev => prev + 1);
    } else if (type === 'oilPlant') {
      setCumulativeOilPlants(prev => prev + 1);
    }
    
    setFacilities(prev => {
      const facility = prev[type];
      const effectiveBuyCost = facility.cost * Math.pow(PREVIOUS_BUY_MULTIPLIER, facility.count - 1);
      // Subtract money using a functional update:
      setMoney(prevMoney => {
        if (prevMoney < effectiveBuyCost) return prevMoney;
        return prevMoney - effectiveBuyCost;
      });
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
    
    setActionsTakenInYear(prev => prev + 1);
    yearlyUpdates();
  }
  
  function getSaturation() {
     if(2 / (totalEmissions/150.0)>1){
       return 1;
    } else{
     return 2 / (totalEmissions/150.0);
     }
    
  }
  
  
  function sellFacility(type) {
    if (actionsTakenInYear >= ACTION_LIMIT_PER_YEAR) {
      return;
    }
  
    // Get the current facility data
    const facility = facilities[type];
    const sellPrice = facilities[type].sell;
  
    // Calculate the effective sell price
    const effectiveSellPrice = sellPrice - 1000;
    
    // Update money first
    setMoney(prevMoney => prevMoney + effectiveSellPrice);
  
    // Update the facility count and multiplier
    setFacilities(prevFacilities => {
      const currentFacility = prevFacilities[type];
      const newCount = currentFacility.count - 1;
      return {
        ...prevFacilities,
        [type]: {
          ...currentFacility,
          count: newCount,
        }
      };
    });
  
    // Use functional update to ensure the latest state
    setActionsTakenInYear(prev => prev + 1);
  
    // Advance the game year with any additional yearly updates
    yearlyUpdates();
  }
  

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
  
    // Use cumulative counts for total fossil fuel consumption.
    const totalFossilConsumption = 
      (cumulativeCoalPlants * facilities.coalPlant.fossilUse) +
      (cumulativeOilPlants * facilities.oilPlant.fossilUse);
    
    const remainingReserves = Math.max(0, MAX_RESERVES - totalFossilConsumption);
    setFossilFuelReserves(remainingReserves);
  }, [facilities, population, cumulativeCoalPlants, cumulativeOilPlants]);
  

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
    const randomDumbIndex = Math.floor(Math.random() * dumbEvents.length);
    const chosenDumbEvent = dumbEvents[randomDumbIndex];
    setEvent(chosenEvent[0]); 
    setDumbEvent(chosenDumbEvent[0]);
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
      <div className='header' style={{ filter: `saturate(${getSaturation()})` }}>
        <h2>Year: {year}</h2>
        <DesignedButton 
          clickFunction={() => yearlyUpdates()} 
          text={"Next Year"}
          type={"Yellow"}
        />
        
        <p className='money'>
          Money: ${new Intl.NumberFormat("en-US").format(Math.round(money))}
        </p>
        
        <div className='ff-reserves-container'>
          <p>Fossil Fuel Reserves: {Math.round(fossilFuelReserves)}%</p>
          <div className='ff-reserves-bar'>
            <div style={{flexBasis: `${Math.round(fossilFuelReserves)}%`}} className='ff-reserves-bar-sections ff-reserves-bar-section1'></div>
            <div style={{flexBasis: `${100 - Math.round(fossilFuelReserves)}%`}} className='ff-reserves-bar-sections ff-reserves-bar-section2'></div>
          </div>
        </div>
        
        <div className='demand-container'>
         <p>Demand: {actualPercentage}%</p>
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
        
        {/* <div className='stats-container'>
          <p>Population: {Math.round(population)} mil</p>
          <p>Population Change: {population - INITIAL_POPULATION} mil</p>
          <p>Last Year's Emissions: {Math.round(lastYearEmissions)}</p>
          <p>Total Emissions: {Math.round(totalEmissions)}</p>
        </div> */}

      </div>

    

      <dialog ref={dialogRef} className='modal'>
        <img src={'/public/uiElements/newspaper.png'} width="85%" height="50%"></img>
        {(year == 2000) && <p className='modal-text-instructions'>{instructions}</p>}
        {(population == 0) && <p className='modal-text-end'>{"You killed everybody!! \n "+ "You are a HORRIBLE person.\n Reload to try again!"}</p>}
        {(year == 2100) && <p className='modal-text-end'>{"You made it to 2100! \n "+ "You ended with a population of " + population + " million , and the population changed by " + (population - INITIAL_POPULATION) + " million people.\n Reload to try again!"}</p>}
        {(year != 2000 && year != 2100 && population != 0) && <p className='modal-text'>{event}</p>}
        {(year != 2000 && year != 2100 && population != 0) && <p className='modal-text-dumb-event'>{dumbEvent}</p>}
        
        <button onClick={() => dialogRef.current.close()}>Close</button>
      </dialog>

      <div style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} className='body'>
      {/* style={{ filter: `saturate(${getSaturation()})` }} */}
        <img src={`/fossilFuelBackgroundImages/oil${determineImage("oil")}.gif`} width="16%" height="100%" style={{ filter: `saturate(${getSaturation()})` }} />
        <img src={`/fossilFuelBackgroundImages/coal${determineImage("coal")}.gif`} width="13%" height="100%" style={{ filter: `saturate(${getSaturation()})` }}/>
        <img src={`/renewableBackgroundImages/town${determineImage("year")}.png`} width="37%" height="100%" style={{ filter: `saturate(${getSaturation()})` }}/>
        <img src={`/renewableBackgroundImages/solar${determineImage("solar")}.gif`} width="12%" height="100%" style={{ filter: `saturate(${getSaturation()})` }}/>
        <img src={`/renewableBackgroundImages/nuke${determineImage("nuclear")}`} width="5%" height="100%" style={{ filter: `saturate(${getSaturation()})` }}/>
        <img src={`/renewableBackgroundImages/wind${determineImage("wind")}.gif`} width="17%" height="100%" style={{ filter: `saturate(${getSaturation()})` }}/>
      </div>
      <div className='stats-container'>
          <p>Population: {Math.round(population)} mil</p>
          <p>Population Change: {population - INITIAL_POPULATION} mil</p>
          <p>Last Year's Emissions: {Math.round(lastYearEmissions)}</p>
          <p>Total Emissions: {Math.round(totalEmissions)}</p>
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
              text={`Sell (+$1,500)`}
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
                text={`Sell (+$500)`}
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
                  text={`Sell (+$5,000)`}
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
                    text={`Sell (+$7,500)`}
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
                      text={`Sell (+$7,500)`}
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
                      text={`Sell (+$20,000)`}
                      type={"Orange"}
                    />
                )}
          </div>
        )}
      </div>

        <div className='research'>
        <div className='research-button-group'>
          <p></p>
          <DesignedButton 
            clickFunction={() => buyResearch('solarFarm')} 
            text={`Solar (Lv. ${new Intl.NumberFormat("en-US").format(research.solarFarm.count)})(-$${new Intl.NumberFormat("en-US").format(
              Math.round(research.solarFarm.cost * Math.pow(RESEARCH_COST_MULTIPLIER, research.solarFarm.count))
            )})`}
            type={"Blue"}
            research={true}
          />
          <DesignedButton 
            clickFunction={() => buyResearch('windFarm')} 
            text={`Wind (Lv. ${new Intl.NumberFormat("en-US").format(research.windFarm.count)})(-$${new Intl.NumberFormat("en-US").format(
              Math.round(research.windFarm.cost * Math.pow(RESEARCH_COST_MULTIPLIER, research.windFarm.count))
            )})`}
            type={"Blue"}
            research={true}
          /> 
        </div>
        <div className='research-button-group'>
        <p></p>
          <DesignedButton 
            clickFunction={() => buyResearch('fission')} 
            text={`Fission (Lv. ${new Intl.NumberFormat("en-US").format(research.fission.count)})(-$${new Intl.NumberFormat("en-US").format(
              Math.round(research.fission.cost * Math.pow(RESEARCH_COST_MULTIPLIER, research.fission.count))
            )})`}
            type={"Blue"}
            research={true}
          /> 
          <DesignedButton 
            clickFunction={() => buyResearch('fusion')} 
            text={`Fusion (Lv. ${new Intl.NumberFormat("en-US").format(research.fusion.count)})(-$${new Intl.NumberFormat("en-US").format(
              Math.round(research.fusion.cost * Math.pow(RESEARCH_COST_MULTIPLIER, research.fusion.count))
            )})`}
            type={"Blue"}
            research={true}
          /> 
        </div>
        </div>
      </div>
    </div>
    
  );
}

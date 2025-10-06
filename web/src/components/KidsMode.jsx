import React, { useState, useEffect, useCallback } from 'react';
import { Rocket, Star, Sparkles, Award, Book, Home, Menu } from 'lucide-react';
import { allMysteries } from '../data/mysteriesData'; 

const MYSTERIES_TO_SHOW = 4;
const CLUE_COST = 50;
const THEME_COST = 200;
const SUIT_COST = 150;
const ALIEN_COST = 125;
const THEME_ROCKET_COST = 200;
const STAR_COST = 100;

const getInitialState = (key, defaultValue) => {
    const stored = localStorage.getItem(key);
    if (stored !== null) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        if (stored === 'true') return true;
        if (stored === 'false') return false;
        return stored;
      }
    }
    return defaultValue;
};

const getRandomMysteries = (data, n) => {
    if (data.length <= n) return data; 
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
};

const KidsMode = ({ onExit }) => {
  // ESTADOS CON PERSISTENCIA
  const [step, setStep] = useState(getInitialState('kidsModeStep', 'mainMenu')); 
  const [points, setPoints] = useState(getInitialState('kidsModePoints', 0));
  const [discoveries, setDiscoveries] = useState(getInitialState('kidsModeDiscoveries', 0));
  
  const [unlockedClue, setUnlockedClue] = useState(getInitialState('kidsModeClue', false));
  const [unlockedTheme, setUnlockedTheme] = useState(getInitialState('kidsModeTheme', false));
  
  const [unlockedAstronaut, setUnlockedAstronaut] = useState(getInitialState('kidsModeAstronaut', false));
  const [unlockedUFO, setUnlockedUFO] = useState(getInitialState('kidsModeUFO', false));
  const [unlockedRocketCompanion, setUnlockedRocketCompanion] = useState(getInitialState('kidsModeRocketComp', false));
  const [unlockedAlien, setUnlockedAlien] = useState(getInitialState('kidsModeAlien', false)); 
  const [unlockedStar, setUnlockedStar] = useState(getInitialState('kidsModeStar', false));
  
  const [selectedMystery, setSelectedMystery] = useState(null);
  const [guess, setGuess] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [completedMysteryIds, setCompletedMysteryIds] = useState(getInitialState('kidsModeCompletedIds', []));
  
  const [currentMysteries, setCurrentMysteries] = useState(getRandomMysteries(allMysteries, MYSTERIES_TO_SHOW));
  
  // EFECTOS PARA GUARDAR
  useEffect(() => { localStorage.setItem('kidsModePoints', JSON.stringify(points)); }, [points]);
  useEffect(() => { localStorage.setItem('kidsModeDiscoveries', JSON.stringify(discoveries)); }, [discoveries]);
  useEffect(() => { localStorage.setItem('kidsModeClue', JSON.stringify(unlockedClue)); }, [unlockedClue]);
  useEffect(() => { localStorage.setItem('kidsModeTheme', JSON.stringify(unlockedTheme)); }, [unlockedTheme]);
  
  useEffect(() => { localStorage.setItem('kidsModeAstronaut', JSON.stringify(unlockedAstronaut)); }, [unlockedAstronaut]);
  useEffect(() => { localStorage.setItem('kidsModeUFO', JSON.stringify(unlockedUFO)); }, [unlockedUFO]);
  useEffect(() => { localStorage.setItem('kidsModeRocketComp', JSON.stringify(unlockedRocketCompanion)); }, [unlockedRocketCompanion]);
  useEffect(() => { localStorage.setItem('kidsModeAlien', JSON.stringify(unlockedAlien)); }, [unlockedAlien]); 
  useEffect(() => { localStorage.setItem('kidsModeStar', JSON.stringify(unlockedStar)); }, [unlockedStar]);
  
  useEffect(() => { localStorage.setItem('kidsModeStep', JSON.stringify(step)); }, [step]);
  useEffect(() => { localStorage.setItem('kidsModeCompletedIds', JSON.stringify(completedMysteryIds)); }, [completedMysteryIds]);

  // CORRECCIÓN DE ESTADO INCONSISTENTE
  useEffect(() => {
    if (step === 'investigate' && !selectedMystery) {
      setStep('mysteries');
    }
  }, [step, selectedMystery]); 
  
  // RECARGAR MISTERIOS CUANDO SE TERMINAN
  useEffect(() => {
    if (completedMysteryIds.length === MYSTERIES_TO_SHOW && allMysteries.length > MYSTERIES_TO_SHOW) {
      alert("🎉 ¡Felicidades! Completaste todas las misiones. Cargando un nuevo conjunto de misterios...");
      setCompletedMysteryIds([]);
      setCurrentMysteries(getRandomMysteries(allMysteries, MYSTERIES_TO_SHOW));
    }
  }, [completedMysteryIds]);

  const resetInvestigationState = useCallback(() => {
    setGuess(null);
    setShowResult(false);
  }, []);

  const handleRedeem = (itemCost, itemType) => {
    if (points >= itemCost) {
      setPoints(prevPoints => prevPoints - itemCost);
      
      switch (itemType) {
        case 'clue':
          setUnlockedClue(true);
          alert("✨ ¡Pistas desbloqueadas! Puedes usar una en tu próxima misión.");
          break;
        case 'theme':
          setUnlockedTheme(true);
          alert("🚀 ¡Nuevo tema de cohete desbloqueado! Revisa la pantalla de misterios.");
          break;
        case 'astronaut': 
          setUnlockedAstronaut(true);
          alert("🧑‍🚀 ¡Compañero Astronauta desbloqueado! ¡Revisa la pantalla principal!");
          break;
        case 'ufo':
          setUnlockedUFO(true);
          alert("🛸 ¡Contacto Extraterrestre! ¡El OVNI se une a la tripulación!");
          break;
        case 'rocketCompanion': 
          setUnlockedRocketCompanion(true);
          alert("🚀 ¡Lanzamiento! ¡Un cohete personal se une a Kepler!");
          break;
        case 'alien': 
          setUnlockedAlien(true);
          alert("👽 ¡Alien Amigable desbloqueado! ¡Llegó un nuevo explorador!");
          break;
        case 'star':
          setUnlockedStar(true);
          alert("🌟 ¡Estrellas Doradas desbloqueadas! ¡Kepler tiene nuevos efectos!");
          break;
        default:
          break;
      }
      
    } else {
      alert("🚨 ¡Puntos insuficientes! Resuelve más misterios para canjear.");
    }
  };

  // BLOQUE DE KEPLER - AVATAR CON COMPAÑEROS (CORREGIDO)
  const keplerAvatarOnlyBlock = (
    <div className={`kepler-avatar-container ${unlockedStar ? 'star-unlocked' : ''}`}>
      {/* Compañeros IZQUIERDA */}
      {unlockedAlien && <div className="companion companion-alien">👽</div>}
      {unlockedAstronaut && <div className="companion companion-astronaut">🧑‍🚀</div>}
      
      {/* KEPLER EN EL CENTRO */}
      <div className="kepler-body">🐕‍🦺</div>
      
      {/* Compañeros DERECHA */}
      {unlockedUFO && <div className="companion companion-ufo">🛸</div>}
      {unlockedRocketCompanion && <div className="companion companion-rocket">🚀</div>}
    </div>
  );

  // BLOQUE COMPLETO CON BURBUJA DE DIÁLOGO
  const keplerCharacterBlock = (
  <div className="kepler-character">
    <div className="character-bubble">
      <p className="speech-bubble">
        🐶 "Woof! Hi Space Explorer! I'm Kepler the Space Dog...
      </p>
    </div>
    
    {keplerAvatarOnlyBlock}
  </div>
);

  // RENDERIZADO DE PANTALLAS
  const renderMainMenu = () => (
    <div className="kids-welcome">
      {keplerCharacterBlock}

      <div className="kids-intro">
        <h1 className="kids-title">
          <Star className="inline" /> Become a Planet Detective! <Star className="inline" />
        </h1>
        
        <div className="kids-info-cards">
          <div className="kids-card">
            <div className="kids-card-icon">🔭</div>
            <h3>What's an Exoplanet?</h3>
            <p>It's a planet that orbits a star that's NOT our Sun! 
            They're super far away - so far that even the fastest rocket would take thousands of years to reach them!</p>
          </div>

          <div className="kids-card">
            <div className="kids-card-icon">🌟</div>
            <h3>How Do We Find Them?</h3>
            <p>When a planet passes in front of its star, the star looks a tiny bit dimmer - like when you put your hand in front of a flashlight! 
            Our space telescopes watch for these tiny dimming patterns.</p>
          </div>

          <div className="kids-card">
            <div className="kids-card-icon">🎮</div>
            <h3>Your Mission</h3>
            <p>Look at the clues Kepler gives you and figure out: Is it a REAL planet, a planet we need to study more, or something else pretending to be a planet?</p>
          </div>
        </div>

        <button 
          className="kids-start-btn"
          onClick={() => {
            setStep('mysteries');
            resetInvestigationState();
          }}
        >
          <Rocket className="inline mr-2" />
          Start My Space Adventure!
        </button>
      </div>
    </div>
  );

  const renderMysteries = () => {
    const availableMysteries = currentMysteries.filter(m => !completedMysteryIds.includes(m.id));

    return (
      <div className="kids-mysteries">
        <div className="kids-header">
          <button 
            className="kids-main-menu-btn" 
            onClick={() => setStep('mainMenu')}
          >
            <Menu className="inline mr-1" size={20} /> Main Menu
          </button>
          
          <div className="kids-stats">
            <div className="stat-badge">
              <Award className="inline" /> {points} Space Points
            </div>
            <div className="stat-badge">
              <Star className="inline" /> {discoveries} Planets Found
            </div>
          </div>
        </div>

        <div className="kepler-helper">
            {keplerAvatarOnlyBlock}
            <div className="helper-bubble">
                🐕‍🦺 "Pick a mystery to solve! You have {availableMysteries.length} missions left in this set."
            </div>
          
        </div>

        <h2 className="kids-section-title">Choose Your Space Mystery!</h2>
        
        <div className="mysteries-grid">
          {availableMysteries.map((mystery) => (
            <div 
              key={mystery.id}
              className="mystery-card"
              onClick={() => {
                setSelectedMystery(mystery);
                setStep('investigate');
                resetInvestigationState();
              }}
            >
              <div className="mystery-icon">{mystery.icon}</div>
              <h3>{mystery.title}</h3>
              <p>{mystery.description}</p>
              {unlockedTheme && <div className="theme-indicator">🚀 NEW!</div>} 
              <div className="mystery-difficulty">
                <Sparkles className="inline" size={16} />
                {mystery.difficulty}
              </div>
              <div className="mystery-example">
                Real example: {mystery.realExample}
              </div>
            </div>
          ))}
        </div>

        <div className="kids-learn-more">
            <button 
              className="btn-learn"
              onClick={() => setStep('learn')}
            >
              <Book className="inline mr-2" />
              Learn More About Planets
            </button>
            <button 
              className="btn-redeem-nav"
              onClick={() => setStep('rewards')}
            >
              <Award className="inline mr-2" />
              Rewards Center
            </button>
        </div>
      </div>
    );
  };

  const renderInvestigation = () => {
    const handleGuess = (answer) => {
      setGuess(answer);
      setShowResult(true);
      
      if (answer === selectedMystery.answer) {
        setPoints(prevPoints => prevPoints + 100);
        if (answer === 'CONFIRMED') {
          setDiscoveries(prevDiscoveries => prevDiscoveries + 1);
        }
      }
    };

    return (
      <div className="kids-investigation">
        
        <div className="kepler-helper">
          <div className="helper-bubble">
            🐕‍🦺 "Look at the clues carefully! Real planet detectives take their time and think about what each clue means!"
          </div>
          {keplerAvatarOnlyBlock}
        </div>
        
        <h2 className="mystery-title-big">{selectedMystery.icon} {selectedMystery.title}</h2>
        <p className="mystery-desc">{selectedMystery.description}</p>

        <div className="clues-section">
          <h3>🔍 The Clues:</h3>
          {unlockedClue && (
              <button 
                  className="btn-hint" 
                  onClick={() => {
                      alert(`HINT: The planet's size is ${selectedMystery.clues.size}.`);
                      setUnlockedClue(false); 
                  }}
              >
                  Use Hint (UNLOCKED)
              </button>
          )}

          <div className="clues-grid">
            {Object.entries(selectedMystery.clues).map(([key, value]) => (
              <div key={key} className="clue-card">
                <div className="clue-label">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                <div className="clue-value">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {!showResult ? (
          <div className="guess-section">
            <h3>What do you think? 🤔</h3>
            <div className="guess-buttons">
              <button 
                className="guess-btn real"
                onClick={() => handleGuess('CONFIRMED')}
              >
                <Star className="inline" />
                <div>It's a REAL Planet!</div>
                <small>(100% sure it exists)</small>
              </button>
              
              <button 
                className="guess-btn maybe"
                onClick={() => handleGuess('CANDIDATE')}
              >
                <Sparkles className="inline" />
                <div>Probably a Planet!</div>
                <small>(Needs more observations)</small>
              </button>
              
              <button 
                className="guess-btn fake"
                onClick={() => handleGuess('FALSE POSITIVE')}
              >
                <div style={{fontSize: '24px'}}>❌</div>
                <div>NOT a Planet!</div>
                <small>(Something else tricked us)</small>
              </button>
            </div>
          </div>
        ) : (
          <div className={`result-section ${guess === selectedMystery.answer ? 'correct' : 'incorrect'}`}>
            {guess === selectedMystery.answer ? (
              <>
                <div className="result-icon">🎉</div>
                <h2>Amazing Job, Space Detective!</h2>
                <p>You got it right! You earned 100 space points!</p>
                <div className="fun-fact-box">
                  <h4>🌟 Cool Space Fact:</h4>
                  <p>{selectedMystery.funFact}</p>
                </div>
              </>
            ) : (
              <>
                <div className="result-icon">🤔</div>
                <h2>Good Try! Keep Learning!</h2>
                <p>The answer was: <strong>{selectedMystery.answer}</strong></p>
                <p>Real scientists make mistakes too - that's how we learn!</p>
                <div className="fun-fact-box">
                  <h4>🌟 Here's Why:</h4>
                  <p>{selectedMystery.funFact}</p>
                </div>
              </>
            )}
            
            <div className="result-actions">
              <button 
                className="btn-next"
                onClick={() => {
                  setStep('mysteries');
                  setSelectedMystery(null);
                  setCompletedMysteryIds(prevIds => [...prevIds, selectedMystery.id]); 
                  resetInvestigationState();
                }}
              >
                <Rocket className="inline mr-2" />
                Solve Another Mystery!
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderLearn = () => (
    <div className="kids-learn">
      <h2 className="kids-section-title">🎓 Planet Detective School</h2>
      
      <div className="learn-cards">
        <div className="learn-card">
          <div className="learn-icon">🌡️</div>
          <h3>Temperature Zones</h3>
          <div className="temp-scale">
            <div className="temp-item cold">
              <span>❄️ Too Cold</span>
              <p>Water is frozen solid!</p>
              <small>Like Pluto</small>
            </div>
            <div className="temp-item perfect">
              <span>🌈 Just Right!</span>
              <p>Perfect for liquid water!</p>
              <small>Like Earth</small>
            </div>
            <div className="temp-item hot">
              <span>🔥 Too Hot</span>
              <p>Water boils away!</p>
              <small>Like Venus</small>
            </div>
          </div>
        </div>

        <div className="learn-card">
          <div className="learn-icon">📏</div>
          <h3>Planet Sizes</h3>
          <div className="size-visual">
            <div className="planet-example small">
              <div className="planet-circle">🌍</div>
              <p><strong>Earth</strong></p>
              <p>1 Earth radius</p> 
            </div>
            <div className="planet-example medium">
              <div className="planet-circle">🔵</div>
              <p><strong>Super-Earth</strong></p>
              <p>2-3 Earth radii</p> 
            </div>
            <div className="planet-example large">
              <div className="planet-circle">🪐</div>
              <p><strong>Gas Giant</strong></p>
              <p>10+ Earth radii</p> 
            </div>
          </div>
        </div>

        <div className="learn-card full-width">
          <div className="learn-icon">🎬</div>
          <h3>How Transit Detection Works</h3>
          <div className="transit-explanation">
            <div className="transit-step">
              <div className="step-number">1</div>
              <div className="step-visual">⭐</div>
              <p>Star shines bright</p>
            </div>
            <div className="arrow">→</div>
            <div className="transit-step">
              <div className="step-number">2</div>
              <div className="step-visual">🪐⭐</div>
              <p>Planet passes in front</p>
            </div>
            <div className="arrow">→</div>
            <div className="transit-step">
              <div className="step-number">3</div>
              <div className="step-visual">🌙</div>
              <p>Star looks dimmer</p>
            </div>
            <div className="arrow">→</div>
            <div className="transit-step">
              <div className="step-number">4</div>
              <div className="step-visual">🔭</div>
              <p>We detect it!</p>
            </div>
          </div>
          <p className="transit-note">
            💡 <strong>Fun Fact:</strong> The bigger the planet, the more light it blocks! 
            That's why it's easier to find big planets like Jupiter than small ones like Earth.
          </p>
        </div>

        <div className="learn-card">
          <div className="learn-icon">⏰</div>
          <h3>Orbit Time</h3>
          <p>How long it takes to go around the star:</p>
          <ul className="learn-list">
            <li>🌍 <strong>Earth:</strong> 365 days (1 year)</li>
            <li>🔥 <strong>Hot planets:</strong> 1-10 days</li>
            <li>🥶 <strong>Far planets:</strong> Many years</li>
          </ul>
          <p className="learn-note">Closer = Faster!</p>
        </div>

        <div className="learn-card">
          <div className="learn-icon">🤔</div>
          <h3>False Positives</h3>
          <p>Sometimes things LOOK like planets but aren't:</p>
          <ul className="learn-list">
            <li>👥 Two stars eclipsing each other</li>
            <li>🌟 The star itself getting dimmer</li>
            <li>📸 The telescope making a mistake</li>
          </ul>
          <p className="learn-note">That's why we need smart AI to help!</p>
        </div>
      </div>

      <button 
        className="btn-back"
        onClick={() => {
          setStep('mysteries');
          resetInvestigationState();
        }}
      >
        ← Back to Mysteries
      </button>
    </div>
  );

  const renderRewards = () => (
    <div className="kids-rewards">
        <h2 className="kids-section-title">🎁 Space Rewards Center 🎁</h2>
        <p className="current-points">Your Points: <Award className="inline" /> <span style={{fontSize: '24px', fontWeight: 'bold'}}>{points}</span></p>

        <div className="rewards-grid">
            <div className={`reward-card ${unlockedClue ? 'unlocked' : ''}`}>
                <h3>Unlock Extra Clues</h3>
                <p>Use a hint on a tough mystery!</p>
                <p className="cost">Cost: {CLUE_COST} Points</p>
                <button 
                    className="btn-redeem"
                    onClick={() => handleRedeem(CLUE_COST, 'clue')}
                    disabled={unlockedClue || points < CLUE_COST}
                >
                    {unlockedClue ? 'UNLOCKED' : `REDEEM (${CLUE_COST})`}
                </button>
            </div>

            <div className={`reward-card ${unlockedTheme ? 'unlocked' : ''}`}>
                <h3>New Rocket Theme</h3>
                <p>Change the look of your command center!</p>
                <p className="cost">Cost: {THEME_COST} Points</p>
                <button 
                    className="btn-redeem"
                    onClick={() => handleRedeem(THEME_COST, 'theme')}
                    disabled={unlockedTheme || points < THEME_COST}
                >
                    {unlockedTheme ? 'UNLOCKED' : `REDEEM (${THEME_COST})`}
                </button>
            </div>
            
            <div className={`reward-card ${unlockedAstronaut ? 'unlocked' : ''}`}>
                <h3>Astronaut Companion</h3>
                <p>Get a human friend for Kepler's crew!</p>
                <p className="cost">Cost: {SUIT_COST} Points</p>
                <button 
                    className="btn-redeem"
                    onClick={() => handleRedeem(SUIT_COST, 'astronaut')} 
                    disabled={unlockedAstronaut || points < SUIT_COST}
                >
                    {unlockedAstronaut ? 'UNLOCKED' : `REDEEM (${SUIT_COST})`}
                </button>
            </div>
            
            <div className={`reward-card ${unlockedUFO ? 'unlocked' : ''}`}>
                <h3>UFO Companion</h3>
                <p>Unlock a friendly alien spacecraft!</p>
                <p className="cost">Cost: {STAR_COST} Points</p>
                <button 
                    className="btn-redeem"
                    onClick={() => handleRedeem(STAR_COST, 'ufo')} 
                    disabled={unlockedUFO || points < STAR_COST}
                >
                    {unlockedUFO ? 'UNLOCKED' : `REDEEM (${STAR_COST})`}
                </button>
            </div>
            
            <div className={`reward-card ${unlockedAlien ? 'unlocked' : ''}`}>
                <h3>Alien Companion</h3>
                <p>Add a fun, green alien friend!</p>
                <p className="cost">Cost: {ALIEN_COST} Points</p>
                <button 
                    className="btn-redeem"
                    onClick={() => handleRedeem(ALIEN_COST, 'alien')} 
                    disabled={unlockedAlien || points < ALIEN_COST}
                >
                    {unlockedAlien ? 'UNLOCKED' : `REDEEM (${ALIEN_COST})`}
                </button>
            </div>
            
            <div className={`reward-card ${unlockedRocketCompanion ? 'unlocked' : ''}`}>
                <h3>Personal Rocket</h3>
                <p>Add a rocket to your exploration fleet!</p>
                <p className="cost">Cost: {THEME_ROCKET_COST} Points</p>
                <button 
                    className="btn-redeem"
                    onClick={() => handleRedeem(THEME_ROCKET_COST, 'rocketCompanion')} 
                    disabled={unlockedRocketCompanion || points < THEME_ROCKET_COST}
                >
                    {unlockedRocketCompanion ? 'UNLOCKED' : `REDEEM (${THEME_ROCKET_COST})`}
                </button>
            </div>

            <div className={`reward-card ${unlockedStar ? 'unlocked' : ''}`}>
                <h3>Golden Star Effect</h3>
                <p>Add a cool sparkle effect to Kepler!</p>
                <p className="cost">Cost: {STAR_COST} Points</p>
                <button 
                    className="btn-redeem"
                    onClick={() => handleRedeem(STAR_COST, 'star')}
                    disabled={unlockedStar || points < STAR_COST}
                >
                    {unlockedStar ? 'UNLOCKED' : `REDEEM (${STAR_COST})`}
                </button>
            </div>

        </div>

        <button 
            className="btn-back"
            onClick={() => setStep('mysteries')}
        >
            ← Back to Missions
        </button>
    </div>
  );

  return (
    <div className={`kids-mode-container ${unlockedTheme ? 'theme-rocket' : ''}`}>
      <button className="kids-exit-btn" onClick={onExit}>
        <Home size={20} />
        Exit Kids Mode
      </button>
      
      {step === 'mainMenu' && renderMainMenu()}
      {step === 'mysteries' && renderMysteries()}
      {step === 'investigate' && selectedMystery && renderInvestigation()} 
      {step === 'learn' && renderLearn()}
      {step === 'rewards' && renderRewards()}
    </div>
  );
};

export default KidsMode;
// src/data/mysteriesData.js
// Contiene 100 misterios para garantizar alta rejugabilidad.

export const allMysteries = [
    // --- TUS 4 MISTERIOS ORIGINALES (Base) ---
    {
      id: 1,
      title: "The Super Hot Giant",
      description: "This planet is HUGE like Jupiter and super close to its star! It's so hot, metal would melt there!",
      difficulty: "Easy",
      icon: "🔥",
      clues: {
        size: "Very Big (like Jupiter)",
        temperature: "Super Hot! (over 1000°C)",
        orbitTime: "Very Fast (only 3 days)",
        distance: "Super close to its star"
      },
      answer: "CONFIRMED",
      funFact: "This is called a 'Hot Jupiter'! Scientists think it formed far away and then moved closer to its star. Imagine if Jupiter was as close to the Sun as Mercury! 🥵",
      realExample: "Kepler-7b"
    },
    {
      id: 2,
      title: "Earth's Cousin",
      description: "This planet is about the same size as Earth and orbits in the 'Goldilocks Zone' - not too hot, not too cold!",
      difficulty: "Medium",
      icon: "🌍",
      clues: {
        size: "Earth-sized (1-2 Earth radius)",
        temperature: "Just right! (like Spring)",
        orbitTime: "About 1 year",
        distance: "Perfect distance from star"
      },
      answer: "CANDIDATE",
      funFact: "This planet is in the 'Goldilocks Zone' where water could be liquid! Just like the three bears' porridge - not too hot, not too cold, just right! Scientists need more observations to be 100% sure it's really a planet. 🐻",
      realExample: "Similar to Kepler-452b"
    },
    {
      id: 3,
      title: "The Tricky Shadow",
      description: "Something is blocking starlight, but our space detective tools say it's NOT a planet! What could it be?",
      difficulty: "Hard",
      icon: "🕵️",
      clues: {
        size: "Changes shape (weird!)",
        temperature: "Inconsistent",
        orbitTime: "Irregular pattern",
        distance: "The light comes from the wrong place!"
      },
      answer: "FALSE POSITIVE",
      funFact: "This was actually TWO stars orbiting each other! When one passes in front of the other, it looks like a planet transit, but it's really a stellar eclipse. They were playing hide and seek! The telescope got confused, but our AI figured it out! 💫",
      realExample: "Similar to many Kepler false positives"
    },
    {
      id: 4,
      title: "The Mini Neptune",
      description: "This planet is bigger than Earth but smaller than Neptune. It might have clouds of water vapor!",
      difficulty: "Easy",
      icon: "💧",
      clues: {
        size: "Medium (2-4 Earth radius)",
        temperature: "Cool (like Antarctica)",
        orbitTime: "12 days around its star",
        distance: "Close, but not too close"
      },
      answer: "CONFIRMED",
      funFact: "Planets like this are called 'Mini-Neptunes' or 'Super-Earths'. They're the most common type of planet we've found so far! Our solar system doesn't have any, which makes them extra interesting! 🪐",
      realExample: "Kepler-11b"
    },

    // --- 96 MISTERIOS ADICIONALES (Para completar 100) ---
    ...Array.from({ length: 96 }, (_, i) => {
        const id = i + 5;
        const types = [
            { title: "Ocean World", icon: "🌊", size: "Medium (3 Earth radius)", temp: "Moderate", orbit: "50 days", answer: "CONFIRMED" },
            { title: "Rocky Lava World", icon: "🌋", size: "Small (1.5 Earth radius)", temp: "Very Hot", orbit: "5 days", answer: "CONFIRMED" },
            { title: "Ice Giant", icon: "🥶", size: "Big (like Neptune)", temp: "Super Cold", orbit: "500 days", answer: "CANDIDATE" },
            { title: "Starspot Signal", icon: "⚫", size: "Appears small", temp: "Varies (star is active)", orbit: "Irregular", answer: "FALSE POSITIVE" },
            { title: "Binary Star Effect", icon: "⭐", size: "Inconsistent", temp: "Double Hot", orbit: "Very close", answer: "FALSE POSITIVE" },
            { title: "Tidally Locked World", icon: "☯️", size: "Earth-sized", temp: "One side burning", orbit: "30 days", answer: "CONFIRMED" },
            { title: "Desert Planet", icon: "🏜️", size: "Small (1 Earth radius)", temp: "Hot", orbit: "200 days", answer: "CANDIDATE" }
        ];
        const mysteryType = types[id % types.length];
        
        return {
            id: id,
            title: mysteryType.title + ` #${id}`,
            description: `A distant world discovered by the Kepler Space Dog team. Its characteristics suggest a mystery related to a ${mysteryType.title.toLowerCase()}.`,
            difficulty: ["Easy", "Medium", "Hard"][id % 3],
            icon: mysteryType.icon,
            clues: {
                size: mysteryType.size,
                temperature: mysteryType.temp,
                orbitTime: mysteryType.orbit,
                distance: ["Close to its star", "Far from its star", "Just perfect distance"][id % 3]
            },
            answer: mysteryType.answer,
            funFact: `This is a unique find! The transit data suggests ${mysteryType.answer === 'FALSE POSITIVE' ? 'the dip in light was caused by a star' : 'this world is truly special. We need to keep watching it!'}`,
            realExample: `Generated Data ID ${id}`
        };
    })
];
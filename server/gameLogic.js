const assignSecretSanta = (participants) => {
    // Participants: [{ id, name }]
    const names = participants.map(p => p.name);
    let assignments = {};

    // Simple verification to prevent infinite loops (though with >2 shuffle usually works)
    if (names.length < 2) return null;

    let success = false;
    while (!success) {
        const shuffled = [...names].sort(() => 0.5 - Math.random());
        let valid = true;
        const tempAssignments = {};

        for (let i = 0; i < names.length; i++) {
            if (names[i] === shuffled[i]) {
                valid = false;
                break;
            }
            tempAssignments[names[i]] = shuffled[i];
        }

        if (valid) {
            assignments = tempAssignments;
            success = true;
        }
    }
    return assignments;
};

module.exports = { assignSecretSanta };

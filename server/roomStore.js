const rooms = new Map();

// Room structure:
// {
//   id: string,
//   participants: [{ id: string, name: string }],
//   assignments: { [participantName]: assignedName },
//   status: 'waiting' | 'started'
// }

const createRoom = (roomId) => {
    if (rooms.has(roomId)) return false;
    rooms.set(roomId, {
        id: roomId,
        participants: [],
        assignments: {},
        status: 'waiting'
    });
    return true;
};

const getRoom = (roomId) => rooms.get(roomId);

const joinRoom = (roomId, participant) => {
    const room = rooms.get(roomId);
    if (!room) return { error: 'Room not found' };
    if (room.status !== 'waiting') return { error: 'Game already started' };

    const nameExists = room.participants.some(p => p.name.toLowerCase() === participant.name.toLowerCase());
    if (nameExists) return { error: 'Name already taken in this room' };

    room.participants.push(participant);
    return { success: true, room };
};

const removeParticipant = (roomId, socketId) => {
    const room = rooms.get(roomId);
    if (!room) return;
    room.participants = room.participants.filter(p => p.id !== socketId);
    if (room.participants.length === 0) {
        rooms.delete(roomId);
    }
    return room;
};

module.exports = {
    createRoom,
    getRoom,
    joinRoom,
    removeParticipant
};

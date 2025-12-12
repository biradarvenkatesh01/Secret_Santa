const { createRoom, getRoom, joinRoom, removeParticipant } = require('./roomStore');
const { assignSecretSanta } = require('./gameLogic');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.on('create_room', (callback) => {
            // Generate 6 digit alphanumeric code
            const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
            const created = createRoom(roomId);
            if (created) {
                callback({ success: true, roomId });
            } else {
                callback({ error: 'Failed to create room, try again' });
            }
        });

        socket.on('join_room', ({ roomId, name }, callback) => {
            const result = joinRoom(roomId, { id: socket.id, name });
            if (result.error) {
                return callback({ error: result.error });
            }

            socket.join(roomId);
            // Notify others in room
            socket.to(roomId).emit('player_joined', result.room.participants);
            // Return current participants to joiner
            callback({ success: true, participants: result.room.participants });

            // Store roomId on socket for disconnect handling
            socket.roomId = roomId;
        });

        socket.on('start_game', ({ roomId }, callback) => {
            const room = getRoom(roomId);
            if (!room) return callback({ error: 'Room not found' });

            // Basic validation
            if (room.participants.length < 2) {
                return callback({ error: 'Need at least 2 players to start' });
            }

            const assignments = assignSecretSanta(room.participants);
            if (!assignments) {
                return callback({ error: 'Failed to generate assignments' });
            }

            room.assignments = assignments;
            room.status = 'started';

            // Send assignments to everyone. 
            // NOTE: In a real app with strict privacy, we might want to ONLY send the individual's assignment.
            // But to simplify the MVP event broadcast, we can send a "game_started" event and let client fetch or 
            // send the specific assignment to specific socket.

            // Better approach for privacy: Loop through participants and emit to specific socket
            room.participants.forEach(p => {
                const assignedToName = assignments[p.name];
                io.to(p.id).emit('game_started', { assignedTo: assignedToName });
            });

            callback({ success: true });
        });

        socket.on('disconnect', () => {
            if (socket.roomId) {
                const room = removeParticipant(socket.roomId, socket.id);
                if (room) {
                    io.to(socket.roomId).emit('player_left', room.participants);
                }
            }
            console.log('Client disconnected:', socket.id);
        });
    });
};

// components/Chat/ParticipantsList.jsx
const ParticipantsList = ({ participants, onRemove, isAdmin }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h3 className="font-medium">Participants</h3>
      </div>
      <div className="divide-y">
        {participants.map((participant) => (
          <div
            key={participant._id}
            className="p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {participant.profilePicture ? (
                <img
                  src={participant.profilePicture}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-700 font-medium">
                    {participant.name[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <div className="font-medium">{participant.name}</div>
                <div className="text-sm text-gray-500">{participant.email}</div>
              </div>
            </div>
            {isAdmin && (
              <button
                onClick={() => onRemove(participant._id)}
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default ParticipantsList;

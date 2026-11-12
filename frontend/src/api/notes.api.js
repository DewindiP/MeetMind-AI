
import api from "./axios";

export const createNote = async (meetingId, content) => {
  const response = await api.post(`/meetings/${meetingId}/notes`, {
    content,
  });

  return response.data.data.note;
};

export const updateNote = async (meetingId, noteId, content) => {
  const response = await api.patch(
    `/meetings/${meetingId}/notes/${noteId}`,
    { content },
  );

  return response.data.data.note;
};

export const deleteNote = async (meetingId, noteId) => {
  const response = await api.delete(
    `/meetings/${meetingId}/notes/${noteId}`,
  );

  return response.data;
};

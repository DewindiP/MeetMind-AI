
import api from "./axios";

export const getMeetings = async (params = {}) => {
  const response = await api.get("/meetings", { params });
  return response.data.data;
};

export const getMeetingById = async (id) => {
  const response = await api.get(`/meetings/${id}`);
  return response.data.data.meeting;
};

export const createMeeting = async (meetingData) => {
  const response = await api.post("/meetings", meetingData);
  return response.data.data.meeting;
};

export const updateMeeting = async (id, meetingData) => {
  const response = await api.patch(`/meetings/${id}`, meetingData);
  return response.data.data.meeting;
};

export const deleteMeeting = async (id) => {
  const response = await api.delete(`/meetings/${id}`);
  return response.data;
};

export const generateMeetingSummary = async (id) => {
  const response = await api.post(`/meetings/${id}/ai-summary`);
  return response.data.data;
};

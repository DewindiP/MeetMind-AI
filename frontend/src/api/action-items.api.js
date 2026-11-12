
import api from "./axios";

export const createActionItem = async (meetingId, itemData) => {
  const response = await api.post(
    `/meetings/${meetingId}/action-items`,
    itemData,
  );

  return response.data.data.actionItem;
};

export const updateActionItem = async (meetingId, itemId, itemData) => {
  const response = await api.patch(
    `/meetings/${meetingId}/action-items/${itemId}`,
    itemData,
  );

  return response.data.data.actionItem;
};

export const deleteActionItem = async (meetingId, itemId) => {
  const response = await api.delete(
    `/meetings/${meetingId}/action-items/${itemId}`,
  );

  return response.data;
};

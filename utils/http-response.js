const handleResponse = (statusCode, message, data, resp) => {
  const payload = {
    statusCode,
    message,
    data: data ?? {},
    success: statusCode < 400,
    timestamp: new Date().toISOString(),
  };

  return resp.status(statusCode).json(payload);
};

export default handleResponse;
